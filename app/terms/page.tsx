import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for AI Prompt Generator. Read our terms and conditions for using our AI prompt generation platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Terms of Service
            </CardTitle>
            <p className="text-center text-gray-400 mt-2">
              Last Updated: December 26, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using AI Prompt Generator ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
                <p>Permission is granted to temporarily use AI Prompt Generator for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose without proper attribution</li>
                  <li>Attempt to decompile or reverse engineer any software contained on AI Prompt Generator</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.1 Account Creation</h3>
                <p>
                  To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.2 Account Security</h3>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Service Usage</h2>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Free Tier</h3>
                <p>
                  Free users receive 70 prompt generations per account. Once the limit is reached, users must upgrade to a paid plan or create a new account.
                </p>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Paid Plans</h3>
                <p>
                  Paid subscription plans are currently unavailable. All users have access to the free tier with 70 prompt generations.
                </p>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Acceptable Use</h3>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Generate content that violates any applicable law or regulation</li>
                  <li>Create prompts for illegal, harmful, or malicious purposes</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.1 Generated Content</h3>
                <p>
                  You retain all rights to the prompts you generate using our Service. AI Prompt Generator does not claim ownership of user-generated content.
                </p>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.2 Service Content</h3>
                <p>
                  The Service and its original content (excluding user-generated content), features, and functionality are and will remain the exclusive property of AI Prompt Generator and its licensors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
                <p>
                  The materials on AI Prompt Generator are provided on an 'as is' basis. AI Prompt Generator makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitations</h2>
                <p>
                  In no event shall AI Prompt Generator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Prompt Generator, even if AI Prompt Generator or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Accuracy of Materials</h2>
                <p>
                  The materials appearing on AI Prompt Generator could include technical, typographical, or photographic errors. AI Prompt Generator does not warrant that any of the materials on its website are accurate, complete, or current.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Links</h2>
                <p>
                  AI Prompt Generator has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AI Prompt Generator. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Modifications</h2>
                <p>
                  AI Prompt Generator may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our contact page.
                </p>
              </section>

              <section className="mt-8 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <h2 className="text-2xl font-semibold text-white mb-4">Important Notice</h2>
                <p className="text-gray-300">
                  By using AI Prompt Generator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must not use our Service.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
