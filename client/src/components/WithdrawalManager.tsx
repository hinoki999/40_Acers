import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Wallet, 
  Lock, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Clock, 
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";

interface InvestmentTier {
  id: number;
  name: string;
  minInvestment: string;
  maxInvestment?: string;
  lockupPeriodMonths: number;
  withdrawalFrequencyDays: number;
  earlyWithdrawalPenalty?: number;
  benefits: string[];
  description?: string;
}

interface UserInvestmentAccount {
  id: number;
  userId: string;
  tierId: number;
  totalInvested: string;
  availableBalance: string;
  lockedBalance: string;
  lastWithdrawalDate?: string;
  nextEligibleWithdrawal?: string;
  accountStatus: string;
  tier: InvestmentTier;
}

interface WithdrawalRequest {
  id: number;
  requestedAmount: string;
  availableAmount: string;
  withdrawalType: string;
  status: string;
  processingFee?: string;
  penaltyAmount?: string;
  netAmount?: string;
  reason?: string;
  createdAt: string;
  processedAt?: string;
}

interface WithdrawalManagerProps {
  userId: string;
}

export default function WithdrawalManager({ userId }: WithdrawalManagerProps) {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [withdrawalType, setWithdrawalType] = useState<"partial" | "full" | "emergency">("partial");
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  
  const { toast } = useToast();

  const { data: investmentAccount, isLoading: accountLoading } = useQuery<UserInvestmentAccount>({
    queryKey: ["/api/investment-account", userId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: withdrawalHistory = [], isLoading: historyLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ["/api/withdrawal-requests", userId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: milestonePerformance = [], isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/milestone-performance", userId],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/withdrawal-requests", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted for review",
      });
      setShowWithdrawalForm(false);
      setWithdrawalAmount("");
      setWithdrawalReason("");
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawal-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/investment-account"] });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to submit withdrawal request",
        variant: "destructive",
      });
    },
  });

  // Mock data for demonstration
  const mockAccount: UserInvestmentAccount = {
    id: 1,
    userId: userId,
    tierId: 2,
    totalInvested: "50000",
    availableBalance: "12500",
    lockedBalance: "37500",
    lastWithdrawalDate: "2024-01-15",
    nextEligibleWithdrawal: "2024-04-15",
    accountStatus: "active",
    tier: {
      id: 2,
      name: "Builder",
      minInvestment: "25000",
      maxInvestment: "100000",
      lockupPeriodMonths: 12,
      withdrawalFrequencyDays: 90,
      earlyWithdrawalPenalty: 5.0,
      benefits: ["Quarterly withdrawals", "Priority support", "Performance bonuses"],
      description: "Mid-tier investment with balanced liquidity and returns"
    }
  };

  const mockWithdrawals: WithdrawalRequest[] = [
    {
      id: 1,
      requestedAmount: "5000",
      availableAmount: "5000",
      withdrawalType: "partial",
      status: "completed",
      processingFee: "25",
      netAmount: "4975",
      reason: "Personal expenses",
      createdAt: "2024-01-15",
      processedAt: "2024-01-17"
    },
    {
      id: 2,
      requestedAmount: "3000",
      availableAmount: "3000",
      withdrawalType: "partial",
      status: "pending",
      processingFee: "15",
      netAmount: "2985",
      reason: "Investment diversification",
      createdAt: "2024-02-20"
    }
  ];

  const account = investmentAccount || mockAccount;
  const withdrawals = withdrawalHistory.length > 0 ? withdrawalHistory : mockWithdrawals;

  const isWithdrawalEligible = () => {
    if (!account.nextEligibleWithdrawal) return true;
    return new Date() >= new Date(account.nextEligibleWithdrawal);
  };

  const getDaysUntilEligible = () => {
    if (!account.nextEligibleWithdrawal) return 0;
    const now = new Date();
    const eligible = new Date(account.nextEligibleWithdrawal);
    const diffTime = eligible.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateWithdrawalFees = (amount: number) => {
    const processingFee = Math.max(amount * 0.005, 10); // 0.5% or minimum $10
    let penaltyFee = 0;
    
    if (!isWithdrawalEligible() && withdrawalType === "emergency") {
      penaltyFee = amount * (account.tier.earlyWithdrawalPenalty || 0) / 100;
    }
    
    return {
      processingFee,
      penaltyFee,
      netAmount: amount - processingFee - penaltyFee
    };
  };

  const handleWithdrawalSubmit = () => {
    const amount = parseFloat(withdrawalAmount);
    const available = parseFloat(account.availableBalance);
    
    if (amount <= 0 || amount > available) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (!isWithdrawalEligible() && withdrawalType !== "emergency") {
      toast({
        title: "Withdrawal Not Eligible",
        description: "You must wait until your next eligible withdrawal date",
        variant: "destructive",
      });
      return;
    }

    const fees = calculateWithdrawalFees(amount);
    
    withdrawalMutation.mutate({
      userId,
      accountId: account.id,
      requestedAmount: withdrawalAmount,
      availableAmount: account.availableBalance,
      withdrawalType,
      reason: withdrawalReason,
      processingFee: fees.processingFee.toString(),
      penaltyAmount: fees.penaltyFee.toString(),
      netAmount: fees.netAmount.toString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-600";
      case "pending": return "bg-yellow-600";
      case "rejected": return "bg-red-600";
      default: return "bg-neutral-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle size={16} />;
      case "pending": return <Clock size={16} />;
      case "rejected": return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (accountLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Investment Account - {account.tier.name} Tier</h3>
              <p className="text-sm text-neutral-600 font-normal">
                {account.tier.description}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  ${parseFloat(account.totalInvested).toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">Total Invested</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  ${parseFloat(account.availableBalance).toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">Available for Withdrawal</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  ${parseFloat(account.lockedBalance).toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">Locked Balance</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-lg font-bold text-purple-600">
                  {account.tier.lockupPeriodMonths} months
                </div>
                <div className="text-sm text-neutral-600">Lock-up Period</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card className={`${isWithdrawalEligible() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isWithdrawalEligible() ? 
                      <CheckCircle className="text-green-600" size={20} /> :
                      <Lock className="text-red-600" size={20} />
                    }
                    <span className={`font-semibold ${isWithdrawalEligible() ? 'text-green-600' : 'text-red-600'}`}>
                      {isWithdrawalEligible() ? 'Eligible' : 'Locked'}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {isWithdrawalEligible() ? 
                      'You can withdraw funds now' :
                      `${getDaysUntilEligible()} days until eligible`
                    }
                  </div>
                  {account.nextEligibleWithdrawal && (
                    <div className="text-xs text-neutral-500 mt-1">
                      Next: {new Date(account.nextEligibleWithdrawal).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            {account.tier.name} Tier Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Withdrawal Terms</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Frequency: Every {account.tier.withdrawalFrequencyDays} days</li>
                <li>• Early withdrawal penalty: {account.tier.earlyWithdrawalPenalty}%</li>
                <li>• Lock-up period: {account.tier.lockupPeriodMonths} months</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tier Benefits</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                {account.tier.benefits.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={20} />
              Withdrawal Management
            </div>
            <Button
              onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
              disabled={!isWithdrawalEligible() && withdrawalType !== "emergency"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showWithdrawalForm ? 'Cancel' : 'Request Withdrawal'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showWithdrawalForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Withdrawal Type</label>
                <select
                  className="w-full p-2 border rounded-md mt-1"
                  value={withdrawalType}
                  onChange={(e) => setWithdrawalType(e.target.value as any)}
                >
                  <option value="partial">Partial Withdrawal</option>
                  <option value="full">Full Withdrawal</option>
                  <option value="emergency">Emergency Withdrawal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount ($)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  max={account.availableBalance}
                  className="mt-1"
                />
                <div className="text-xs text-neutral-500 mt-1">
                  Max: ${parseFloat(account.availableBalance).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Reason for Withdrawal</label>
              <Textarea
                placeholder="Please provide a reason for this withdrawal..."
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            {withdrawalAmount && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Withdrawal Summary</h4>
                  {(() => {
                    const amount = parseFloat(withdrawalAmount) || 0;
                    const fees = calculateWithdrawalFees(amount);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Requested Amount:</span>
                          <span>${amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee:</span>
                          <span>-${fees.processingFee.toFixed(2)}</span>
                        </div>
                        {fees.penaltyFee > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Early Withdrawal Penalty:</span>
                            <span>-${fees.penaltyFee.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Net Amount:</span>
                          <span>${fees.netAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleWithdrawalSubmit}
                disabled={!withdrawalAmount || withdrawalMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {withdrawalMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWithdrawalForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Withdrawal History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No withdrawal requests found
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(withdrawal.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(withdrawal.status)}
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </div>
                        </Badge>
                        <span className="text-sm text-neutral-600">
                          {withdrawal.withdrawalType.charAt(0).toUpperCase() + withdrawal.withdrawalType.slice(1)} Withdrawal
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${parseFloat(withdrawal.requestedAmount).toLocaleString()}</div>
                        <div className="text-sm text-neutral-600">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Net Amount:</span>
                        <div className="text-green-600 font-semibold">
                          ${withdrawal.netAmount ? parseFloat(withdrawal.netAmount).toLocaleString() : 'TBD'}
                        </div>
                      </div>
                      {withdrawal.processingFee && (
                        <div>
                          <span className="font-medium">Processing Fee:</span>
                          <div>${parseFloat(withdrawal.processingFee).toFixed(2)}</div>
                        </div>
                      )}
                      {withdrawal.reason && (
                        <div>
                          <span className="font-medium">Reason:</span>
                          <div className="text-neutral-600">{withdrawal.reason}</div>
                        </div>
                      )}
                    </div>
                    
                    {withdrawal.processedAt && (
                      <div className="text-xs text-neutral-500 mt-2">
                        Processed on {new Date(withdrawal.processedAt).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Impact */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={20} />
            Performance Impact on Withdrawals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Your withdrawal eligibility and available funds are influenced by property performance milestones and market conditions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-2">Current Quarter Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target Return:</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Actual Return:</span>
                    <span className="font-medium text-green-600">9.2%</span>
                  </div>
                  <Progress value={108} className="mt-2" />
                  <div className="text-xs text-green-600">108% of target achieved</div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-2">Next Milestone</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual Review:</span>
                    <span className="font-medium">Dec 31, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonus Eligibility:</span>
                    <span className="font-medium text-green-600">Qualified</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-2">
                    Strong performance may unlock additional withdrawal options
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}