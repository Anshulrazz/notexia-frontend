'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.png" alt="Notexia Logo" width={40} height={40} className="rounded-xl group-hover:scale-110 transition-transform" />
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
        <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
        <p className="text-slate-400 mb-8">Last updated: January 19, 2026</p>

        <div className="prose prose-invert prose-violet max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using Notexia, you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed">
              Notexia is an educational platform that allows students to share notes, ask doubts, participate in forums, 
              and write blogs. Our service includes AI-powered features to enhance the learning experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information during registration</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Content</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              By posting content on Notexia, you grant us a non-exclusive, worldwide, royalty-free license to use, 
              display, and distribute your content within the platform. You retain ownership of your content.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You agree not to post content that:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-2">
              <li>Infringes on intellectual property rights</li>
              <li>Contains harmful, offensive, or inappropriate material</li>
              <li>Violates any applicable laws or regulations</li>
              <li>Contains spam or misleading information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              The Notexia platform, including its design, features, and content (excluding user-generated content), 
              is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, 
              or distribute our proprietary content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Activities</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Attempting to gain unauthorized access to accounts or systems</li>
              <li>Using the service for commercial purposes without authorization</li>
              <li>Harassing, bullying, or threatening other users</li>
              <li>Uploading malicious software or harmful content</li>
              <li>Scraping or collecting user data without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violations of these terms 
              or for any other reason at our discretion. You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-slate-300 leading-relaxed">
              Notexia is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, 
              completeness, or usefulness of any content on the platform. Use of the service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              Notexia and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or through the platform. Continued use of the service after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:support@notexia.com" className="text-violet-400 hover:text-fuchsia-400 transition-colors">
                support@notexia.com
              </a>
            </p>
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
