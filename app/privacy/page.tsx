import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AI Prompt Generator - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-gray-400 mt-2">
              Last Updated: December 10, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p>
                  Welcome to AI Prompt Generator ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at https://aipromptgen.app.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.1 Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Register for an account</li>
                  <li>Subscribe to our services</li>
                  <li>Use our AI prompt generation features</li>
                  <li>Contact us via email or contact forms</li>
                  <li>Sign up for our newsletter</li>
                </ul>
                <p className="mt-3">This information may include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and email address</li>
                  <li>Username and password</li>
                  <li>Payment information (processed securely by third-party payment processors)</li>
                  <li>User-generated content (prompts, preferences)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.2 Automatically Collected Information</h3>
                <p>When you visit our website, we automatically collect certain information about your device and browsing behavior:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and device identifiers</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Clickstream data</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.3 Cookies and Tracking Technologies</h3>
                <p>
                  We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Delivery:</strong> To provide, maintain, and improve our AI prompt generation services</li>
                  <li><strong>Account Management:</strong> To create and manage your account, including authentication and credit tracking</li>
                  <li><strong>Personalization:</strong> To customize your experience and provide relevant content and recommendations</li>
                  <li><strong>Communication:</strong> To send you service-related notifications, updates, and marketing communications (with your consent)</li>
                  <li><strong>Analytics:</strong> To analyze usage patterns, improve our services, and develop new features</li>
                  <li><strong>Security:</strong> To detect, prevent, and address technical issues, fraud, and security incidents</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
                  <li><strong>Payment Processing:</strong> To process transactions and manage billing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
                <p>We may share your information with trusted third-party service providers who assist us in operating our website and services:</p>
                
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Analytics Services</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> We use Google Analytics to analyze website traffic and user behavior</li>
                  <li><strong>Microsoft Clarity:</strong> For session recording and heat mapping (if applicable)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Advertising</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google AdSense:</strong> We use Google AdSense to display advertisements on our website</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Payment Processors</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Stripe/PayPal:</strong> For secure payment processing (credit card information is never stored on our servers)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.4 AI Services</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>DeepSeek AI:</strong> For AI-powered content generation</li>
                  <li><strong>OpenAI, Midjourney, Google (Sora, Veo), Alibaba (Qwen):</strong> For prompt optimization and generation</li>
                </ul>

                <p className="mt-3">
                  These third parties have their own privacy policies and are responsible for their own data practices. We encourage you to review their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit using SSL/TLS</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
                <p className="mt-3">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
                  <li><strong>Opt-Out:</strong> Opt-out of marketing communications at any time</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your data</li>
                  <li><strong>Object:</strong> Object to processing of your information for certain purposes</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, please contact us at <a href="mailto:privacy@aipromptgen.app" className="text-blue-400 hover:text-blue-300">privacy@aipromptgen.app</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under the age of 13 (or 16 in certain jurisdictions). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to our facilities and to the third parties with whom we share it as described in this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. California Privacy Rights (CCPA)</h2>
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to know what personal information is collected, used, shared, or sold</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>Right to non-discrimination for exercising your CCPA rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. European Privacy Rights (GDPR)</h2>
                <p>
                  If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including the rights listed in Section 7 above. We process your personal information based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Performance of a contract with you</li>
                  <li>Legitimate interests in operating and improving our services</li>
                  <li>Your consent (which you may withdraw at any time)</li>
                  <li>Compliance with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Cookies Policy</h2>
                <p>We use the following types of cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="mt-3">
                  You can manage cookie preferences through your browser settings or by using our cookie consent tool.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p><strong>AI Prompt Generator</strong></p>
                  <p>Email: <a href="mailto:privacy@aipromptgen.app" className="text-blue-400 hover:text-blue-300">privacy@aipromptgen.app</a></p>
                  <p>Website: <a href="https://aipromptgen.app" className="text-blue-400 hover:text-blue-300">https://aipromptgen.app</a></p>
                </div>
              </section>

              <section className="mt-8 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <h2 className="text-2xl font-semibold text-white mb-4">15. Consent</h2>
                <p>
                  By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your information as described herein.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
