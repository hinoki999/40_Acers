import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, Scale, Building, Coins } from "lucide-react";
import Footer from "@/components/Footer";

export default function LegalDisclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Legal Disclaimer</h1>
          <p className="text-lg text-neutral-600">
            Important legal information regarding real estate crowdfunding investments
          </p>
        </div>

        <div className="space-y-6">
          {/* Investment Risk Warning */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="h-6 w-6" />
                Investment Risk Warning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                <strong>ALL INVESTMENTS INVOLVE RISK.</strong> Real estate crowdfunding investments through 40 Acres 
                are speculative investments that involve substantial risk of loss. You may lose some or all of your 
                investment. Past performance is not indicative of future results.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Key Investment Risks Include:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Property value fluctuations and market volatility</li>
                  <li>• Rental income variability and vacancy risks</li>
                  <li>• Liquidity limitations - investments may not be easily sellable</li>
                  <li>• Economic downturns affecting real estate markets</li>
                  <li>• Property damage, natural disasters, and insurance gaps</li>
                  <li>• Regulatory changes affecting real estate or crowdfunding</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Securities and Regulatory Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                Securities and Regulatory Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                Real estate investments offered through 40 Acres may constitute securities under federal and state 
                securities laws. These investments are intended for accredited investors only, as defined under 
                Regulation D of the Securities Act of 1933.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Accredited Investor Requirements</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Annual income exceeding $200,000 (individual) or $300,000 (joint)</li>
                    <li>• Net worth exceeding $1,000,000 (excluding primary residence)</li>
                    <li>• Professional certifications (Series 7, 65, 82)</li>
                    <li>• Knowledgeable employees of private funds</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Regulatory Framework</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Securities Act of 1933</li>
                    <li>• Securities Exchange Act of 1934</li>
                    <li>• Investment Company Act of 1940</li>
                    <li>• State securities regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real Estate Crowdfunding Specific Risks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building className="h-6 w-6 text-green-600" />
                Real Estate Crowdfunding Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                Crowdfunding real estate investments through 40 Acres involve additional risks beyond traditional 
                real estate investment:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-l-orange-400 pl-4">
                  <h4 className="font-semibold text-orange-800">Platform Risk</h4>
                  <p className="text-orange-700 text-sm">
                    40 Acres operates as a technology platform facilitating investments. Platform operational 
                    issues, regulatory changes, or business failure could affect your investments.
                  </p>
                </div>
                <div className="border-l-4 border-l-purple-400 pl-4">
                  <h4 className="font-semibold text-purple-800">Sponsor Risk</h4>
                  <p className="text-purple-700 text-sm">
                    Property sponsors manage day-to-day operations. Their experience, financial stability, 
                    and decision-making directly impact investment performance.
                  </p>
                </div>
                <div className="border-l-4 border-l-indigo-400 pl-4">
                  <h4 className="font-semibold text-indigo-800">Illiquidity Risk</h4>
                  <p className="text-indigo-700 text-sm">
                    Unlike stocks or bonds, real estate crowdfunding investments typically have limited 
                    secondary markets and may require holding periods of several years.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cryptocurrency and Digital Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Coins className="h-6 w-6 text-amber-600" />
                Cryptocurrency and Digital Asset Investments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                40 Acres may offer investment opportunities involving cryptocurrency payments or blockchain-based 
                real estate tokens across various blockchain networks. These investments carry additional risks:
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-3">Cryptocurrency-Specific Risks:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Extreme price volatility of cryptocurrencies</li>
                    <li>• Regulatory uncertainty for digital assets</li>
                    <li>• Technology risks and smart contract vulnerabilities</li>
                    <li>• Blockchain network congestion and high fees</li>
                  </ul>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Private key loss or wallet security breaches</li>
                    <li>• Exchange hacks or platform failures</li>
                    <li>• Tax complexity for cryptocurrency transactions</li>
                    <li>• Limited acceptance and liquidity in some jurisdictions</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Supported Blockchain Networks</h4>
                <p className="text-gray-700 text-sm mb-2">
                  40 Acres may facilitate investments across multiple blockchain networks, each with unique risks:
                </p>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• <strong>Ethereum:</strong> Network congestion, high gas fees, smart contract risks</li>
                  <li>• <strong>Bitcoin:</strong> Price volatility, transaction speed limitations</li>
                  <li>• <strong>Alternative Networks:</strong> Lower adoption, security concerns, regulatory uncertainty</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tax Considerations */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-700 leading-relaxed">
                Real estate crowdfunding investments may have complex tax implications. Consult with a qualified 
                tax professional regarding:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-neutral-700 text-sm space-y-1">
                  <li>• Rental income taxation</li>
                  <li>• Depreciation deductions</li>
                  <li>• Capital gains treatment</li>
                  <li>• State tax obligations</li>
                </ul>
                <ul className="text-neutral-700 text-sm space-y-1">
                  <li>• Cryptocurrency transaction reporting</li>
                  <li>• Digital asset capital gains</li>
                  <li>• 1099 reporting requirements</li>
                  <li>• International tax implications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Platform Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-neutral-800">No Investment Advice</h4>
                  <p className="text-neutral-700 text-sm">
                    40 Acres does not provide investment, legal, or tax advice. All information is for educational 
                    purposes only. Consult qualified professionals before making investment decisions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">Forward-Looking Statements</h4>
                  <p className="text-neutral-700 text-sm">
                    Projected returns, market forecasts, and performance estimates are forward-looking statements 
                    based on current assumptions and may not be achieved.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">FDIC Insurance</h4>
                  <p className="text-neutral-700 text-sm">
                    Real estate investments are NOT insured by the FDIC, SIPC, or any other government agency. 
                    You may lose some or all of your investment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-neutral-900 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Questions or Concerns?</h3>
              <p className="text-neutral-300 mb-4">
                If you have questions about these disclaimers or need clarification on any investment risks, 
                please contact our compliance team.
              </p>
              <div className="flex flex-col md:flex-row gap-4 text-sm">
                <div>
                  <strong>Email:</strong> compliance@40acres.com
                </div>
                <div>
                  <strong>Phone:</strong> 1-800-40-ACRES
                </div>
                <div>
                  <strong>Address:</strong> 123 Investment Blvd, Suite 400, Financial District, NY 10005
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="text-center py-4">
            <p className="text-xs text-neutral-500">
              Last updated: December 2024 | This disclaimer is subject to change without notice.
              <br />
              By using 40 Acres, you acknowledge that you have read, understood, and agree to these terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}