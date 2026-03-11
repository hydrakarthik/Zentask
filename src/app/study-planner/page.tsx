"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, BookOpen, Clock, Bot, User, BrainCircuit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function StudyPlannerPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "Hello! I am your AI Study Assistant. What are we studying today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'bot', 
          text: "⚠️ **API Key Missing**: Please add your `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env.local` file to activate my intelligence! You can get a free key from [Google AI Studio](https://aistudio.google.com/). Until then, I am running in offline mock mode." 
        }]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    try {
      // Gemini expects:
      // user -> model -> user -> model
      // We must filter to ensure we alternate properly and remove the initial bot greeting if it breaks the pattern
      const contents = newMessages
        .filter(msg => msg.id !== '1') // Remove initial greeting for API consistency
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));


      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Gemini');
      }

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: "Sorry, I encountered an error connecting to the AI. Please make sure your API key is valid and you have internet connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const schedule = [
    { time: "09:00 AM", task: "Machine Learning Concepts" },
    { time: "11:30 AM", task: "Database Practice Quiz" },
    { time: "02:00 PM", task: "Review Notes" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] w-full mx-auto h-full flex flex-col pb-2 min-h-[700px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-emerald-500" />
            AI Study Planner
          </h1>
          <p className="text-muted-foreground font-medium mt-1 text-lg">Generate schedules and ask questions to your personal AI tutor.</p>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        {/* Left Pane - Study Schedule Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-1/3 flex flex-col bg-card/60 backdrop-blur-xl rounded-2xl border-2 border-border/80 shadow-xl neon-stroke overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />
          <div className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-md relative z-10 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold">Today's Schedule</h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-6 relative z-10">
            {schedule.map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  {i !== schedule.length - 1 && <div className="w-0.5 h-full bg-border/80 my-1 group-hover:bg-emerald-500/50 transition-colors" />}
                </div>
                <div className="bg-background/50 border border-border/50 rounded-xl p-4 flex-1 shadow-sm transition-transform group-hover:scale-[1.02]">
                  <p className="text-sm font-bold text-emerald-500 mb-1">{item.time}</p>
                  <p className="font-semibold">{item.task}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 flex justify-center">
              <Button variant="outline" className="text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/10 w-full rounded-xl">
                Generate Full Schedule
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Pane - AI Chatbot Assistant */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-2/3 flex flex-col bg-card/60 backdrop-blur-xl rounded-2xl border-2 border-border/80 shadow-xl neon-stroke relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] -ml-40 -mb-40 pointer-events-none" />
          
          <div className="p-6 border-b border-border/50 bg-card/80 backdrop-blur-md flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ZenTutor AI</h2>
              <p className="text-xs text-emerald-500 font-bold tracking-widest uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-card border-2 border-border/80'}`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-base shadow-sm markdown-body ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none shadow-indigo-500/20' 
                      : 'bg-background/80 border border-border/50 text-foreground rounded-bl-none prose prose-emerald dark:prose-invert max-w-none prose-p:my-0 prose-pre:my-2 prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-a:text-emerald-500'
                  }`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>') }} />
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3 max-w-[80%]"
              >
                 <div className="w-8 h-8 rounded-full bg-card border-2 border-border/80 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-emerald-500" />
                 </div>
                 <div className="bg-background/80 border border-border/50 p-4 rounded-2xl rounded-bl-none flex gap-1 items-center h-12 shadow-sm">
                    <span className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce"></span>
                 </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50 relative z-10">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input 
                placeholder="Ask me to generate a schedule, summarize notes, or explain a topic..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-14 bg-background/50 border-2 border-border/50 focus-visible:ring-emerald-500 rounded-xl shadow-inner text-base px-4"
              />
              <Button type="submit" disabled={isTyping || !inputValue.trim()} className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 text-white font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
