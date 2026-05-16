"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, Brain } from "lucide-react";

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  suggestions: { title: string; desc: string }[];
  level: string;
  timestamp?: string;
}

export default function ResumeAnalysis() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [results, setResults] = React.useState<AnalysisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-gray-400">Upload your resume to get instant AI feedback and ATS optimization.</p>
        </div>

        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass border-dashed border-2 border-white/20">
                <CardContent className="p-12">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center text-center space-y-6"
                  >
                    {!isUploading ? (
                      <>
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <UploadCloud className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {file ? file.name : "Drag & Drop your resume here"}
                          </h3>
                          <p className="text-gray-400 max-w-sm">
                            {file ? "Ready to analyze" : "Supports PDF files up to 5MB."}
                          </p>
                        </div>
                        {!file ? (
                          <div className="relative">
                            <Button variant="outline" className="relative z-10 pointer-events-none">
                              Browse Files
                            </Button>
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              accept=".pdf"
                              onChange={(e) => {
                                setFile(e.target.files?.[0] || null);
                                setError(null);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
                            <Button variant="gradient" onClick={handleAnalyze}>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Analyze with AI
                            </Button>
                          </div>
                        )}
                        {error && (
                          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-12 flex flex-col items-center">
                        <div className="w-24 h-24 relative mb-8">
                          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                          <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-spin direction-reverse" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-8 h-8 text-white animate-pulse" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Analyzing Resume...</h3>
                        <p className="text-gray-400">Our AI is extracting keywords, evaluating format, and scoring ATS compatibility.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass md:col-span-1 border-primary/30 relative overflow-hidden">
                   <div className="absolute inset-0 bg-primary/5"></div>
                   <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                     <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                     AI Active
                   </div>
                   <CardContent className="p-8 text-center relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                          <motion.circle 
                            cx="50" cy="50" r="40" 
                            stroke="url(#gradient)" 
                            strokeWidth="8" 
                            fill="none" 
                            strokeDasharray="251.2" 
                            strokeDashoffset="251.2"
                            animate={{ strokeDashoffset: 251.2 - (251.2 * (results.score / 100)) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                           <span className="text-4xl font-bold text-white">{results.score}</span>
                           <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{results.level}</h3>
                      <p className="text-sm text-gray-400">Your ATS compatibility score</p>
                      {results.timestamp && (
                        <p className="text-[10px] text-gray-600 mt-4 italic">Analysis Date: {new Date(results.timestamp).toLocaleString()}</p>
                      )}
                   </CardContent>
                </Card>

                <Card className="glass md:col-span-2">
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {results.summary}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <CheckCircle2 className="w-5 h-5 text-green-400" />
                           <h4 className="font-semibold text-green-400">Strengths</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                          {results.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <AlertCircle className="w-5 h-5 text-red-400" />
                           <h4 className="font-semibold text-red-400">Needs Work</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                          {results.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Suggested Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                     {results.suggestions.map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                           <div className="mt-1">
                             <Sparkles className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                             <h4 className="text-white font-medium mb-1">{item.title}</h4>
                             <p className="text-sm text-gray-400">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                 <Button variant="outline" onClick={() => { setResults(null); setFile(null); }}>Upload New</Button>
                 <Button variant="gradient" onClick={() => window.print()}>Print Analysis</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
