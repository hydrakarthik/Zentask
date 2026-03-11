"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BookOpen, Clock, Settings, FileText, Inbox, Book, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tasks", href: "/tasks", icon: FileText },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Exams", href: "/exams", icon: Calendar },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Study Planner", href: "/study-planner", icon: Book },
  { name: "Focus Mode", href: "/focus", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card/60 backdrop-blur-xl border-r border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex h-16 items-center px-8 gap-3 border-b border-border/50">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          ZenTask
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative ${
                  isActive 
                  ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" 
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-indigo-500 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-white" : "group-hover:text-indigo-500"}`} />
                {item.name}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-border/50">
        <Link href="/settings">
          <motion.div 
            whileHover={{ x: 4 }}
            className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/settings' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <Settings className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/settings' ? 'text-white' : 'group-hover:text-indigo-500'}`} />
            Settings
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

