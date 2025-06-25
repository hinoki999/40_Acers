import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19, "Card number is too long"),
  expiryMonth: z.string().min(1, "Please select expiry month"),
  expiryYear: z.string().min(1, "Please select expiry year"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV is too long"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  billingAddress: z.string().min(5, "Billing address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
  country: z.string().min(1, "Please select country"),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentMethod: any) => void;
}

export default function AddPaymentMethodModal({ isOpen, onClose, onSave }: AddPaymentMethodModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5") || number.startsWith("2")) return "Mastercard";
    if (number.startsWith("3")) return "American Express";
    if (number.startsWith("6")) return "Discover";
    return "Card";
  };

  const handleSubmit = async (data: PaymentMethodForm) => {
    setIsLoading(true);
    try {
      // Simulate API call to save payment method
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentMethod = {
        id: Date.now(),
        type: getCardType(data.cardNumber),
        last4: data.cardNumber.replace(/\s/g, "").slice(-4),
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cardholderName: data.cardholderName,
        billingAddress: {
          address: data.billingAddress,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        isDefault: false,
      };

      onSave(paymentMethod);
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been securely saved.",
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new debit or credit card for making investments. Your information is encrypted and secure.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Your payment information is protected with bank-level encryption
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Card Information</h3>
              
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234 5678 9000 0000"
                        maxLength={19}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Address</h3>
              
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main Street" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="New York" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="10001" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Lock className="h-4 w-4" />
              <span>Your card information is encrypted and never stored on our servers</span>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">
                {isLoading ? "Adding..." : "Add Payment Method"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}