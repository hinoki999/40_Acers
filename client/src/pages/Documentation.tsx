import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Property } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Eye, Shield, Building, Camera, Video, Search, Filter, Clock, CheckCircle, AlertCircle, Upload, Plus, X, FileCheck, User, MessageSquare } from "lucide-react";

interface Document {
  id: number;
  filename: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  category: string;
  status: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  tags: string[];
  propertyId?: number;
  property?: {
    address: string;
    city: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DocumentReview {
  id: number;
  documentId: number;
  reviewerId: string;
  reviewer: {
    firstName: string;
    lastName: string;
    role: string;
    specializations: string[];
  };
  status: string;
  comments: string;
  checklist: any;
  reviewedAt: string;
  estimatedReviewTime: number;
}

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [verificationStatus, setVerificationStatus] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading: loadingProperties } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: documents = [], isLoading: loadingDocuments } = useQuery({
    queryKey: ["/api/documents", searchTerm, documentType, verificationStatus],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: documentReviews = [] } = useQuery({
    queryKey: ["/api/documents/reviews", selectedDocument?.id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!selectedDocument,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is now under review.",
      });
      setShowUploadModal(false);
      setIsUploading(false);
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    },
  });

  const requestReviewMutation = useMutation({
    mutationFn: async (documentId: number) => 
      apiRequest(`/api/documents/${documentId}/request-review`, { method: "POST" }),
    onSuccess: () => {
      toast({
        title: "Review Requested",
        description: "A lawyer has been notified to review your document.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
  });



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />;
      case "needs_revision":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-neutral-400" />;
      default:
        return <FileText className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "needs_revision":
        return <Badge className="bg-orange-100 text-orange-800">Needs Revision</Badge>;
      case "pending":
        return <Badge className="bg-neutral-100 text-neutral-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', 'other');
    formData.append('category', 'general');
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      await uploadMutation.mutateAsync(formData);
      clearInterval(interval);
      setUploadProgress(100);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "deed":
        return <Building className="h-5 w-5 text-blue-600" />;
      case "title":
        return <Shield className="h-5 w-5 text-green-600" />;
      case "llc":
        return <FileText className="h-5 w-5 text-purple-600" />;
      case "financial":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "image":
        return <Camera className="h-5 w-5 text-pink-600" />;
      case "video":
        return <Video className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-neutral-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = documentType === "all" || doc.documentType === documentType;
    const matchesStatus = verificationStatus === "all" || doc.status === verificationStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIconComponent = (status: string) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "pending":
        return Clock;
      case "rejected":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const documentStats = {
    total: filteredDocuments.length,
    verified: filteredDocuments.filter(d => d.status === "approved").length,
    pending: filteredDocuments.filter(d => d.status === "pending").length,
    rejected: filteredDocuments.filter(d => d.status === "rejected").length
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Documentation Repository</h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Secure repository for all property documents, smart contracts, and verification records
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{documentStats.total}</div>
                  <div className="text-indigo-100 text-sm">Total Documents</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-300">{documentStats.verified}</div>
                  <div className="text-indigo-100 text-sm">Verified</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-300">{documentStats.pending}</div>
                  <div className="text-indigo-100 text-sm">Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-300">{documentStats.rejected}</div>
                  <div className="text-indigo-100 text-sm">Rejected</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Properties Overview */}
            {properties.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6 text-center">Available Investment Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {properties.slice(-3).reverse().map((property: Property) => (
                    <Card key={property.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="text-lg font-bold text-white">{property.address}</div>
                        <div className="text-indigo-200 text-sm mb-2">{property.city}, {property.state}</div>
                        <div className="text-2xl font-bold text-white mb-1">
                          ${Number(property.propertyValue).toLocaleString()}
                        </div>
                        <div className="text-indigo-200 text-xs mb-3">
                          {property.propertyType} • {property.squareFootage?.toLocaleString()} sq ft
                        </div>
                        <div className="flex justify-center items-center gap-4 text-sm">
                          <div className="text-green-300 font-semibold">
                            {property.rentalYield}% Yield
                          </div>
                          <div className="text-indigo-200">
                            ${Number(property.sharePrice).toFixed(2)}/share
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <Input
                placeholder="Search documents or properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deed">Property Deeds</SelectItem>
                  <SelectItem value="title">Title Documents</SelectItem>
                  <SelectItem value="llc">LLC Documents</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredDocuments.length !== documents.length && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                {filteredDocuments.length} of {documents.length} documents
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setDocumentType("all");
                  setVerificationStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Document Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex justify-center space-x-1 bg-neutral-100 p-1 rounded-lg w-fit mx-auto">
              <Button variant="default" size="sm" className="bg-white shadow-sm">
                All Documents
              </Button>
              <Button variant="ghost" size="sm">
                Smart Contracts
              </Button>
              <Button variant="ghost" size="sm">
                Verification Records
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload size={16} className="mr-1" />
                Upload Document
              </Button>
            </div>

            <div className="space-y-6">
              {loadingDocuments ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                          <div className="h-4 bg-neutral-200 rounded w-full"></div>
                          <div className="h-8 bg-neutral-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">No Documents Found</h3>
                  <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                    {searchTerm || documentType !== "all" || verificationStatus !== "all"
                      ? "Try adjusting your search criteria or filters."
                      : "No documents have been uploaded yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((document) => {
                    const IconComponent = getDocumentIcon(document.documentType);
                    const StatusIcon = getStatusIconComponent(document.status);
                    
                    return (
                      <Card key={document.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <IconComponent className="text-white" size={20} />
                              </div>
                              <div>
                                <CardTitle className="text-lg truncate">{document.originalName}</CardTitle>
                                <p className="text-sm text-neutral-600">{document.property?.address || 'No property linked'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                              <StatusIcon size={12} className="mr-1" />
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {document.documentType.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm text-neutral-600">
                              <span>Size:</span>
                              <span>{formatFileSize(document.fileSize)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-neutral-600">
                              <span>Uploaded:</span>
                              <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye size={14} className="mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Download size={14} className="mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload size={20} />
              Upload Document
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Property
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property: Property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Document Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deed">Property Deed</SelectItem>
                    <SelectItem value="title">Title Document</SelectItem>
                    <SelectItem value="llc">LLC Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description (Optional)
              </label>
              <Textarea 
                placeholder="Add a description for this document..."
                rows={3}
              />
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  handleFileUpload(files[0]);
                }
              }}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="text-neutral-400" size={24} />
                </div>
                <div>
                  <p className="text-lg font-medium text-neutral-900">
                    Drop your file here, or click to browse
                  </p>
                  <p className="text-sm text-neutral-600">
                    Supports PDF, DOC, DOCX, JPG, PNG, MP4 (Max 10MB)
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Plus size={16} className="mr-2" />
                  Choose File
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
