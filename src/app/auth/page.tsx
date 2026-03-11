"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Github, Sparkles, ArrowRight, Loader2, Phone, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/");
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMethod === "email") {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({ 
            email, 
            password, 
            options: { data: { full_name: name } } 
          });
          if (error) throw error;
          alert("Check your email for the confirmation link!");
        }
      } else {
        // Phone Auth
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        alert("Check your phone for the OTP!");
      }
      if (isLogin || authMethod === "phone") router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0B] flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Dynamic Background Art */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[45%] h-[45%] bg-emerald-500/5 rounded-full blur-[140px] animate-pulse animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md mb-4"
          >
            <Sparkles className="h-7 w-7 text-indigo-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight">ZenTask</h1>
          <p className="text-white/50 text-sm font-medium mt-1">Refined productivity for modern students.</p>
        </div>

        <div className="bg-[#121214]/80 backdrop-blur-2xl p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-30" />
          
          {/* Method Selector */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setAuthMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button 
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${authMethod === 'phone' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {authMethod === "email" ? (
                <motion.div 
                  key="email-fields" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500/50"
                        required={!isLogin}
                      />
                    </div>
                  )}
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    required
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="phone-fields" 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    required
                  />
                  <p className="text-white/30 text-[10px] text-center px-4">We'll send you a one-time passcode to verify your number.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-400 font-bold bg-rose-400/10 p-3 rounded-lg border border-rose-400/20 text-center">
                {error}
              </motion.p>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? "Sign In" : "Get Started")}
            </Button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Or Securely Join With</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleLogin}
                className="h-12 border-white/5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold rounded-xl"
              >
                <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => {}} 
                className="h-12 border-white/5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold rounded-xl"
              >
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/40 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 mx-auto group"
            >
              {isLogin ? "New here? Create a free account" : "Already have an account? Sign in"}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-white/20 text-[10px] uppercase font-black tracking-widest">
          Enterprise Grade Security • 256-bit Encryption
        </p>
      </motion.div>
    </div>
  );
}

