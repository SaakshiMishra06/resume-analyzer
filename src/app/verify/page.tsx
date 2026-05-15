"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage("Unable to connect to the authentication server. Please check your internet connection and ensure the Supabase project is active.");
    }
  };

  return (
    <PageTransition className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">AI Resume</span>
          </Link>
        </div>

        <Card className="glass-panel border-white/10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
                    <p className="text-gray-400 text-sm">Enter your email to receive a magic link</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          className="pl-10" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={status === "loading"}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full relative" 
                      variant="gradient"
                      disabled={status === "loading" || !email}
                    >
                      {status === "loading" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Continue with Email
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                    
                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                    )}
                  </form>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CardContent className="p-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                    />
                    <CheckCircle2 className="w-10 h-10 text-green-400 relative z-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                  <p className="text-gray-400 text-sm mb-8 max-w-[250px]">
                    We've sent a magic link to <span className="text-white font-medium">{email}</span>
                  </p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {status !== "success" && (
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
              Log in
            </Link>
          </p>
        )}
      </div>
    </PageTransition>
  );
}
