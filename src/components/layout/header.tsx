import { Bell, Search, User as UserIcon, Settings, LogOut, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/50 backdrop-blur-xl px-6 sticky top-0 z-50">
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-lg relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search tasks, notes..."
            className="w-full bg-accent/50 text-foreground pl-10 h-10 border-none focus-visible:ring-indigo-500/50 rounded-xl"
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-3">
        <ThemeToggle />
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-muted-foreground hover:text-indigo-500 relative p-2.5 rounded-xl hover:bg-indigo-500/10 transition-all"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-background" />
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-accent/50 transition-all border border-transparent hover:border-border/50"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20">
              {user?.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden md:block text-sm font-bold text-foreground/80">
              {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
            </span>
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-card border border-border/50 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl"
              >
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account</p>
                  <p className="text-sm font-semibold truncate text-foreground">{user?.email}</p>
                </div>
                
                <Link href="/settings" onClick={() => setShowProfileMenu(false)}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500/10 hover:text-indigo-500 transition-all">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </Link>
                
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition-all text-muted-foreground">
                  <HelpCircle className="w-4 h-4" /> Help Center
                </button>
                
                <div className="h-px bg-border/50 my-1" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

