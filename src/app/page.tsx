'use client'

import Link from 'next/link'
import { FileText, HelpCircle, Users, BookOpen, ArrowRight, Sparkles, Zap, Star, Rocket, Brain, Target, Trophy, ChevronDown, Play, CheckCircle2, Globe, Shield, Clock, LayoutDashboard, Search, MessageSquare, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

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

const stats = [
  { value: '10K+', label: 'Active Students', icon: Users },
  { value: '50K+', label: 'Notes Shared', icon: FileText },
  { value: '25K+', label: 'Doubts Solved', icon: Target },
  { value: '500+', label: 'Study Groups', icon: Globe },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    avatar: 'S',
    content: 'Notexia changed how I study. The AI hints for doubts are incredible!',
    rating: 5,
  },
  {
    name: 'Alex Kumar',
    role: 'Engineering Student',
    avatar: 'A',
    content: 'Found the best study notes here. My grades improved by 40%!',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Medical Student',
    avatar: 'E',
    content: 'The forums helped me connect with seniors who guided my career.',
    rating: 5,
  },
]

const benefits = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Get answers in minutes, not hours' },
  { icon: Shield, title: '100% Free', desc: 'No hidden fees, ever' },
  { icon: Brain, title: 'AI Powered', desc: 'Smart suggestions & hints' },
  { icon: Clock, title: '24/7 Access', desc: 'Learn anytime, anywhere' },
]

