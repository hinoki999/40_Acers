import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import DocumentUpload from "./DocumentUpload";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

interface DocumentRequirement {
  category: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  status?: 'missing' | 'uploaded' | 'pending' | 'verified' | 'rejected';
  document?: any;
}

interface PropertyDocumentManagerProps {
  propertyId?: number;
  mode?: 'listing' | 'management';
  onCompletionChange?: (completed: boolean) => void;
}

export default function PropertyDocumentManager({ 
  propertyId, 
  mode = 'listing',
  onCompletionChange 
}: PropertyDocumentManagerProps) {
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  const { data: documentRequirements } = useQuery({
    queryKey: ["/api/documents/requirements"],
  });

  const { data: existingDocuments = [], refetch: refetchDocuments } = useQuery({
    queryKey: ["/api/documents", propertyId],
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (documentRequirements) {
      const updatedRequirements = documentRequirements.map((req: any) => {
        const existingDoc = existingDocuments.find((doc: any) => doc.category === req.category);
        return {
          ...req,
          status: existingDoc ? getDocumentStatus(existingDoc.status) : 'missing',
          document: existingDoc
        };
      });
      setRequirements(updatedRequirements);
    }
  }, [documentRequirements, existingDocuments]);

  useEffect(() => {
    if (onCompletionChange) {
      const requiredDocs = requirements.filter(req => req.required);
      const completedRequired = requiredDocs.filter(req => 
        req.status === 'verified' || req.status === 'uploaded'
      );
      const isComplete = requiredDocs.length > 0 && completedRequired.length === requiredDocs.length;
      onCompletionChange(isComplete);
    }
  }, [requirements, onCompletionChange]);

  const getDocumentStatus = (status: string): 'missing' | 'uploaded' | 'pending' | 'verified' | 'rejected' => {
    switch (status) {
      case 'verified': return 'verified';
      case 'rejected': return 'rejected';
      case 'pending-review': return 'pending';
      case 'pending': return 'uploaded';
      default: return 'missing';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'uploaded':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <Upload className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadComplete = async (documents: any[]) => {
    await refetchDocuments();
    setShowUploader(false);
    setSelectedCategory(null);
    
    toast({
      title: "Documents uploaded",
      description: `${documents.length} document(s) uploaded successfully`,
    });
  };

  const handleDocumentClick = (requirement: DocumentRequirement) => {
    if (requirement.status === 'missing') {
      setSelectedCategory(requirement.category);
      setShowUploader(true);
    }
  };

  const handleUploadClick = (category: string) => {
    setSelectedCategory(category);
    setShowUploader(true);
  };

  const calculateProgress = () => {
    const total = requirements.length;
    const completed = requirements.filter(req => 
      req.status === 'verified' || req.status === 'uploaded'
    ).length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const calculateRequiredProgress = () => {
    const requiredDocs = requirements.filter(req => req.required);
    const completedRequired = requiredDocs.filter(req => 
      req.status === 'verified' || req.status === 'uploaded'
    ).length;
    return requiredDocs.length > 0 ? (completedRequired / requiredDocs.length) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Verification Progress
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchDocuments()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Required Documents</span>
                <span>{Math.round(calculateRequiredProgress())}% Complete</span>
              </div>
              <Progress value={calculateRequiredProgress()} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>All Documents</span>
                <span>{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Requirements List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requirements.map((requirement) => (
              <div
                key={requirement.category}
                className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                  requirement.status === 'missing' ? 'hover:border-blue-300' : ''
                }`}
                onClick={() => handleDocumentClick(requirement)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(requirement.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {requirement.name}
                        </h4>
                        {requirement.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(requirement.status)}`}
                        >
                          {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {requirement.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Accepted formats: {requirement.acceptedFormats.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {requirement.document && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(requirement.document.url || `/uploads/documents/${requirement.document.filename}`, '_blank');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = requirement.document.url || `/uploads/documents/${requirement.document.filename}`;
                            link.download = requirement.document.originalName;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {requirement.status === 'missing' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUploadClick(requirement.category);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                    {requirement.status !== 'missing' && requirement.status !== 'verified' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUploadClick(requirement.category);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Dialog */}
      {showUploader && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Upload Document: {requirements.find(r => r.category === selectedCategory)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {requirements.find(r => r.category === selectedCategory)?.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploader(false);
                    setSelectedCategory(null);
                  }}
                >
                  Close
                </Button>
              </div>
              
              <DocumentUpload
                propertyId={propertyId}
                onUploadComplete={handleUploadComplete}
                existingDocuments={[]}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'listing' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Document Verification Required
                </h4>
                <p className="text-sm text-blue-800">
                  All required documents must be uploaded and verified before your property 
                  can be listed for investment. Our team will review your documents within 2-3 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}