import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-sm text-gray-600 mb-6">
            <strong>Effective Date:</strong> June 24, 2025
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                These Terms of Service ("Terms") govern your access to and use of the 40 Acres platform operated by 40 Acres App Inc. ("Company," "we," "us," or "our"). By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
              <p className="mb-4">
                40 Acres operates a real estate crowdfunding platform that enables qualified investors to purchase fractional interests in real estate properties. Our services include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Property listing and investment opportunities</li>
                <li>Investor verification and onboarding</li>
                <li>Transaction processing and management</li>
                <li>Portfolio tracking and reporting</li>
                <li>Property management coordination</li>
                <li>Investor communication and community features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Eligibility and Account Registration</h2>
              <h3 className="text-lg font-medium mb-2">Investor Qualifications</h3>
              <p className="mb-4">To invest through our platform, you must:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Be at least 18 years of age</li>
                <li>Be a U.S. citizen or permanent resident</li>
                <li>Meet accredited investor requirements as defined by SEC regulations</li>
                <li>Pass our identity verification process</li>
                <li>Provide accurate and complete information</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2">Account Security</h3>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Investment Terms and Risks</h2>
              <h3 className="text-lg font-medium mb-2">Investment Nature</h3>
              <p className="mb-4">
                All investments offered through our platform represent fractional ownership interests in real estate properties. These investments are speculative and involve substantial risk of loss.
              </p>
              
              <h3 className="text-lg font-medium mb-2">Risk Factors</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Real estate investments are illiquid and may not be readily sellable</li>
                <li>Property values may decline, resulting in loss of investment</li>
                <li>Rental income is not guaranteed and may vary</li>
                <li>Economic conditions may adversely affect property performance</li>
                <li>Limited voting rights and control over property decisions</li>
                <li>Potential conflicts of interest with property managers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Fees and Payments</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Management Fees:</strong> Annual management fees as disclosed for each property</li>
                <li><strong>Transaction Fees:</strong> Processing fees for investments and withdrawals</li>
                <li><strong>Platform Fees:</strong> Service fees for platform usage</li>
                <li><strong>Third-party Costs:</strong> Property management, legal, and administrative expenses</li>
              </ul>
              <p className="mb-4">
                All fees are disclosed before investment completion. Fee schedules may change with 30 days' notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. User Conduct and Restrictions</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide false or misleading information</li>
                <li>Use the platform for illegal activities</li>
                <li>Share account access with unauthorized parties</li>
                <li>Attempt to manipulate or disrupt platform operations</li>
                <li>Violate applicable securities laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Engage in harassment or inappropriate communication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="mb-4">
                The platform and its content are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitation of Liability</h2>
              <h3 className="text-lg font-medium mb-2">Service Disclaimers</h3>
              <p className="mb-4">
                The platform is provided "as is" without warranties of any kind. We do not guarantee investment performance, property values, or rental income.
              </p>
              
              <h3 className="text-lg font-medium mb-2">Limitation of Liability</h3>
              <p className="mb-4">
                Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from platform use or investment losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Regulatory Compliance</h2>
              <p className="mb-4">
                Our platform operates under applicable federal and state securities regulations. Investment offerings may be made under Regulation D, Regulation A+, or other exemptions as appropriate.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent mb-4">11. Dispute Resolution</h2>
              <h3 className="text-lg font-medium mb-2">Arbitration Agreement</h3>
              <p className="mb-4">
                Most disputes will be resolved through binding arbitration rather than court proceedings. This includes claims related to investments, platform use, and these Terms.
              </p>
              
              <h3 className="text-lg font-medium mb-2">Class Action Waiver</h3>
              <p className="mb-4">
                You waive the right to participate in class action lawsuits or class-wide arbitration proceedings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Account Termination</h2>
              <p className="mb-4">
                We may suspend or terminate your account for violations of these Terms or applicable law. You may close your account at any time, subject to existing investment obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
              <p className="mb-4">
                We may modify these Terms periodically. Material changes will be communicated with at least 30 days' notice. Continued platform use constitutes acceptance of modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
              <p className="mb-4">
                These Terms are governed by the laws of [State], without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms, contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>40 Acres App Inc.</strong></p>
                <p>Email: legal@40acresapp.com</p>
                <p>Phone: 1-800-40-ACRES</p>
                <p>Address: [Company Address]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Severability</h2>
              <p className="mb-4">
                If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}