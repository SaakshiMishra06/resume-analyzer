"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ResumeAnalysis() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAnalyzed, setIsAnalyzed] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
    }, 3000);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis</h1>
          <p className="text-gray-400">Upload your resume to get instant AI feedback and ATS optimization.</p>
        </div>

        <AnimatePresence mode="wait">
          {!isAnalyzed ? (
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
                            {file ? "Ready to analyze" : "Supports PDF, DOCX up to 5MB."}
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
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                      </>
                    ) : (
                      <div className="py-12 flex flex-col items-center">
                        <div className="w-24 h-24 relative mb-8">
                          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                          <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-spin direction-reverse" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BrainIcon className="w-8 h-8 text-white animate-pulse" />
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
                            animate={{ strokeDashoffset: 251.2 - (251.2 * 0.94) }}
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
                           <span className="text-4xl font-bold text-white">94</span>
                           <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-1">Excellent</h3>
                     <p className="text-sm text-gray-400">Your ATS compatibility score</p>
                   </CardContent>
                </Card>

                <Card className="glass md:col-span-2">
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Your resume is well-structured and clearly highlights your experience as a Frontend Engineer. You have strong keywords related to modern web development (React, TypeScript, Next.js). However, there is a lack of quantifiable metrics in your most recent role, which could impact how recruiters perceive your impact.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <CheckCircle2 className="w-5 h-5 text-green-400" />
                           <h4 className="font-semibold text-green-400">Strengths</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                          <li>Clear, professional formatting</li>
                          <li>Strong technical skill section</li>
                          <li>No spelling/grammar errors</li>
                        </ul>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <AlertCircle className="w-5 h-5 text-red-400" />
                           <h4 className="font-semibold text-red-400">Needs Work</h4>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                          <li>Missing business impact metrics</li>
                          <li>Summary is too generic</li>
                          <li>Missing soft skills</li>
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
                     {[
                       { title: "Add quantifiable results to 'Senior Developer' role", desc: "Change 'Improved performance' to 'Improved load time by 40% through code splitting'." },
                       { title: "Include specific Cloud Provider keywords", desc: "You mentioned 'Cloud deployment' but ATS systems look for specific terms like AWS, Azure, or GCP." },
                       { title: "Shorten Education section", desc: "Since you have 5+ years of experience, move education to the bottom and remove the GPA." },
                     ].map((item, i) => (
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
                 <Button variant="outline" onClick={() => { setIsAnalyzed(false); setFile(null); }}>Upload New</Button>
                 <Button variant="gradient">Download PDF Report</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

function BrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}
