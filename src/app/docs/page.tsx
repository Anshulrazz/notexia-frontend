'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, HelpCircle, Users, BookOpen, Brain, Sparkles, Shield, Zap, Search, MessageSquare, Download, Share2, Star, Trophy, Settings, Bell, Bookmark, Flag, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    content: [
      {
        title: 'Creating an Account',
        description: 'Sign up for free using your email. After registration, verify your email to unlock all features. You can also complete your profile by adding a bio and profile picture.',
      },
      {
        title: 'Dashboard Overview',
        description: 'Your dashboard is the central hub for all activities. Access notes, doubts, forums, blogs, and your profile from the sidebar navigation. The dashboard shows your recent activity and quick stats.',
      },
      {
        title: 'Profile Setup',
        description: 'Complete your profile to build credibility. Add your name, bio, educational background, and interests. A complete profile helps others connect with you.',
      },
    ],
  },
  {
    id: 'notes',
    title: 'Notes',
    icon: FileText,
    content: [
      {
        title: 'Browsing Notes',
        description: 'Explore notes shared by other students. Use filters to search by subject, topic, or popularity. Notes are organized by categories for easy discovery.',
      },
      {
        title: 'Uploading Notes',
        description: 'Share your study materials by uploading PDF, DOCX, or image files. Add a descriptive title, select the subject, and provide tags to help others find your notes.',
      },
      {
        title: 'Downloading Notes',
        description: 'Download any shared notes for offline study. Click the download button on any note to save it to your device. Bookmark notes for quick access later.',
      },
      {
        title: 'AI Summary',
        description: 'Get AI-powered summaries of notes to quickly understand the key points. The AI analyzes the content and provides concise summaries to save your time.',
      },
    ],
  },
  {
    id: 'doubts',
    title: 'Doubts',
    icon: HelpCircle,
    content: [
      {
        title: 'Asking a Doubt',
        description: 'Post your questions with a clear title and detailed description. Add relevant tags and select the subject to help others find and answer your doubt.',
      },
      {
        title: 'AI Hint',
        description: 'Stuck on a problem? Use the AI Hint feature to get helpful hints that guide you toward the solution without giving away the answer. Great for learning!',
      },
      {
        title: 'AI Answer',
        description: 'Need a complete explanation? The AI Answer feature provides detailed solutions with step-by-step explanations to help you understand concepts thoroughly.',
      },
      {
        title: 'Community Answers',
        description: 'Get answers from fellow students and experts. Upvote helpful answers and mark the best answer as accepted to help others with similar doubts.',
      },
    ],
  },
  {
    id: 'forums',
    title: 'Forums',
    icon: Users,
    content: [
      {
        title: 'Joining Forums',
        description: 'Browse and join forums based on your interests, subjects, or courses. Each forum is a community of students discussing specific topics.',
      },
      {
        title: 'Creating Discussions',
        description: 'Start new discussion threads in forums. Share ideas, ask for opinions, or initiate study groups. Use markdown formatting to make your posts clear.',
      },
      {
        title: 'Participating in Discussions',
        description: 'Reply to existing threads, upvote helpful posts, and engage with the community. Building relationships helps create a supportive learning environment.',
      },
    ],
  },
  {
    id: 'blogs',
    title: 'Blogs',
    icon: BookOpen,
    content: [
      {
        title: 'Reading Blogs',
        description: 'Explore articles written by students and educators. Filter by topics, popularity, or recent posts. Blogs cover study tips, career advice, and subject explanations.',
      },
      {
        title: 'Writing Blogs',
        description: 'Share your knowledge by writing articles. Use the rich markdown editor to format your content with headings, code blocks, images, and more.',
      },
      {
        title: 'AI Summary',
        description: 'Get quick AI-generated summaries of long blog posts. Perfect for deciding if a blog is worth reading or for quick revision.',
      },
    ],
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    icon: Brain,
    content: [
      {
        title: 'AI-Powered Hints',
        description: 'Our AI provides intelligent hints that guide you toward solutions. Unlike direct answers, hints help you learn by encouraging problem-solving.',
      },
      {
        title: 'AI Answers',
        description: 'Get comprehensive AI-generated answers with explanations. The AI understands context and provides step-by-step solutions.',
      },
      {
        title: 'AI Summaries',
        description: 'Save time with AI-generated summaries for notes and blogs. Get the key points without reading the entire content.',
      },
      {
        title: 'Smart Recommendations',
        description: 'The AI learns your interests and recommends relevant notes, doubts, and forums to help you discover useful content.',
      },
    ],
  },
  {
    id: 'bookmarks',
    title: 'Bookmarks',
    icon: Bookmark,
    content: [
      {
        title: 'Saving Content',
        description: 'Bookmark notes, doubts, blogs, and forum posts for later. Click the bookmark icon on any content to save it to your bookmarks.',
      },
      {
        title: 'Managing Bookmarks',
        description: 'Access all your bookmarks from the dashboard. Organize and filter bookmarks by type. Remove bookmarks you no longer need.',
      },
    ],
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: Trophy,
    content: [
      {
        title: 'Earning Points',
        description: 'Earn points by contributing to the community. Upload notes, answer doubts, write blogs, and participate in forums to climb the leaderboard.',
      },
      {
        title: 'Rankings',
        description: 'View top contributors on the leaderboard. Rankings are updated based on total contributions and community engagement.',
      },
      {
        title: 'Achievements',
        description: 'Unlock achievements by reaching milestones. Share your achievements on your profile to showcase your contributions.',
      },
    ],
  },
  {
    id: 'reporting',
    title: 'Reporting Content',
    icon: Flag,
    content: [
      {
        title: 'How to Report',
        description: 'If you find inappropriate or incorrect content, use the report button. Select the reason for reporting and provide additional details if needed.',
      },
      {
        title: 'Report Types',
        description: 'Report spam, harassment, incorrect information, copyright violations, or other policy violations. Our moderation team reviews all reports.',
      },
      {
        title: 'Moderation Process',
        description: 'Reports are reviewed by our team. Appropriate action is taken based on the severity of the violation, from content removal to account suspension.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Account Settings',
    icon: Settings,
    content: [
      {
        title: 'Profile Settings',
        description: 'Update your profile information including name, bio, and profile picture. Keep your profile updated to help others know you better.',
      },
      {
        title: 'Notification Settings',
        description: 'Customize which notifications you receive. Choose to be notified about answers to your doubts, forum replies, and more.',
      },
      {
        title: 'Privacy Settings',
        description: 'Control your privacy preferences. Choose what information is visible on your public profile.',
      },
      {
        title: 'Account Security',
        description: 'Change your password and manage account security. Enable two-factor authentication for additional security.',
      },
    ],
  },
]

const quickLinks = [
  { title: 'Create Account', href: '/register', icon: Sparkles },
  { title: 'Browse Notes', href: '/dashboard/notes', icon: FileText },
  { title: 'Ask a Doubt', href: '/dashboard/doubts', icon: HelpCircle },
  { title: 'Join Forums', href: '/dashboard/forums', icon: Users },
  { title: 'Write a Blog', href: '/dashboard/blogs', icon: BookOpen },
  { title: 'View Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300 font-medium">Documentation</span>
            </div>
            <Button asChild variant="outline" className="border-violet-500/50 text-white hover:bg-violet-500/20">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How to use <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to know to make the most of Notexia. Learn about all features and get started quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-16">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <link.icon className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-white font-medium group-hover:text-violet-400 transition-colors">{link.title}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 ml-auto group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">On this page</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-violet-500/10 rounded-lg transition-colors"
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="space-y-16">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Still need help?</h3>
              <p className="text-slate-400 mb-6">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
                  <a href="mailto:support@notexia.com">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-violet-500/50 text-white hover:bg-violet-500/20">
                  <Link href="/dashboard/forums">
                    <Users className="w-4 h-4 mr-2" />
                    Ask in Forums
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-violet-500/20 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 Notexia. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