function FloatingParticle({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-sm animate-float"
      style={{
        left,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const numericTarget = parseInt(target.replace(/\D/g, ''))
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = numericTarget / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericTarget) {
        setCount(numericTarget)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [numericTarget])
  
  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { isAuthenticated, user, login } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    const checkAuth = async () => {
      try {
        const userData = await authService.getMe()
        login(userData)
      } catch {
      }
    }
    if (!isAuthenticated) {
      checkAuth()
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isAuthenticated, login])

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 90px rgba(139, 92, 246, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
          50% { text-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(236, 72, 153, 0.5); }
        }
        .animate-float { animation: float linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-gradient { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .glass { background: rgba(30, 30, 46, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(139, 92, 246, 0.2); }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px) scale(1.02); }
      `}</style>

      {isMounted && [...Array(20)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.5}
          duration={10 + Math.random() * 10}
          left={`${Math.random() * 100}%`}
          size={4 + Math.random() * 8}
        />
      ))}

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />

      <nav className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse-glow group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button asChild className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 animate-pulse-glow">
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-violet-500/20 hidden sm:flex">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 animate-pulse-glow">
                    <Link href="/register">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sign up Free
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative py-20 sm:py-32 lg:py-40">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px]" />
          </div>
          
          <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8 animate-bounce-slow">
              <div className="flex -space-x-2">
                {['bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500'].map((color, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${color} border-2 border-[#0a0a0f] flex items-center justify-center text-xs text-white font-bold`}>
                    {['S', 'A', 'E'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-violet-300 font-medium">Join 10,000+ students already learning</span>
              <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none">
              <span className="block animate-text-glow">Learn Smarter.</span>
              <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Grow Faster.
              </span>
            </h1>
            
            <p className="mt-8 text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The <span className="text-violet-400 font-semibold">ultimate</span> student platform. Share notes, solve doubts, 
              <span className="text-fuchsia-400 font-semibold"> powered by AI</span>. Your success starts here.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 text-white text-lg h-14 px-10 font-bold animate-pulse-glow hover-lift">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 text-white text-lg h-14 px-10 font-bold animate-pulse-glow hover-lift">
                    <Link href="/register">
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Learning Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-violet-500/50 text-white hover:bg-violet-500/20 text-lg h-14 px-10 font-semibold glass hover-lift">
                    <Link href="/login">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Student-First Community</span>
              </div>
            </div>

            <div className="mt-16 animate-bounce-slow">
              <ChevronDown className="w-8 h-8 text-violet-400 mx-auto" />
            </div>
          </div>
        </section>

        <section className="py-16 border-y border-violet-500/20 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center group cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-4 group-hover:scale-110 group-hover:border-violet-400 transition-all">
                    <stat.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {isMounted ? (
                      <AnimatedCounter target={stat.value} suffix={stat.value.includes('+') ? '+' : ''} />
                    ) : (
                      <span>{stat.value}</span>
                    )}
                  </p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-violet-300 font-medium">Powerful Features</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
                Everything you need to
                <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">excel in studies</span>
              </h2>
              <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful tools designed by students, for students. Start achieving more today.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="relative group p-8 rounded-3xl glass hover:border-violet-500/50 transition-all duration-500 hover-lift overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="relative text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="relative text-slate-400 leading-relaxed">{feature.description}</p>
                  <div className="relative mt-6">
                    <Link href={isAuthenticated ? "/dashboard" : "/register"} className="inline-flex items-center text-violet-400 font-semibold group-hover:text-fuchsia-400 transition-colors">
                      {isAuthenticated ? 'Go to Dashboard' : 'Get started'} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
                  The <span className="text-violet-400">Smart</span> Way to Study
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Search, title: 'Find Quality Notes', desc: 'Browse through thousands of verified study materials.' },
                    { icon: MessageSquare, title: 'AI-Powered Doubts', desc: 'Ask anything and get hints that help you learn, not just the answer.' },
                    { icon: Share2, title: 'Collaborate', desc: 'Join forums and study groups to grow together.' },
                    { icon: Download, title: 'Offline Access', desc: 'Download resources and learn even without an internet connection.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                      <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-[100px] opacity-20 animate-pulse" />
                <div className="relative glass rounded-3xl p-8 border-violet-500/20 aspect-square flex items-center justify-center overflow-hidden group">
                   <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute w-64 h-64 rounded-full border-2 border-dashed border-violet-500/20 animate-spin-slow" />
                      <div className="absolute w-48 h-48 rounded-full border-2 border-dashed border-fuchsia-500/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                      <Brain className="w-24 h-24 text-violet-400 animate-bounce-slow" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-[#0a0a0f] via-violet-950/20 to-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Why Students <span className="text-pink-400">Love</span> Notexia
              </h2>
              <p className="text-xl text-slate-400">Join thousands who transformed their learning journey</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.name} className="p-8 rounded-3xl glass hover-lift" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-slate-300 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-violet-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="flex items-start gap-4 group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-violet-400 transition-all">
                    <benefit.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{benefit.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[150px]" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-8">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-violet-300 font-medium">Start your success story today</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient">level up</span>?
            </h2>
            <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join the community of high achievers. Your journey to academic excellence starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0a0a0f] text-xl h-16 px-12 font-bold hover-lift shadow-2xl shadow-violet-500/30">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-6 w-6" />
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0a0a0f] text-xl h-16 px-12 font-bold hover-lift shadow-2xl shadow-violet-500/30">
                  <Link href="/register">
                    <Sparkles className="mr-2 h-6 w-6" />
                    Create Free Account
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              )}
            </div>

            {!isAuthenticated && (
              <p className="mt-8 text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-violet-400 font-semibold hover:text-fuchsia-400 transition-colors">
                  Sign in here
                </Link>
              </p>
            )}

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>10K+ Students</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-violet-500/20 py-12 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notexia</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/docs" className="hover:text-violet-400 transition-colors">Documentation</Link>
              <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
              {isAuthenticated ? (
                <Link href="/dashboard" className="hover:text-violet-400 transition-colors">Dashboard</Link>
              ) : (
                <>
                  <Link href="/register" className="hover:text-violet-400 transition-colors">Get Started</Link>
                  <Link href="/login" className="hover:text-violet-400 transition-colors">Sign In</Link>
                </>
              )}
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
