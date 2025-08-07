import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Search, Calendar, Building } from "lucide-react";

interface InvestorReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function InvestorReportsModal({ isOpen, onClose, property }: InvestorReportsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["/api/property-reports", property?.id],
    queryFn: () => fetch(`/api/property-reports/property/${property?.id}`).then(res => res.json()),
    enabled: !!property?.id && isOpen
  });

  const filteredReports = reports.filter((report: any) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.quarterYear?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (report: any) => {
    if (report.pdfUrl) {
      window.open(report.pdfUrl, '_blank');
    } else {
      // Generate PDF on the fly if not cached
      window.open(`/api/property-reports/${report.id}/pdf`, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'milestone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'financial': return 'Financial';
      case 'maintenance': return 'Maintenance';
      case 'milestone': return 'Milestone';
      default: return 'Update';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property Reports - {property?.address}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, type, or quarter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-neutral-500">Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Reports Found</h3>
                <p className="text-neutral-500">
                  {searchTerm ? "No reports match your search criteria." : "No reports have been published for this property yet."}
                </p>
              </div>
            ) : (
              filteredReports.map((report: any) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getReportTypeColor(report.reportType)}>
                            {getReportTypeLabel(report.reportType)}
                          </Badge>
                          {report.quarterYear && (
                            <Badge variant="outline" className="text-xs">
                              {report.quarterYear}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Published: {formatDate(report.publishedAt || report.createdAt)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(report)}
                        className="ml-4"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-neutral-700 text-sm leading-relaxed">
                      {report.content.length > 200 
                        ? `${report.content.substring(0, 200)}...` 
                        : report.content
                      }
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">About Property Reports</h5>
                <p className="text-sm text-blue-800">
                  Property reports are sent by the business owner to keep you informed about 
                  property performance, maintenance updates, financial results, and important milestones. 
                  All reports are available in PDF format for your records.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}