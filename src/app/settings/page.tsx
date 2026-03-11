"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Moon, Monitor, Laptop, CreditCard, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("Computer Science Senior passionate about productivity and web development.");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };


  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Monitor },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1200px] mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Settings</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your account preferences and customize your workspace.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 neon-stroke" 
                    : "hover:bg-card/60 text-muted-foreground hover:text-foreground hover:shadow-md"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
          
          <div className="pt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 border border-transparent hover:border-rose-500/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Log out</span>
            </button>
          </div>

        </aside>

        {/* Form Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <Card className="border-2 border-border/80 shadow-2xl bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden neon-stroke relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
            
            {activeTab === "profile" && (
              loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
              ) : (
                <>
                  <CardHeader className="border-b border-border/50 bg-card/80 backdrop-blur-md pb-6 pt-8 px-8 z-10">
                    <CardTitle className="text-2xl">Profile Settings</CardTitle>
                    <CardDescription className="text-base mt-2">Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-1 flex flex-col p-8 z-10 relative">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white font-bold shadow-xl shadow-indigo-500/20 neon-stroke ring-4 ring-background">
                        {fullName ? fullName[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
                      </div>
                      <div>
                        <Button variant="outline" className="mr-3 hover:bg-indigo-500 hover:text-white transition-colors">Change Avatar</Button>
                        <Button variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">Remove</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                         <Input 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Zen Student"
                            className="bg-background/50 h-12 text-base rounded-xl border-border/50 focus-visible:ring-indigo-500 shadow-inner" 
                         />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                         <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                         <Input 
                            value={user?.email || ""} 
                            type="email" 
                            disabled 
                            className="bg-background/50 h-12 text-base rounded-xl border-border/50 focus-visible:ring-indigo-500 shadow-inner opacity-60 cursor-not-allowed" 
                         />
                       </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-foreground/80">Bio</label>
                        <textarea 
                          className="w-full bg-background/50 rounded-xl border border-border/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-4 resize-none min-h-[100px] shadow-inner" 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 text-base font-bold transition-transform hover:scale-105">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </>
              )
            )}

            {activeTab === "appearance" && (
              <>
                <CardHeader className="border-b border-border/50 bg-card/80 backdrop-blur-md pb-6 pt-8 px-8 z-10">
                  <CardTitle className="text-2xl">Appearance</CardTitle>
                  <CardDescription className="text-base mt-2">Customize the look and feel of your app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 flex-1 flex flex-col p-8 z-10 relative">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Theme Preference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button onClick={() => setTheme("light")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10' : 'border-border/50 hover:border-indigo-500/50 bg-background/50'}`}>
                        <Monitor className="w-8 h-8 text-foreground" />
                        <span className="font-semibold">Light</span>
                      </button>
                      <button onClick={() => setTheme("dark")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/20' : 'border-border/50 hover:border-indigo-500/50 bg-background/50'}`}>
                        <Moon className="w-8 h-8 text-foreground" />
                        <span className="font-semibold">Dark</span>
                      </button>
                      <button onClick={() => setTheme("system")} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/20' : 'border-border/50 hover:border-indigo-500/50 bg-background/50'}`}>
                        <Laptop className="w-8 h-8 text-foreground" />
                        <span className="font-semibold">System</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab !== "profile" && activeTab !== "appearance" && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-bold">Coming Soon</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  We are actively building the {activeTab} settings pane. Check back in the next update!
                </p>
                <Badge className="mt-6 bg-indigo-500 hover:bg-indigo-600 px-4 py-1 text-sm">Under Construction</Badge>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
