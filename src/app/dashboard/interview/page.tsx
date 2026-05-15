"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Send, Bot, User, Settings2 } from "lucide-react";

export default function InterviewCoach() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: "ai", text: "Hello Alex. I've reviewed your resume. We'll be doing a mock interview for the Senior Frontend Engineer role. Are you ready for the first question?" }
  ]);
  const [inputText, setInputText] = React.useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: inputText }]);
    setInputText("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Great. Can you describe a time when you had to optimize the performance of a complex React application? What specific techniques did you use, and what was the impact?" 
      }]);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Interview Coach</h1>
            <p className="text-gray-400">Practice behavioral and technical questions.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="w-4 h-4" />
            Configure Interview
          </Button>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Main Chat Interface */}
          <Card className="glass flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "ai" ? "bg-primary/20 text-primary" : "bg-white/10 text-white"
                  }`}>
                    {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.role === "ai" 
                      ? "bg-white/5 border border-white/10 rounded-tl-sm text-gray-300" 
                      : "bg-primary text-white rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div className="h-4" />
            </CardContent>
            
            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/50">
              <div className="flex items-center gap-4">
                <Button 
                  variant={isRecording ? "gradient" : "outline"}
                  size="icon"
                  className={isRecording ? "animate-pulse" : ""}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isRecording ? "Listening..." : "Type your answer..."}
                    disabled={isRecording}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-full px-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  {isRecording && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: ["20%", "80%", "20%"] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-primary rounded-full"
                          style={{ height: "20%" }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="gradient" size="icon" onClick={handleSend} disabled={!inputText.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Right Sidebar - Feedback & Stats */}
          <div className="w-80 flex flex-col gap-6">
            {/* Video Placeholder */}
            <Card className="glass overflow-hidden">
              <div className="aspect-video bg-black relative border-b border-white/10">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                     <Bot className="w-8 h-8 text-primary" />
                   </div>
                   <span className="text-sm text-gray-400 font-medium">AI Interviewer</span>
                </div>
                {/* Speaking Indicator */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1 bg-green-500 rounded-full"
                      style={{ height: "4px" }}
                    />
                  ))}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Time Elapsed</span>
                  <span className="text-white font-medium tracking-wider">04:23</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Real-time Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Speaking Pace</span>
                      <span className="text-green-400">Good</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[65%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-primary">82%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[82%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Filler Words</span>
                      <span className="text-amber-400">Needs Work</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try to reduce the use of "um" and "like".</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
