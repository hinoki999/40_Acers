import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";
import { 
  Download, 
  FileText, 
  Calendar, 
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  Building
} from "lucide-react";

interface PaymentTransaction {
  id: number;
  propertyId?: number;
  transactionType: "listing_fee" | "investment" | "withdrawal";
  amount: string;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  receiptUrl?: string;
  receiptNumber?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: any;
}

interface PaymentHistoryProps {
  userId: string;
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useQuery<PaymentTransaction[]>({
    queryKey: ["/api/payments/history", userId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const downloadReceipt = (receiptUrl: string) => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(`/api/payments/export-csv/${userId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `40acres-transactions-${Date.now()}.csv`;
      a.click();
      
      toast({
        title: "Export Successful",
        description: "Transaction history downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to download transaction history",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "pending": return "bg-yellow-600";
      case "failed": return "bg-red-600";
      case "refunded": return "bg-neutral-600";
      default: return "bg-neutral-600";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "listing_fee": return <Building size={16} />;
      case "investment": return <TrendingUp size={16} />;
      case "withdrawal": return <DollarSign size={16} />;
      default: return <CreditCard size={16} />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "listing_fee": return "Listing Fee";
      case "investment": return "Investment";
      case "withdrawal": return "Withdrawal";
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt size={20} />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-neutral-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration
  const mockTransactions: PaymentTransaction[] = [
    {
      id: 1,
      propertyId: 1,
      transactionType: "listing_fee",
      amount: "10000",
      currency: "USD",
      status: "completed",
      paymentMethod: "stripe",
      receiptUrl: "/api/receipts/receipt-40A-LST-123.pdf",
      receiptNumber: "40A-LST-1234567890",
      createdAt: "2024-06-18T10:30:00Z",
      completedAt: "2024-06-18T10:31:00Z",
      metadata: { propertyValue: 500000, feePercentage: 2.0 }
    },
    {
      id: 2,
      propertyId: 2,
      transactionType: "investment",
      amount: "25000",
      currency: "USD",
      status: "completed",
      paymentMethod: "stripe",
      receiptUrl: "/api/receipts/receipt-40A-INV-456.pdf",
      receiptNumber: "40A-INV-9876543210",
      createdAt: "2024-06-17T14:15:00Z",
      completedAt: "2024-06-17T14:16:00Z",
      metadata: { shares: 100 }
    },
    {
      id: 3,
      propertyId: 3,
      transactionType: "investment",
      amount: "15000",
      currency: "USD",
      status: "pending",
      paymentMethod: "stripe",
      receiptNumber: "40A-INV-1357924680",
      createdAt: "2024-06-19T09:45:00Z",
      metadata: { shares: 60 }
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt size={20} />
            Payment History
          </div>
          <Button
            onClick={downloadCSV}
            variant="outline"
            size="sm"
          >
            <FileText className="mr-2" size={16} />
            Export CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="mx-auto mb-4 text-neutral-400" size={48} />
            <h3 className="text-lg font-semibold text-neutral-600 mb-2">No Transactions Yet</h3>
            <p className="text-neutral-500">
              Your payment history will appear here once you start investing or listing properties.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((transaction) => (
              <Card key={transaction.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {getTransactionLabel(transaction.transactionType)}
                          </span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-neutral-600">
                          {transaction.receiptNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${parseFloat(transaction.amount).toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Payment Method:</span>
                      <div className="capitalize">{transaction.paymentMethod}</div>
                    </div>
                    
                    {transaction.propertyId && (
                      <div>
                        <span className="font-medium">Property ID:</span>
                        <div>#{transaction.propertyId}</div>
                      </div>
                    )}
                    
                    {transaction.metadata?.shares && (
                      <div>
                        <span className="font-medium">Shares:</span>
                        <div>{transaction.metadata.shares} shares</div>
                      </div>
                    )}
                    
                    {transaction.metadata?.feePercentage && (
                      <div>
                        <span className="font-medium">Fee Rate:</span>
                        <div>{transaction.metadata.feePercentage}%</div>
                      </div>
                    )}
                  </div>

                  {transaction.status === "completed" && transaction.receiptUrl && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        onClick={() => downloadReceipt(transaction.receiptUrl!)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Download className="mr-2" size={16} />
                        Download Receipt
                      </Button>
                    </div>
                  )}

                  {transaction.completedAt && (
                    <div className="text-xs text-neutral-500 mt-2">
                      Completed on {new Date(transaction.completedAt).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}