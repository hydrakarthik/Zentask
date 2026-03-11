"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, BookOpen, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Exam {
  id: number;
  subject: string;
  date: string;
  notes: string;
  user_id?: string;
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching exams:', error);
    } else {
      setExams(data || []);
    }
    setLoading(false);
  };

  const addExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDate) return;

    const { data, error } = await supabase
      .from('exams')
      .insert([{ subject: newSubject, date: newDate, notes: newNotes }])
      .select();

    if (error) {
      console.error('Error adding exam:', error);
      alert('Failed to add exam. Make sure the "exams" table exists in your Supabase project.');
    } else if (data) {
      setExams([...exams, data[0]].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewSubject("");
      setNewDate("");
      setNewNotes("");
    }
  };

  const deleteExam = async (id: number) => {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting exam:', error);
    } else {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const calculateDaysLeft = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateString);
    const diffTime = Math.abs(examDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] w-full mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Exams</h1>
          <p className="text-muted-foreground mt-1 text-lg">Schedule and prepare for upcoming exams with premium tracking.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Exam List */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <AnimatePresence>
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              </motion.div>
            ) : exams.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-card/60 backdrop-blur-xl rounded-2xl border-2 border-border/50 text-muted-foreground text-lg shadow-xl neon-stroke flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                No upcoming exams. You're free!
              </motion.div>
            ) : (
              exams.map((exam, index) => (
                <motion.div 
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative group overflow-hidden bg-card/60 backdrop-blur-xl border-2 border-border/80 shadow-lg hover:shadow-indigo-500/10 neon-stroke transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-500" />
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    <CardHeader className="pb-3 pt-6 px-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl font-bold">{exam.subject}</CardTitle>
                          <CardDescription className="flex items-center mt-2 text-indigo-500 dark:text-indigo-400 font-bold text-base">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {new Date(exam.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm">
                            <Clock className="mr-2 h-4 w-4" />
                            {calculateDaysLeft(exam.date)} days left
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="flex items-start justify-between">
                        <p className="text-base text-muted-foreground/90 flex items-start font-medium bg-background/40 p-3 rounded-lg flex-1 mr-4 border border-border/50">
                          <BookOpen className="mr-3 h-5 w-5 mt-0.5 text-indigo-500 shrink-0" />
                          {exam.notes || "No additional notes provided."}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteExam(exam.id)}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-white hover:bg-rose-500 transition-all h-10 w-10 shrink-0 shadow-sm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Add Exam Form */}
        <motion.div 
          className="md:col-span-4 lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/60 backdrop-blur-xl border-2 border-border/80 shadow-xl neon-stroke sticky top-8">
            <CardHeader className="border-b border-border/50 bg-card/80 backdrop-blur-md pb-4 pt-6 px-6">
              <CardTitle className="text-xl flex items-center gap-2 text-indigo-500"><Plus className="h-5 w-5" /> Add Exam</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={addExam} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-foreground/80">Subject</label>
                  <Input 
                    id="subject"
                    placeholder="e.g. Mathematics" 
                    value={newSubject} 
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="bg-background/50 h-11 text-base rounded-xl border-border/50 focus-visible:ring-indigo-500 shadow-inner block"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-bold text-foreground/80">Date</label>
                  <Input 
                    id="date"
                    type="date"
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-background/50 h-11 text-base rounded-xl border-border/50 focus-visible:ring-indigo-500 shadow-inner w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-bold text-foreground/80">Notes (Optional)</label>
                  <Input 
                    id="notes"
                    placeholder="e.g. Focus on chapters 1-3" 
                    value={newNotes} 
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="bg-background/50 h-11 text-base rounded-xl border-border/50 focus-visible:ring-indigo-500 shadow-inner"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 text-base font-bold transition-transform hover:scale-105 mt-2 rounded-xl">
                  Add Exam
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
