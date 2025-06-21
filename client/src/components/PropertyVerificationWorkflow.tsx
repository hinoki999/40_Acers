import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Camera, 
  Shield, 
  User,
  Building,
  Eye,
  MessageSquare,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  completedAt?: string;
  notes?: string;
  documents?: string[];
  score?: number;
}

interface PropertyVerification {
  id: number;
  propertyId: number;
  status: 'submitted' | 'under_review' | 'verified' | 'rejected';
  overallScore: number;
  steps: VerificationStep[];
  reviewerNotes: string;
  submittedAt: string;
  completedAt?: string;
}

interface PropertyVerificationWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  userRole: 'owner' | 'admin' | 'reviewer';
}

export default function PropertyVerificationWorkflow({ 
  isOpen, 
  onClose, 
  propertyId, 
  userRole 
}: PropertyVerificationWorkflowProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [stepScore, setStepScore] = useState(5);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: verification, isLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}/verification`],
    enabled: isOpen && !!propertyId,
  });

  const updateStepMutation = useMutation({
    mutationFn: async (data: { stepId: string; status: string; notes: string; score: number }) => {
      return apiRequest(`/api/properties/${propertyId}/verification/steps/${data.stepId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: data.status,
          notes: data.notes,
          score: data.score
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/verification`] });
      toast({
        title: "Step Updated",
        description: "Verification step has been updated successfully",
      });
    },
  });

  const verificationSteps: VerificationStep[] = [
    {
      id: 'document_review',
      title: 'Document Authentication',
      description: 'Verify property deed, title, and legal documents',
      status: 'completed',
      assignedTo: 'Legal Team',
      completedAt: '2024-01-15',
      score: 9,
      documents: ['deed.pdf', 'title_report.pdf', 'survey.pdf']
    },
    {
      id: 'financial_analysis',
      title: 'Financial Assessment',
      description: 'Analyze property value, cash flow, and investment potential',
      status: 'in_progress',
      assignedTo: 'Financial Analyst',
      score: 8,
    },
    {
      id: 'property_inspection',
      title: 'Physical Inspection',
      description: 'On-site property condition and compliance verification',
      status: 'pending',
      assignedTo: 'Inspector',
    },
    {
      id: 'legal_compliance',
      title: 'Legal Compliance',
      description: 'Ensure SEC and state regulatory compliance',
      status: 'pending',
      assignedTo: 'Compliance Officer',
    },
    {
      id: 'insurance_verification',
      title: 'Insurance Coverage',
      description: 'Verify adequate property insurance and liability coverage',
      status: 'pending',
      assignedTo: 'Insurance Specialist',
    },
    {
      id: 'market_analysis',
      title: 'Market Valuation',
      description: 'Independent market analysis and comparable sales review',
      status: 'pending',
      assignedTo: 'Market Analyst',
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStepUpdate = (stepId: string, status: string) => {
    updateStepMutation.mutate({
      stepId,
      status,
      notes: reviewNotes,
      score: stepScore
    });
    setSelectedStep(null);
    setReviewNotes("");
    setStepScore(5);
  };

  const overallProgress = (verificationSteps.filter(step => step.status === 'completed').length / verificationSteps.length) * 100;
  const averageScore = verificationSteps
    .filter(step => step.score)
    .reduce((sum, step) => sum + (step.score || 0), 0) / verificationSteps.filter(step => step.score).length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Property Verification Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verification Progress</span>
                <Badge className={getStatusColor('in_progress')}>
                  Under Review
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {verificationSteps.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Steps Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {verificationSteps.filter(s => s.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Steps Remaining</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verification Steps</h3>
            {verificationSteps.map((step, index) => (
              <Card key={step.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                          {index + 1}
                        </span>
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <Badge className={getStatusColor(step.status)}>
                            {step.status.replace('_', ' ')}
                          </Badge>
                          {step.score && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{step.score}/10</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                        {step.assignedTo && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                            <User className="h-4 w-4" />
                            <span>Assigned to: {step.assignedTo}</span>
                          </div>
                        )}
                        {step.completedAt && (
                          <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed: {step.completedAt}</span>
                          </div>
                        )}
                        {step.documents && (
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div className="flex gap-1">
                              {step.documents.map((doc, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Notes:</span>
                            </div>
                            <p>{step.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {userRole === 'admin' || userRole === 'reviewer' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Review Modal */}
          {selectedStep && (
            <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Verification Step</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Score (1-10)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stepScore}
                      onChange={(e) => setStepScore(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1</span>
                      <span className="font-medium">{stepScore}</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Review Notes</label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your review notes..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStepUpdate(selectedStep, 'completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStepUpdate(selectedStep, 'rejected')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => setSelectedStep(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}