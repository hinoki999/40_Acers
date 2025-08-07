import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Upload, Send, Calendar } from "lucide-react";

interface PropertyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function PropertyReportModal({ isOpen, onClose, property }: PropertyReportModalProps) {
  const [reportData, setReportData] = useState({
    title: "",
    content: "",
    reportType: "update",
    quarterYear: "",
    attachments: [] as string[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReport = useMutation({
    mutationFn: (data: any) => apiRequest("/api/property-reports", "POST", data),
    onSuccess: () => {
      toast({
        title: "Report Sent Successfully",
        description: "Your property report has been sent to all investors and saved as PDF.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/property-reports"] });
      onClose();
      setReportData({
        title: "",
        content: "",
        reportType: "update",
        quarterYear: "",
        attachments: []
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.title || !reportData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createReport.mutate({
      ...reportData,
      propertyId: property.id,
      businessOwnerId: property.ownerId
    });
  };

  const getCurrentQuarter = () => {
    const now = new Date();
    const quarter = Math.floor((now.getMonth() + 3) / 3);
    return `Q${quarter} ${now.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Send Property Report - {property?.address}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportData.reportType} onValueChange={(value) => setReportData({ ...reportData, reportType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">General Update</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="maintenance">Maintenance Update</SelectItem>
                  <SelectItem value="milestone">Milestone Achievement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quarterYear">Quarter/Year</Label>
              <Input
                id="quarterYear"
                placeholder={getCurrentQuarter()}
                value={reportData.quarterYear}
                onChange={(e) => setReportData({ ...reportData, quarterYear: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              placeholder="Q4 2024 Property Performance Update"
              value={reportData.title}
              onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Report Content</Label>
            <Textarea
              id="content"
              placeholder="Provide detailed information about the property performance, maintenance updates, financial results, or any other relevant information for your investors..."
              value={reportData.content}
              onChange={(e) => setReportData({ ...reportData, content: e.target.value })}
              rows={8}
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Report Distribution</h5>
                <p className="text-sm text-blue-800">
                  This report will be automatically sent to all investors who have shares in this property. 
                  A PDF version will be generated and stored for future reference.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReport.isPending}
              className="bg-[#A52A2A] hover:bg-[#8B1A1A]"
            >
              <Send className="h-4 w-4 mr-2" />
              {createReport.isPending ? "Sending..." : "Send Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}