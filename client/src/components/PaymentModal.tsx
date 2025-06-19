import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CreditCard, 
  Download, 
  CheckCircle, 
  Loader2,
  DollarSign,
  FileText,
  Calendar
} from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: "listing_fee" | "investment";
  amount: number;
  propertyId: number;
  propertyValue?: number;
  shares?: number;
  userId: string;
  onSuccess?: () => void;
}

interface PaymentFormProps {
  amount: number;
  paymentType: "listing_fee" | "investment";
  propertyId: number;
  propertyValue?: number;
  shares?: number;
  userId: string;
  onSuccess?: () => void;
  onClose: () => void;
}

const PaymentForm = ({ 
  amount, 
  paymentType, 
  propertyId, 
  propertyValue, 
  shares, 
  userId, 
  onSuccess,
  onClose 
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setPaymentCompleted(true);
        toast({
          title: "Payment Successful",
          description: `Your ${paymentType === 'listing_fee' ? 'listing fee' : 'investment'} payment has been processed successfully!`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReceipt = () => {
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
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to download transaction history",
        variant: "destructive",
      });
    }
  };

  if (paymentCompleted) {
    return (
      <div className="text-center space-y-6 p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
          <p className="text-neutral-600">
            {paymentType === 'listing_fee' 
              ? 'Your property listing fee has been paid. Your listing will be activated shortly.' 
              : `Your investment of $${amount.toLocaleString()} has been processed successfully.`
            }
          </p>
          {receiptNumber && (
            <p className="text-sm text-neutral-500 mt-2">
              Receipt #: {receiptNumber}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button 
            onClick={downloadReceipt}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!receiptUrl}
          >
            <Download className="mr-2" size={16} />
            Download Receipt (PDF)
          </Button>
          
          <Button 
            onClick={downloadCSV}
            variant="outline"
            className="w-full"
          >
            <FileText className="mr-2" size={16} />
            Export Transaction History (CSV)
          </Button>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Transaction Summary</span>
              <Badge className="bg-blue-600">
                {paymentType === 'listing_fee' ? 'Listing Fee' : 'Investment'}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold">${amount.toLocaleString()}</span>
              </div>
              
              {paymentType === 'listing_fee' && propertyValue && (
                <>
                  <div className="flex justify-between">
                    <span>Property Value:</span>
                    <span>${propertyValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Rate:</span>
                    <span>{((amount / propertyValue) * 100).toFixed(2)}%</span>
                  </div>
                </>
              )}
              
              {paymentType === 'investment' && shares && (
                <div className="flex justify-between">
                  <span>Shares:</span>
                  <span>{shares} shares</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Property ID:</span>
                <span>#{propertyId}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentElement />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="mr-2" size={16} />
              Pay ${amount.toLocaleString()}
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>

      <div className="text-xs text-neutral-500 text-center">
        <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
        <p>Powered by Stripe • PCI DSS Level 1 Compliant</p>
      </div>
    </form>
  );
};

export default function PaymentModal({
  isOpen,
  onClose,
  paymentType,
  amount,
  propertyId,
  propertyValue,
  shares,
  userId,
  onSuccess
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !clientSecret) {
      initializePayment();
    }
  }, [isOpen]);

  const initializePayment = async () => {
    setIsLoading(true);
    try {
      const endpoint = paymentType === 'listing_fee' 
        ? '/api/payments/listing-fee'
        : '/api/payments/investment';
      
      const payload = paymentType === 'listing_fee'
        ? { propertyId, propertyValue, userId }
        : { propertyId, amount, shares, userId };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      toast({
        title: "Payment Initialization Failed",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientSecret(null);
    onClose();
  };

  if (!isOpen) return null;

  const stripeOptions = {
    clientSecret: clientSecret || "",
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0066cc',
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="text-white" size={16} />
            </div>
            {paymentType === 'listing_fee' ? 'Pay Listing Fee' : 'Complete Investment'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin" size={32} />
            <span className="ml-3">Initializing payment...</span>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={stripeOptions}>
            <PaymentForm
              amount={amount}
              paymentType={paymentType}
              propertyId={propertyId}
              propertyValue={propertyValue}
              shares={shares}
              userId={userId}
              onSuccess={onSuccess}
              onClose={handleClose}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">Failed to initialize payment. Please try again.</p>
            <Button onClick={handleClose} className="mt-4">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}