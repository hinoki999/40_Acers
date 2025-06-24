import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-sm text-gray-600 mb-6">
            <strong>Effective Date:</strong> June 24, 2025
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                40 Acres App Inc. ("we," "us," or "our") operates a real estate crowdfunding platform that enables fractional property investments. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Name, email address, phone number, and mailing address</li>
                <li>Date of birth and Social Security Number (for identity verification)</li>
                <li>Financial information including income, net worth, and investment experience</li>
                <li>Bank account and payment information</li>
                <li>Government-issued identification documents</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2">Usage Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Device information, IP address, and browser type</li>
                <li>Platform usage patterns and preferences</li>
                <li>Transaction history and investment activities</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Process and manage your investments and transactions</li>
                <li>Verify your identity and comply with regulatory requirements</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important notices about your account and investments</li>
                <li>Improve our platform and develop new features</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations and regulatory reporting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Service Providers:</strong> Third-party vendors who assist with payment processing, identity verification, and platform operations</li>
                <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Property Partners:</strong> Limited information may be shared with property managers and real estate professionals</li>
                <li><strong>Regulatory Bodies:</strong> Financial regulators and tax authorities as required</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Multi-factor authentication and access controls</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee training on data protection practices</li>
                <li>Secure data centers with physical access controls</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Marketing Opt-out:</strong> Unsubscribe from promotional communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p className="mb-4">
                We retain your information for as long as necessary to provide services and comply with legal obligations. Investment records are maintained for at least seven years as required by securities regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. International Transfers</h2>
              <p className="mb-4">
                Your information may be processed in countries other than your residence. We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy periodically. Material changes will be communicated via email or platform notification at least 30 days before taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p className="mb-4">
                For questions about this Privacy Policy or to exercise your rights, contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>40 Acres App Inc.</strong></p>
                <p>Email: privacy@40acresapp.com</p>
                <p>Phone: 1-800-40-ACRES</p>
                <p>Address: [Company Address]</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}