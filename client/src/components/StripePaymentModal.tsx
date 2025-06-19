import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Property } from "@shared/schema";
import { DollarSign, CreditCard, Lock, Wallet } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  investmentAmount: number;
  shares: number;
  onSuccess: () => void;
}

function PaymentForm({ 
  property, 
  investmentAmount, 
  shares, 
  onClose, 
  onSuccess 
}: {
  property: Property;
  investmentAmount: number;
  shares: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await apiRequest("POST", "/api/payments/create-investment-intent", {
        propertyId: property.id,
        amount: investmentAmount,
        shares,
      });

      const { clientSecret, paymentTransactionId, receiptNumber } = await response.json();

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirm payment success on the backend
        await apiRequest("POST", "/api/payments/confirm-payment", {
          paymentIntentId: paymentIntent.id,
        });

        toast({
          title: "Investment Successful!",
          description: `You've invested $${investmentAmount.toLocaleString()} in ${property.address}. Receipt: ${receiptNumber}`,
        });

        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Investment Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
        <h4 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Wallet size={16} />
          Investment Summary
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Property:</span>
              <span className="font-medium text-sm">{property.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Shares:</span>
              <span className="font-medium">{shares.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Share Price:</span>
              <span className="font-medium">${Number(property.sharePrice).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
              <span>Total:</span>
              <span>${investmentAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-primary" />
          <h3 className="text-lg font-semibold">Payment Method</h3>
          <Badge variant="secondary" className="ml-auto">
            <Lock size={12} className="mr-1" />
            Secure
          </Badge>
        </div>
        
        <div className="p-4 border rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        
        <p className="text-xs text-neutral-500 flex items-center gap-1">
          <Lock size={12} />
          Your payment information is encrypted and secure. We never store card details.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              Invest ${investmentAmount.toLocaleString()}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  property,
  investmentAmount,
  shares,
  onSuccess,
}: StripePaymentModalProps) {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center">
              <CreditCard className="text-white" size={20} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-neutral-900">
                Complete Your Investment
              </DialogTitle>
              <p className="text-neutral-600">Secure payment powered by Stripe</p>
            </div>
          </div>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <PaymentForm
            property={property}
            investmentAmount={investmentAmount}
            shares={shares}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}