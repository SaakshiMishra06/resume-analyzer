"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mic, Target, TrendingUp, CheckCircle2, Star, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none opacity-50 mix-blend-screen" />
        
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Career Growth</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
          >
            Elevate Your Career with <br className="hidden md:block" />
            <span className="text-gradient">Intelligent Coaching</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Upload your resume, get an instant ATS score, and practice mock interviews with our advanced AI. Stand out and land your dream job faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/verify">
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2">
                <FileText className="w-5 h-5" />
                Analyze Resume
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="glass" className="w-full sm:w-auto gap-2">
                <Mic className="w-5 h-5" />
                Start Mock Interview
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating UI Elements Showcase */}
        <div className="relative mt-20 max-w-5xl mx-auto hidden md:block h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-3xl z-10"
          >
            <div className="glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl">
              <div className="bg-black/50 rounded-xl overflow-hidden aspect-[16/9] relative border border-white/5">
                {/* Mockup Dashboard Header */}
                <div className="absolute top-0 w-full h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>
                {/* Mockup content */}
                <div className="pt-16 px-8 flex gap-6 h-full">
                   <div className="w-1/3 flex flex-col gap-4">
                     <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
                     <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
                   </div>
                   <div className="w-2/3 flex flex-col gap-4">
                     <div className="h-full rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gradient mb-2">94%</div>
                          <div className="text-sm text-gray-400">ATS Match Score</div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 top-20 z-20"
          >
            <Card className="w-64 glass shadow-xl border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Keyword Optimized</div>
                  <div className="text-xs text-gray-400">React, Node.js found</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-8 top-40 z-20"
          >
            <Card className="w-64 glass shadow-xl border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Interview Readiness</div>
                  <div className="text-xs text-gray-400">Increased by 45%</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our AI tools analyze your profile and simulate real-world interviews to ensure you're fully prepared.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Smart Resume Analysis",
                description: "Get an instant ATS score, identify missing keywords, and receive actionable formatting tips."
              },
              {
                icon: Mic,
                title: "Voice Interview Coach",
                description: "Practice with our AI avatar. Get real-time transcription and feedback on your communication."
              },
              {
                icon: Target,
                title: "Targeted Questions",
                description: "Questions are dynamically generated based on your resume and the specific role you're applying for."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="h-full glass hover:bg-white/[0.08] transition-colors duration-300">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Resumes Analyzed", value: "50K+" },
              { label: "Mock Interviews", value: "100K+" },
              { label: "Success Rate", value: "92%" },
              { label: "Active Users", value: "10K+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm mt-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-4">
             <BrainCircuit className="w-5 h-5 text-gray-400" />
             <span className="font-semibold text-gray-400">AI Resume Coach</span>
          </div>
          <p>© {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
