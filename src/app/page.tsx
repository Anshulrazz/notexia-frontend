import Link from 'next/link'
import { FileText, HelpCircle, Users, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: FileText,
    title: 'Share Notes',
    description: 'Upload and download study materials. Help others learn by sharing your notes.',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: HelpCircle,
    title: 'Ask Doubts',
    description: 'Get help from peers. Ask questions and receive answers with AI-powered hints.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Join Forums',
    description: 'Connect with study groups and communities. Discuss topics and share ideas.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Write Blogs',
    description: 'Share your knowledge through articles. Help others with your experiences.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="sticky top-0 z-50 border-b border-[#2a2a3e] bg-[#0a0a0f]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-semibold text-xl text-white tracking-tight">Notexia</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-[#2a2a3e]">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-600/5 to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI-powered learning assistance</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Learn Together,
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Grow Together
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
              The ultimate student collaboration platform. Share notes, solve doubts, join forums, and write blogs with AI assistance.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-lg h-12 px-8">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-[#2a2a3e] text-white hover:bg-[#2a2a3e] text-lg h-12 px-8">
                <Link href="/login">Sign in to Dashboard</Link>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white">10K+</p>
                <p className="text-sm text-slate-500 mt-1">Active Students</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white">50K+</p>
                <p className="text-sm text-slate-500 mt-1">Notes Shared</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white">25K+</p>
                <p className="text-sm text-slate-500 mt-1">Doubts Solved</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white">500+</p>
                <p className="text-sm text-slate-500 mt-1">Study Groups</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-[#2a2a3e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Everything you need to excel
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Powerful features designed to make learning collaborative and effective.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="relative group p-6 rounded-2xl bg-[#1e1e2e] border border-[#2a2a3e] hover:border-violet-500/50 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-[#2a2a3e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to start learning together?
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              Join thousands of students already using Notexia to collaborate and excel.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-lg h-12 px-8">
              <Link href="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#2a2a3e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-white">Notexia</span>
            </div>
            <p className="text-sm text-slate-500">
              2024 Notexia. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
