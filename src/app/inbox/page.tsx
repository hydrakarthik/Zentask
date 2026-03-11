"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Star, Clock, Send, Archive, Trash2, Filter, Loader2, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";


const MOCK_EMAILS = [
  { id: 1, sender: "Prof. Alan Turing", subject: "Machine Learning Final Project Guidelines", preview: "Please find attached the guidelines for your final project. Ensure you focus on neural network architectures...", time: "10:30 AM", unread: true, starred: true, labels: ["important", "university"] },
  { id: 2, subject: "ZenTask Team", sender: "ZenTask Support", preview: "Welcome to ZenTask Premium! Your account has been upgraded successfully.", time: "Yesterday", unread: false, starred: false, labels: ["system"] },
  { id: 3, sender: "Study Group - CS301", subject: "Meeting Tomorrow", preview: "Hey everyone, just a reminder that we are meeting at the library tomorrow at 4 PM to discuss the assignment.", time: "Yesterday", unread: false, starred: false, labels: ["study"] },
  { id: 4, sender: "University Registrar", subject: "Fall Semester Registration Open", preview: "Registration for the Fall upcoming semester is now officially open. Please log in to your student portal...", time: "Oct 12", unread: true, starred: false, labels: ["university"] },
  { id: 5, sender: "GitHub", subject: "[GitHub] A new commit has been pushed", preview: "Karthik pushed 3 commits to karthik/zentask-app-repo. View the diffs on GitHub.", time: "Oct 10", unread: false, starred: false, labels: ["dev"] },
];

export default function InboxPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "important">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setNotifications(data || []);
      if (data && data.length > 0) setSelectedId(data[0].id);
    }
    setLoading(false);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = (n.title + n.content).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || (filterType === "unread" && !n.is_read) || (filterType === "important" && n.type === 'priority');
    return matchesSearch && matchesFilter;
  });

  const toggleRead = async (id: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };


  const getLabelColor = (label: string) => {
    switch (label) {
      case "important": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "university": return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "study": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "dev": return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
      default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] w-full mx-auto h-[calc(100vh-8rem)] flex flex-col pt-4 pb-8"
    >
      <div className="flex items-center justify-between mb-8 px-2 md:px-0">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Inbox</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage all your communications and notifications.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Email List Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-[400px] lg:w-[450px] flex flex-col bg-card/60 backdrop-blur-xl border-white/20 dark:border-white/10 border shadow-2xl rounded-2xl overflow-hidden shadow-indigo-500/5 dark:shadow-indigo-500/10 neon-stroke"
        >
          <div className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search inbox..." 
                className="pl-9 bg-background/50 border-border/50 focus-visible:ring-indigo-500 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 tailwind-scrollbar-hide">
              <Badge onClick={() => setFilterType("all")} variant={filterType === "all" ? "default" : "outline"} className={`rounded-full cursor-pointer transition-colors ${filterType === 'all' ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-transparent' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>All</Badge>
              <Badge onClick={() => setFilterType("unread")} variant={filterType === "unread" ? "default" : "outline"} className={`rounded-full cursor-pointer transition-colors ${filterType === 'unread' ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-transparent' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>Unread</Badge>
              <Badge onClick={() => setFilterType("important")} variant={filterType === "important" ? "default" : "outline"} className={`rounded-full cursor-pointer transition-colors ${filterType === 'important' ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-transparent' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>Important</Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto w-full">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No notifications found.</div>
              ) : filteredNotifications.map((notif, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 border-b border-border/50 cursor-pointer transition-all relative overflow-hidden group ${selectedId === notif.id ? 'bg-indigo-500/5 border-l-4 border-l-indigo-500' : 'hover:border-l-4 hover:border-l-indigo-500/50 border-l-4 border-l-transparent'}`}
                  key={notif.id}
                  onClick={() => {
                    setSelectedId(notif.id);
                    if (!notif.is_read) toggleRead(notif.id);
                  }}
                >
                  {!notif.is_read && (
                    <span className="absolute top-4 left-3 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}
                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-semibold truncate pr-4 text-base ${!notif.is_read ? 'text-foreground' : 'text-foreground/80'}`}>{notif.title}</h4>
                      <span className="text-xs font-medium text-muted-foreground shrink-0">{new Date(notif.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notif.content}
                    </p>
                    <div className="flex gap-2 mt-3 overflow-hidden">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0 border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase tracking-wider font-bold`}>
                        {notif.type}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* Email Viewer */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-card/60 backdrop-blur-xl border-white/20 dark:border-white/10 border shadow-2xl rounded-2xl flex flex-col overflow-hidden relative neon-stroke"
        >
          {selectedId ? (() => {
            const notif = notifications.find(n => n.id === selectedId);
            if (!notif) return null;
            return (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                
                <div className="p-6 md:p-8 flex items-start justify-between border-b border-border/50 bg-background/30 z-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-foreground">{notif.title}</h2>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {notif.type.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">ZenTask Notifications</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(notif.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-colors group">
                      <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto text-foreground/90 leading-relaxed text-base md:text-lg z-10 font-medium whitespace-pre-line">
                  {notif.content}
                </div>
              </>
            );
          })() : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background/20 relative z-10">
              <Bell className="h-20 w-20 mb-6 opacity-20 text-indigo-500" />
              <p className="text-xl font-medium">Select a notification to read</p>
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
}
