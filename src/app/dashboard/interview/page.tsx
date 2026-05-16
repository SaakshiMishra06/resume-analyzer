"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Send, Bot, User, Settings2, Loader2 } from "lucide-react";

export default function InterviewCoach() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { role: "ai", text: "Hello! I'm your AI Interview Coach. I've reviewed your background. Are you ready to start our mock interview for a Senior Engineering role?" }
  ]);
  const [inputText, setInputText] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = { role: "user", text: inputText };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting to my brain right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Main Chat Interface */}
          <Card className="glass flex-1 flex flex-col overflow-hidden">
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
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
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm text-gray-500 italic">
                    AI is thinking...
                  </div>
                </motion.div>
              )}
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
                    disabled={isRecording || isLoading}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-full px-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                </div>
                <Button variant="gradient" size="icon" onClick={handleSend} disabled={!inputText.trim() || isLoading}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Right Sidebar - Feedback & Stats */}
          <div className="hidden lg:flex w-80 flex-col gap-6">
            <Card className="glass overflow-hidden">
              <div className="aspect-video bg-black relative border-b border-white/10">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                     <Bot className="w-8 h-8 text-primary" />
                   </div>
                   <span className="text-sm text-gray-400 font-medium">AI Interviewer</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live Connection
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Real-time Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <h4 className="text-xs text-gray-400 uppercase mb-2">Current Focus</h4>
                   <p className="text-sm text-white font-medium">Technical Problem Solving</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <h4 className="text-xs text-gray-400 uppercase mb-2">AI Model</h4>
                   <p className="text-sm text-white font-medium">GPT-4o (Advanced)</p>
                </div>
                <div className="mt-auto pt-6 text-center">
                   <p className="text-xs text-gray-500 italic">"The AI tracks your answers to provide a final score at the end."</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
