'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
            </Link>
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-violet-500/20">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 19, 2026</p>

        <div className="prose prose-invert prose-violet max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              At Notexia, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform. Please read this policy carefully to understand 
              our practices regarding your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-white mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Name and username</li>
              <li>Email address</li>
              <li>Password (encrypted)</li>
              <li>Profile picture (optional)</li>
              <li>Educational institution (optional)</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">2.2 Usage Data</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Search queries within the platform</li>
              <li>Interactions with content (likes, comments, shares)</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-6 mb-3">2.3 User-Generated Content</h3>
            <p className="text-slate-300 leading-relaxed">
              We store content you create and share on the platform, including notes, doubts, forum posts, 
              blogs, and comments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Personalizing your experience</li>
              <li>Sending notifications about activity on your content</li>
              <li>Improving our platform and developing new features</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Detecting and preventing fraud or abuse</li>
              <li>Communicating important updates and announcements</li>
              <li>Powering AI features to provide helpful suggestions and hints</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> Third-party services that help us operate the platform (hosting, analytics, email services)</li>
              <li><strong className="text-white">Other Users:</strong> Your public profile and content are visible to other users</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Storage and Security</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encrypted password storage using secure hashing algorithms</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure cloud infrastructure with regular backups</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Your data is stored on secure servers. While we strive to protect your information, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze platform usage</li>
              <li>Improve performance</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              You can control cookies through your browser settings, but disabling them may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your data</li>
              <li><strong className="text-white">Portability:</strong> Request transfer of your data</li>
              <li><strong className="text-white">Objection:</strong> Object to certain processing activities</li>
              <li><strong className="text-white">Withdrawal:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@notexia.com" className="text-violet-400 hover:text-fuchsia-400 transition-colors">
                privacy@notexia.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain your personal data for as long as your account is active or as needed to provide services. 
              After account deletion, we may retain certain data for legal compliance, dispute resolution, or 
              legitimate business purposes. User-generated content may remain on the platform unless specifically 
              deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Notexia is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected such information, please 
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
            <p className="text-slate-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Third-Party Links</h2>
            <p className="text-slate-300 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy 
              practices of these sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes 
              via email or through the platform. Your continued use after changes constitutes acceptance of 
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <p className="text-slate-300">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:privacy@notexia.com" className="text-violet-400 hover:text-fuchsia-400 transition-colors">
                  privacy@notexia.com
                </a>
              </p>
              <p className="text-slate-300 mt-2">
                <strong className="text-white">Support:</strong>{' '}
                <a href="mailto:support@notexia.com" className="text-violet-400 hover:text-fuchsia-400 transition-colors">
                  support@notexia.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-violet-500/20 py-8 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            © 2024 Notexia. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  )
}
