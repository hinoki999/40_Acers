import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Property } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Shield, Building, Camera, Video, Search, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [verificationStatus, setVerificationStatus] = useState("all");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Mock document data - in production this would come from the API
  const mockDocuments = (properties as Property[]).flatMap((property) => [
    ...(property.deedDocuments || []).map((doc, index) => ({
      id: `deed-${property.id}-${index}`,
      propertyId: property.id,
      propertyAddress: property.address,
      type: "deed",
      fileName: `Deed_${property.address.replace(/\s+/g, '_')}_${index + 1}.pdf`,
      url: doc,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationStatus: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)] as "verified" | "pending" | "rejected",
      size: Math.floor(Math.random() * 5000 + 500) + " KB"
    })),
    ...(property.titleDocuments || []).map((doc, index) => ({
      id: `title-${property.id}-${index}`,
      propertyId: property.id,
      propertyAddress: property.address,
      type: "title",
      fileName: `Title_${property.address.replace(/\s+/g, '_')}_${index + 1}.pdf`,
      url: doc,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationStatus: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)] as "verified" | "pending" | "rejected",
      size: Math.floor(Math.random() * 5000 + 500) + " KB"
    })),
    ...(property.llcDocuments || []).map((doc, index) => ({
      id: `llc-${property.id}-${index}`,
      propertyId: property.id,
      propertyAddress: property.address,
      type: "llc",
      fileName: `LLC_${property.address.replace(/\s+/g, '_')}_${index + 1}.pdf`,
      url: doc,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationStatus: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)] as "verified" | "pending" | "rejected",
      size: Math.floor(Math.random() * 5000 + 500) + " KB"
    })),
    ...(property.propertyImages || []).map((img, index) => ({
      id: `image-${property.id}-${index}`,
      propertyId: property.id,
      propertyAddress: property.address,
      type: "image",
      fileName: `Image_${property.address.replace(/\s+/g, '_')}_${index + 1}.jpg`,
      url: img,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationStatus: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)] as "verified" | "pending" | "rejected",
      size: Math.floor(Math.random() * 2000 + 200) + " KB"
    })),
    ...(property.propertyVideos || []).map((video, index) => ({
      id: `video-${property.id}-${index}`,
      propertyId: property.id,
      propertyAddress: property.address,
      type: "video",
      fileName: `Video_${property.address.replace(/\s+/g, '_')}_${index + 1}.mp4`,
      url: video,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationStatus: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)] as "verified" | "pending" | "rejected",
      size: Math.floor(Math.random() * 50000 + 5000) + " KB"
    }))
  ]);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = documentType === "all" || doc.type === documentType;
    const matchesStatus = verificationStatus === "all" || doc.verificationStatus === verificationStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "deed":
      case "title":
      case "llc":
        return FileText;
      case "image":
        return Camera;
      case "video":
        return Video;
      default:
        return FileText;
    }
  };

  const getStatusIcon = (status: string) => {
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
    total: mockDocuments.length,
    verified: mockDocuments.filter(d => d.verificationStatus === "verified").length,
    pending: mockDocuments.filter(d => d.verificationStatus === "pending").length,
    rejected: mockDocuments.filter(d => d.verificationStatus === "rejected").length
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
          
          {filteredDocuments.length !== mockDocuments.length && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                {filteredDocuments.length} of {mockDocuments.length} documents
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
            </div>

            <div className="space-y-6">
              {isLoading ? (
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
                    const IconComponent = getDocumentIcon(document.type);
                    const StatusIcon = getStatusIcon(document.verificationStatus);
                    
                    return (
                      <Card key={document.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <IconComponent className="text-white" size={20} />
                              </div>
                              <div>
                                <CardTitle className="text-lg truncate">{document.fileName}</CardTitle>
                                <p className="text-sm text-neutral-600">{document.propertyAddress}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getStatusColor(document.verificationStatus)}`}>
                              <StatusIcon size={12} className="mr-1" />
                              {document.verificationStatus.charAt(0).toUpperCase() + document.verificationStatus.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {document.type.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm text-neutral-600">
                              <span>Size:</span>
                              <span>{document.size}</span>
                            </div>
                            <div className="flex justify-between text-sm text-neutral-600">
                              <span>Uploaded:</span>
                              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
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
    </div>
  );
}