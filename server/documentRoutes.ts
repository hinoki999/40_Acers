import { Express, Request, Response } from "express";
import { db } from "./db";
import { documents, documentReviews, verifiers, users, properties } from "@shared/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for document uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomId}${extension}`);
  }
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/quicktime'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, MP4, and MOV files are allowed.'));
    }
  }
});

export function registerDocumentRoutes(app: Express): void {
  
  // Get user documents
  app.get("/api/documents", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { searchTerm, documentType, verificationStatus } = req.query;

      let query = db
        .select({
          id: documents.id,
          userId: documents.userId,
          propertyId: documents.propertyId,
          filename: documents.filename,
          originalName: documents.originalName,
          fileUrl: documents.fileUrl,
          fileSize: documents.fileSize,
          mimeType: documents.mimeType,
          documentType: documents.documentType,
          category: documents.category,
          status: documents.status,
          verificationNotes: documents.verificationNotes,
          verifiedBy: documents.verifiedBy,
          verifiedAt: documents.verifiedAt,
          rejectionReason: documents.rejectionReason,
          tags: documents.tags,
          isPublic: documents.isPublic,
          createdAt: documents.createdAt,
          updatedAt: documents.updatedAt,
          property: {
            address: properties.address,
            city: properties.city,
            state: properties.state,
          }
        })
        .from(documents)
        .leftJoin(properties, eq(documents.propertyId, properties.id))
        .where(eq(documents.userId, userId!))
        .orderBy(desc(documents.createdAt));

      const userDocuments = await query;
      res.json(userDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Upload document
  app.post("/api/documents/upload", isAuthenticated, uploadDocument.single('file'), async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { documentType, category, propertyId, tags } = req.body;
      const fileUrl = `/uploads/documents/${file.filename}`;
      
      const parsedTags = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

      const [document] = await db.insert(documents).values({
        userId: userId!,
        propertyId: propertyId ? parseInt(propertyId) : null,
        filename: file.filename,
        originalName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentType: documentType || 'other',
        category: category || 'general',
        status: 'pending',
        tags: parsedTags,
        isPublic: false,
      }).returning();

      // Auto-assign to a verifier if it's a legal document
      if (['deed', 'title', 'llc'].includes(documentType)) {
        const [availableVerifier] = await db
          .select()
          .from(verifiers)
          .where(eq(verifiers.isActive, true))
          .orderBy(verifiers.reviewCount)
          .limit(1);

        if (availableVerifier) {
          await db.update(documents)
            .set({ status: 'under_review' })
            .where(eq(documents.id, document.id));

          await db.insert(documentReviews).values({
            documentId: document.id,
            reviewerId: availableVerifier.userId,
            status: 'under_review',
            comments: 'Document assigned for legal review',
            estimatedReviewTime: 72, // 3 days
          });

          // Update verifier review count
          await db.update(verifiers)
            .set({ reviewCount: availableVerifier.reviewCount + 1 })
            .where(eq(verifiers.id, availableVerifier.id));
        }
      }

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Request document review
  app.post("/api/documents/:documentId/request-review", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const documentId = parseInt(req.params.documentId);

      // Verify document ownership
      const [document] = await db
        .select()
        .from(documents)
        .where(and(
          eq(documents.id, documentId),
          eq(documents.userId, userId!)
        ));

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Find an available verifier
      const [availableVerifier] = await db
        .select()
        .from(verifiers)
        .where(eq(verifiers.isActive, true))
        .orderBy(verifiers.reviewCount)
        .limit(1);

      if (!availableVerifier) {
        return res.status(503).json({ error: "No verifiers available at the moment" });
      }

      // Update document status
      await db.update(documents)
        .set({ 
          status: 'under_review',
          updatedAt: new Date()
        })
        .where(eq(documents.id, documentId));

      // Create review record
      await db.insert(documentReviews).values({
        documentId,
        reviewerId: availableVerifier.userId,
        status: 'under_review',
        comments: 'Review requested by user',
        estimatedReviewTime: 72,
      });

      // Update verifier review count
      await db.update(verifiers)
        .set({ reviewCount: availableVerifier.reviewCount + 1 })
        .where(eq(verifiers.id, availableVerifier.id));

      res.json({ success: true });
    } catch (error) {
      console.error("Error requesting review:", error);
      res.status(500).json({ error: "Failed to request review" });
    }
  });

  // Get document reviews
  app.get("/api/documents/reviews/:documentId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.documentId);
      
      const reviews = await db
        .select({
          id: documentReviews.id,
          documentId: documentReviews.documentId,
          reviewerId: documentReviews.reviewerId,
          status: documentReviews.status,
          comments: documentReviews.comments,
          checklist: documentReviews.checklist,
          reviewedAt: documentReviews.reviewedAt,
          estimatedReviewTime: documentReviews.estimatedReviewTime,
          reviewer: {
            firstName: users.firstName,
            lastName: users.lastName,
            role: verifiers.role,
            specializations: verifiers.specializations,
          }
        })
        .from(documentReviews)
        .leftJoin(verifiers, eq(documentReviews.reviewerId, verifiers.userId))
        .leftJoin(users, eq(verifiers.userId, users.id))
        .where(eq(documentReviews.documentId, documentId))
        .orderBy(desc(documentReviews.reviewedAt));

      res.json(reviews);
    } catch (error) {
      console.error("Error fetching document reviews:", error);
      res.status(500).json({ error: "Failed to fetch document reviews" });
    }
  });

  // Approve/reject document (for verifiers)
  app.post("/api/documents/:documentId/review", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const documentId = parseInt(req.params.documentId);
      const { status, comments, checklist } = req.body;

      // Verify user is a verifier
      const [verifier] = await db
        .select()
        .from(verifiers)
        .where(and(
          eq(verifiers.userId, userId!),
          eq(verifiers.isActive, true)
        ));

      if (!verifier) {
        return res.status(403).json({ error: "Not authorized to review documents" });
      }

      // Update document status
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'approved') {
        updateData.verifiedBy = userId;
        updateData.verifiedAt = new Date();
      } else if (status === 'rejected') {
        updateData.rejectionReason = comments;
      }

      await db.update(documents)
        .set(updateData)
        .where(eq(documents.id, documentId));

      // Create review record
      await db.insert(documentReviews).values({
        documentId,
        reviewerId: userId!,
        status,
        comments,
        checklist,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error reviewing document:", error);
      res.status(500).json({ error: "Failed to review document" });
    }
  });

  // Get pending documents for review (for verifiers)
  app.get("/api/documents/pending-review", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      // Verify user is a verifier
      const [verifier] = await db
        .select()
        .from(verifiers)
        .where(and(
          eq(verifiers.userId, userId!),
          eq(verifiers.isActive, true)
        ));

      if (!verifier) {
        return res.status(403).json({ error: "Not authorized to view pending reviews" });
      }

      const pendingDocs = await db
        .select({
          id: documents.id,
          originalName: documents.originalName,
          documentType: documents.documentType,
          fileSize: documents.fileSize,
          createdAt: documents.createdAt,
          uploader: {
            firstName: users.firstName,
            lastName: users.lastName,
          },
          property: {
            address: properties.address,
            city: properties.city,
            state: properties.state,
          }
        })
        .from(documents)
        .leftJoin(users, eq(documents.userId, users.id))
        .leftJoin(properties, eq(documents.propertyId, properties.id))
        .where(or(
          eq(documents.status, 'pending'),
          eq(documents.status, 'under_review')
        ))
        .orderBy(desc(documents.createdAt));

      res.json(pendingDocs);
    } catch (error) {
      console.error("Error fetching pending documents:", error);
      res.status(500).json({ error: "Failed to fetch pending documents" });
    }
  });

  // Serve uploaded documents
  app.get("/uploads/documents/:filename", (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', 'documents', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });
}