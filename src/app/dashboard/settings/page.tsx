"use client";

import * as React from "react";
import { PageTransition } from "@/components/animations/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Bell, Shield, Key, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: ""
  });

  React.useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || "";
        const parts = fullName.split(" ");
        setProfile({
          firstName: user.user_metadata?.first_name || parts[0] || "",
          lastName: user.user_metadata?.last_name || parts.slice(1).join(" ") || "",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || ""
        });
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: `${profile.firstName} ${profile.lastName}`.trim(),
        first_name: profile.firstName,
        last_name: profile.lastName,
      }
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(error.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Nav */}
          <div className="space-y-2">
            {[
              { id: "profile", label: "Profile", icon: User, active: true },
              { id: "notifications", label: "Notifications", icon: Bell, active: false },
              { id: "security", label: "Security", icon: Shield, active: false },
              { id: "api-keys", label: "API Keys", icon: Key, active: false },
            ].map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? "bg-primary/20 text-primary border border-primary/20" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white border-2 border-white/10 overflow-hidden">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile.firstName ? profile.firstName[0].toUpperCase() : <User className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mb-2"
                      onClick={() => {
                        const url = prompt("Enter Image URL for profile picture:");
                        if (url) setProfile({ ...profile, avatarUrl: url });
                      }}
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-500">Paste an image URL to update your avatar.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">First Name</label>
                    <Input 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                    <Input 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input 
                    value={profile.email} 
                    disabled 
                    className="opacity-50 cursor-not-allowed"
                    title="Email cannot be changed here"
                  />
                  <p className="text-[10px] text-gray-500 italic">Email is managed by your authentication provider.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-400 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Changes saved successfully!
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-4 ml-auto">
                <Button variant="ghost" onClick={() => window.location.reload()}>Cancel</Button>
                <Button 
                  variant="gradient" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
