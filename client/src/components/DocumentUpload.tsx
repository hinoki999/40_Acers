import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye,
  Download,
  Trash2
} from "lucide-react";

interface DocumentFile {
  id: string;
  file: File;
  category: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

interface DocumentUploadProps {
  propertyId?: number;
  onUploadComplete?: (documents: DocumentFile[]) => void;
  existingDocuments?: any[];
}

const DOCUMENT_CATEGORIES = {
  'property-deed': 'Property Deed',
  'title-insurance': 'Title Insurance',
  'property-survey': 'Property Survey',
  'inspection-report': 'Inspection Report',
  'appraisal': 'Property Appraisal',
  'insurance': 'Property Insurance',
  'financial-statements': 'Financial Statements',
  'rental-agreement': 'Rental Agreement',
  'property-photos': 'Property Photos',
  'floor-plans': 'Floor Plans',
  'permits': 'Building Permits',
  'tax-records': 'Tax Records',
  'other': 'Other Documents'
};

const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg,.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUpload({ propertyId, onUploadComplete, existingDocuments = [] }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('property-deed');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return 'File type not supported. Please upload PDF, Word, Excel, or image files.';
    }
    
    return null;
  };

  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newDocuments: DocumentFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "File validation failed",
          description: `${file.name}: ${error}`,
          variant: "destructive",
        });
        return;
      }

      const document: DocumentFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        category: selectedCategory,
        status: 'pending',
        progress: 0
      };

      newDocuments.push(document);
    });

    if (newDocuments.length > 0) {
      setDocuments(prev => [...prev, ...newDocuments]);
      toast({
        title: "Files added",
        description: `${newDocuments.length} file(s) ready for upload`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const uploadDocument = async (document: DocumentFile) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id ? { ...doc, status: 'uploading', progress: 0 } : doc
      )
    );

    const formData = new FormData();
    formData.append('file', document.file);
    formData.append('category', document.category);
    if (propertyId) {
      formData.append('propertyId', propertyId.toString());
    }

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === document.id && doc.progress < 90 
              ? { ...doc, progress: doc.progress + 10 } 
              : doc
          )
        );
      }, 200);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id 
            ? { 
                ...doc, 
                status: 'completed', 
                progress: 100, 
                url: result.url 
              } 
            : doc
        )
      );

      toast({
        title: "Document uploaded",
        description: `${document.file.name} has been uploaded successfully`,
      });

    } catch (error) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id 
            ? { 
                ...doc, 
                status: 'error', 
                progress: 0,
                error: 'Upload failed. Please try again.' 
              } 
            : doc
        )
      );

      toast({
        title: "Upload failed",
        description: `Failed to upload ${document.file.name}`,
        variant: "destructive",
      });
    }
  };

  const uploadAllDocuments = async () => {
    const pendingDocuments = documents.filter(doc => doc.status === 'pending');
    
    if (pendingDocuments.length === 0) {
      toast({
        title: "No documents to upload",
        description: "Please add some documents first",
        variant: "destructive",
      });
      return;
    }

    for (const document of pendingDocuments) {
      await uploadDocument(document);
    }

    if (onUploadComplete) {
      const completedDocuments = documents.filter(doc => doc.status === 'completed');
      onUploadComplete(completedDocuments);
    }
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Document Category</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF, Word, Excel, and image files up to 10MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents to Upload</CardTitle>
            <Button
              onClick={uploadAllDocuments}
              disabled={documents.every(doc => doc.status !== 'pending')}
            >
              Upload All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {getFileIcon(document.file)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {document.file.name}
                      </p>
                      <Badge variant="secondary">
                        {DOCUMENT_CATEGORIES[document.category as keyof typeof DOCUMENT_CATEGORIES]}
                      </Badge>
                      {getStatusIcon(document.status)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {(document.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {document.status === 'uploading' && (
                      <Progress value={document.progress} className="mt-2" />
                    )}
                    {document.error && (
                      <p className="text-xs text-red-500 mt-1">{document.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {document.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadDocument(document)}
                      >
                        Upload
                      </Button>
                    )}
                    {document.status === 'completed' && document.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(document.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeDocument(document.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <FileText className="h-6 w-6 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.filename}
                      </p>
                      <Badge variant="secondary">
                        {DOCUMENT_CATEGORIES[doc.category as keyof typeof DOCUMENT_CATEGORIES] || doc.category}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}