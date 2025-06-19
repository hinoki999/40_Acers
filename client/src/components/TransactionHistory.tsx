import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Receipt, TrendingUp, DollarSign, Calendar, Filter } from "lucide-react";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  receiptNumber: string;
  propertyId?: number;
  propertyAddress?: string;
  createdAt: string;
  receiptUrl?: string;
  metadata?: any;
}

interface Investment {
  id: number;
  sharesPurchased: number;
  investmentAmount: string;
  purchasePrice: string;
  createdAt: string;
  property: {
    id: number;
    address: string;
    city: string;
    state: string;
  };
}

export default function TransactionHistory() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/payments/history"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: investments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ["/api/investments"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const downloadReceipt = async (receiptUrl: string, receiptNumber: string) => {
    try {
      const response = await fetch(receiptUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Receipt Downloaded",
        description: `Receipt ${receiptNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await apiRequest("GET", "/api/payments/export-csv");
      const csvData = await response.text();
      
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `40acres-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "CSV Exported",
        description: "Transaction history has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export transaction history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    if (selectedFilter === "all") return true;
    return transaction.type === selectedFilter;
  });

  if (transactionsLoading || investmentsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Receipt className="text-primary" size={20} />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
                <p className="text-neutral-600">View and download your investment records</p>
              </div>
            </div>
            <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="investment">Investments</TabsTrigger>
              <TabsTrigger value="listing_fee">Listing Fees</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedFilter} className="mt-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No transactions found</h3>
                  <p className="text-neutral-600">Start investing to see your transaction history here.</p>
                </div>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction: Transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-neutral-400" />
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.propertyAddress ? (
                              <div className="text-sm">
                                <div className="font-medium">{transaction.propertyAddress}</div>
                                <div className="text-neutral-500">ID: {transaction.propertyId}</div>
                              </div>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${parseFloat(transaction.amount).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-mono">
                              {transaction.receiptNumber}
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.receiptUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadReceipt(transaction.receiptUrl!, transaction.receiptNumber)}
                                className="flex items-center gap-1"
                              >
                                <Download size={12} />
                                PDF
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      {investments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-secondary" size={20} />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Investment Portfolio</CardTitle>
                <p className="text-neutral-600">Your current property investments</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment: Investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="font-medium">{investment.property.address}</div>
                    <div className="text-sm text-neutral-600">
                      {investment.property.city}, {investment.property.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{investment.sharesPurchased} shares</div>
                    <div className="text-sm text-neutral-600">
                      ${parseFloat(investment.investmentAmount).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-sm text-neutral-600">Purchased</div>
                    <div className="text-sm">
                      {new Date(investment.createdAt).toLocaleDateString()}
                    </div>
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