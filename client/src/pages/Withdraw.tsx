import { useAuth } from "@/hooks/useAuth";
import WithdrawalManager from "@/components/WithdrawalManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowLeft, Shield, Info } from "lucide-react";
import { Link } from "wouter";

export default function Withdraw() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center p-8">
            <CardContent>
              <Shield className="mx-auto mb-4 text-neutral-400" size={64} />
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Authentication Required</h2>
              <p className="text-neutral-600 mb-6">
                Please log in to access your withdrawal management dashboard.
              </p>
              <Link href="/api/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Withdrawal Management</h1>
              <p className="text-blue-100 text-lg">
                Manage your withdrawals with tier-based restrictions and performance tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-6 bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <Info className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Important Withdrawal Guidelines</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>• Withdrawal eligibility is based on your investment tier and lock-up period compliance</p>
                <p>• Early withdrawals may incur penalties as outlined in your investment agreement</p>
                <p>• Processing times vary by tier: Starter (5-7 days), Builder (3-5 days), Partner (1-2 days)</p>
                <p>• All withdrawals are subject to performance milestone achievements</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Withdrawal Management */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WithdrawalManager userId={(user as any)?.id || "demo-user"} />
        </div>
      </section>

      {/* Compliance Footer */}
      <section className="py-8 bg-neutral-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-600">
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">Regulatory Compliance</h4>
              <p>All withdrawals comply with SEC regulations and state securities laws. Processing may be delayed for compliance verification.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-2">Tax Considerations</h4>
              <p>Withdrawals may have tax implications. Consult with a tax professional regarding capital gains and income reporting requirements.</p>
            </div>
            <div>
              <h4 className="font-semibant text-neutral-900 mb-2">Support Contact</h4>
              <p>For withdrawal assistance, contact our investor relations team at <span className="font-medium">withdraw@40acres.com</span> or call 1-800-40ACRES.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}