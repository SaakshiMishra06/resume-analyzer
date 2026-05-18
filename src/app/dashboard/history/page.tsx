"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Mic, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  X, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  User 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function HistoryPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = React.useState<"analyses" | "interviews">("analyses");
  const [loading, setLoading] = React.useState(true);
  const [analyses, setAnalyses] = React.useState<any[]>([]);
  const [interviews, setInterviews] = React.useState<any[]>([]);
  
  // Modal states
  const [selectedAnalysis, setSelectedAnalysis] = React.useState<any | null>(null);
  const [selectedInterview, setSelectedInterview] = React.useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch Analyses
      const { data: analysesData } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch Interviews
      const { data: interviewsData } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setAnalyses(analysesData || []);
      setInterviews(interviewsData || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAnalysis = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this resume analysis record?")) {
      const { error } = await supabase.from("analyses").delete().eq("id", id);
      if (!error) {
        setAnalyses(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  const handleDeleteInterview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this interview transcript record?")) {
      const { error } = await supabase.from("interviews").delete().eq("id", id);
      if (!error) {
        setInterviews(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Activity History</h1>
          <p className="text-gray-400">Review your past resume ATS scores and mock interview transcripts.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit mb-8 relative">
          {[
            { id: "analyses", label: "Resume Analyses", icon: FileText },
            { id: "interviews", label: "Mock Interviews", icon: Mic }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="history-active-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 to-accent/30 border border-primary/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <tab.icon className="w-4 h-4 z-10" />
                <span className="z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-400 text-sm font-medium">Fetching history...</p>
          </div>
        ) : (
          <div>
            {/* Resume Analyses Content */}
            {activeTab === "analyses" && (
              <div className="space-y-4">
                {analyses.length > 0 ? (
                  analyses.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedAnalysis(item)}
                      className="glass border border-white/10 rounded-2xl p-6 hover:border-primary/40 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-1 flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-white text-lg">ATS Score: {item.score}/100</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              item.score >= 80 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : item.score >= 50 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {item.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl mb-2">{item.summary}</p>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end md:justify-start">
                        <Button variant="ghost" size="icon" onClick={(e) => handleDeleteAnalysis(item.id, e)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center glass border-dashed border-2 border-white/10 rounded-3xl">
                    <FileText className="w-16 h-16 text-gray-600 mb-4 opacity-30" />
                    <h3 className="text-xl font-bold text-white mb-1">No Resume Analyses Found</h3>
                    <p className="text-gray-400 text-sm max-w-sm mb-6">Upload your resume to instantly check your ATS score and get insights.</p>
                    <Link href="/dashboard/resume" className="no-underline">
                      <Button variant="gradient">Analyze Resume</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mock Interviews Content */}
            {activeTab === "interviews" && (
              <div className="space-y-4">
                {interviews.length > 0 ? (
                  interviews.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => item.transcript && setSelectedInterview(item)}
                      className="glass border border-white/10 rounded-2xl p-6 hover:border-primary/40 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-1 flex-shrink-0">
                          <Mic className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg mb-1">AI Mock Interview Session</h3>
                          <p className="text-sm text-gray-400 max-w-2xl mb-2">
                            {item.transcript ? `Chat Transcript (${item.transcript.length} messages exchanged)` : "No messages recorded"}
                          </p>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end md:justify-start">
                        <Button variant="ghost" size="icon" onClick={(e) => handleDeleteInterview(item.id, e)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center glass border-dashed border-2 border-white/10 rounded-3xl">
                    <Mic className="w-16 h-16 text-gray-600 mb-4 opacity-30" />
                    <h3 className="text-xl font-bold text-white mb-1">No Interviews Conducted</h3>
                    <p className="text-gray-400 text-sm max-w-sm mb-6">Start a live conversation with our AI Interview Coach to practice.</p>
                    <Link href="/dashboard/interview" className="no-underline">
                      <Button variant="gradient">Start Mock Interview</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- MODAL FOR RESUME ANALYSIS DETAIL --- */}
        <AnimatePresence>
          {selectedAnalysis && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAnalysis(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              />
              
              {/* Dialog Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Analysis Report</h2>
                      <p className="text-xs text-gray-500">Recorded {new Date(selectedAnalysis.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAnalysis(null)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (selectedAnalysis.score / 100))} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-white">{selectedAnalysis.score}</span>
                        <span className="text-[10px] text-gray-400">/ 100</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">ATS Verdict: {selectedAnalysis.level}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedAnalysis.summary}</p>
                    </div>
                  </div>

                  {selectedAnalysis.raw_data ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <h4 className="font-semibold text-green-400">Strengths Identified</h4>
                          </div>
                          <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                            {selectedAnalysis.raw_data.strengths?.map((s: string, idx: number) => (
                              <li key={idx} className="leading-relaxed">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h4 className="font-semibold text-red-400">Needs Work</h4>
                          </div>
                          <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                            {selectedAnalysis.raw_data.improvements?.map((imp: string, idx: number) => (
                              <li key={idx} className="leading-relaxed">{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-white text-lg">Detailed suggestions:</h4>
                        <div className="space-y-3">
                          {selectedAnalysis.raw_data.suggestions?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                              <div className="mt-1 flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                              </div>
                              <div>
                                <h5 className="text-white font-medium mb-1 text-sm">{item.title}</h5>
                                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 italic text-sm">
                      Detailed suggestion metrics are unavailable for older recordings.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL FOR INTERVIEW CONVERSATION DETAIL --- */}
        <AnimatePresence>
          {selectedInterview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedInterview(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              />
              
              {/* Dialog Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass border border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col h-[75vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Interview Practice Session</h2>
                      <p className="text-xs text-gray-500">Conducted {new Date(selectedInterview.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedInterview(null)}
                    className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Chat Transcript Area */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-black/20">
                  {selectedInterview.transcript && selectedInterview.transcript.map((msg: any, i: number) => (
                    <div 
                      key={i}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "ai" ? "bg-primary/20 text-primary" : "bg-white/10 text-white"
                      }`}>
                        {msg.role === "ai" ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                      </div>
                      <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${
                        msg.role === "ai" 
                          ? "bg-white/5 border border-white/10 rounded-tl-sm text-gray-300 leading-relaxed" 
                          : "bg-primary text-white rounded-tr-sm leading-relaxed"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
