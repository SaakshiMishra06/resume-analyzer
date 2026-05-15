"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent"
          >
            <BrainCircuit className="w-6 h-6 text-white" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight">AI Resume</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            How it Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Testimonials
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/verify">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-white/10 px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white">
              How it Works
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
              Log in
            </Link>
            <Link href="/verify">
              <Button variant="gradient" className="w-full mt-2">Get Started</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
