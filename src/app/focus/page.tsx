"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, Clock, BellRing, BellOff, BarChart3, TestTube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";



export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [customTime, setCustomTime] = useState("");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5);

    if (!error) setStats(data || []);
  };

  const saveSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const duration = mode === "focus" ? 25 : mode === "break" ? 5 : 15;
    
    await supabase.from('focus_sessions').insert([{
      user_id: user.id,
      mode: mode,
      duration_minutes: duration
    }]);
    
    fetchStats();
  };



  
  useEffect(() => {
    // Replaced automatic switch logic with simply stopping the timer and playing an alarm
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      saveSession();
      playAlarm();
    }



    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!audioUnlocked) {
      unlockAudio();
    }
    setIsActive(!isActive);
  };

  const unlockAudio = () => {
    // Standard approach to unlock audio
    const silent = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    silent.volume = 0.01;
    silent.play()
      .then(() => {
        setAudioUnlocked(true);
        console.log("Audio Unlocked Successfully");
      })
      .catch(e => console.log("Unlock failed", e));
  };


  const playAlarm = () => {
    setIsRinging(true);
    // Use a very loud and distinct alarm sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3");
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;
    
    audio.play().catch(e => {
      console.log("Audio play failed", e);
      alert("⏰ TIME IS UP! (Sound was blocked by browser)");
    });

    setTimeout(() => stopAlarm(), 30000);
  };


  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsRinging(false);
  };



  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") setTimeLeft(25 * 60);
    else if (mode === "break") setTimeLeft(5 * 60);
    else if (mode === "longBreak") setTimeLeft(15 * 60);
  };

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customTime);
    if (!isNaN(mins) && mins > 0) {
      setIsActive(false);
      setTimeLeft(mins * 60);
      setCustomTime("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Focus Mode</h1>
        <p className="text-muted-foreground">Stay productive and take regular breaks.</p>
      </div>

      <div className="flex gap-4 w-full max-w-md">
        <Button 
          variant={mode === "focus" ? "default" : "outline"} 
          className={`flex-1 h-12 text-md transition-all ${mode === "focus" ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 neon-stroke border-indigo-500 scale-105" : "hover:border-indigo-500/50"}`}
          onClick={() => { setMode("focus"); setTimeLeft(25 * 60); setIsActive(false); }}
        >
          Focus (25m)
        </Button>
        <Button 
          variant={mode === "break" ? "default" : "outline"}
          className={`flex-1 h-12 text-md transition-all ${mode === "break" ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 neon-stroke border-emerald-500 scale-105" : "hover:border-emerald-500/50"}`}
          onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
        >
          Short Break (5m)
        </Button>
        <Button 
          variant={mode === "longBreak" ? "default" : "outline"}
          className={`flex-1 h-12 text-md transition-all ${mode === "longBreak" ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 neon-stroke border-purple-500 scale-105" : "hover:border-purple-500/50"}`}
          onClick={() => { setMode("longBreak"); setTimeLeft(15 * 60); setIsActive(false); }}
        >
          Long Break (15m)
        </Button>
      </div>

      <form onSubmit={handleCustomTimeSubmit} className="flex gap-2 w-full max-w-sm">
        <div className="relative flex-1">
          <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Custom time (mins)..." 
            type="number"
            min="1"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="pl-10 h-11 bg-card/50 backdrop-blur-sm"
          />
        </div>
        <Button type="submit" variant="secondary" className="h-11 px-6 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold">Set</Button>
      </form>

      <div className={`p-16 rounded-full w-80 h-80 flex items-center justify-center shadow-2xl border-8 transition-colors ${mode === "focus" ? "border-indigo-500/30 bg-card shadow-indigo-500/10 neon-stroke" : mode === 'break' ? "border-emerald-500/30 bg-card shadow-emerald-500/10 neon-stroke" : "border-purple-500/30 bg-card shadow-purple-500/10 neon-stroke"}`}>
        <div className={`text-7xl font-black tracking-tight tabular-nums ${mode === "focus" ? "text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" : mode === 'break' ? "text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <AnimatePresence mode="wait">
          {isRinging ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              key="stop-alarm"
            >
              <Button 
                size="lg" 
                variant="destructive"
                className="h-14 px-10 text-lg font-black shadow-2xl shadow-rose-500/50 animate-bounce"
                onClick={stopAlarm}
              >
                <BellOff className="mr-2 h-6 w-6" /> STOP ALARM
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className={`h-14 px-10 text-lg font-bold shadow-lg transition-transform hover:scale-105 ${mode === "focus" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25" : mode === "break" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25" : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/25"}`} onClick={toggleTimer}>
                {isActive ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 font-bold border-2 hover:bg-card/50" onClick={resetTimer}>
                <RotateCcw className="mr-2 h-5 w-5 text-muted-foreground" />
                Reset
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-14 w-14 border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-500 transition-all"
                title="Test Alarm Sound"
                onClick={() => {
                  if (!audioUnlocked) unlockAudio();
                  const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3");
                  audio.play().catch(() => alert("Click the page first to enable sound!"));
                }}
              >
                <TestTube className="h-6 w-6" />
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md mt-12 space-y-4">
        <div className="flex items-center gap-2 px-2">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-bold">Recent Sessions</h2>
        </div>
        
        <div className="space-y-3">
          {stats.length > 0 ? stats.map((session, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={session.id}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-white/5 neon-stroke">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${session.mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                    <span className="font-bold capitalize">{session.mode}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{session.duration_minutes}m</span>
                    <Badge variant="secondary" className="bg-white/5 text-[10px]">{new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <p className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed border-white/5 rounded-2xl">No sessions recorded yet. Finish a timer to start tracking!</p>
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground/60 text-sm mt-8 flex items-center gap-2">
        <Volume2 className="h-4 w-4" /> Alarm sound will play for 30s when timer completes
      </p>
    </div>
  );
}

