"use client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, ChevronRight, CheckCircle2, Clock, CalendarIcon, GraduationCap, Flame, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      className="space-y-10 max-w-[1600px] w-full mx-auto pb-16 pt-4 px-4 md:px-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-foreground">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Karthik!</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium flex items-center">
            <Flame className="w-5 h-5 text-orange-500 mr-2" /> You're on a 5-day productivity streak
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Row 1 */}
        <motion.div variants={item} className="md:col-span-12 lg:col-span-7">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-indigo-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-500 group">
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
              </div>
              <Link href="/tasks">
                <Button variant="ghost" className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-medium group/btn">
                  View All <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { id: "t1", title: "Complete Advanced ML Assignment algorithms", time: "10:00 AM", priority: "High" },
                  { id: "t2", title: "Review Operating Systems Chapter 4", time: "2:30 PM", priority: "Medium" },
                  { id: "t3", title: "Update personal portfolio GitHub repo", time: "6:00 PM", priority: "Low" },
                ].map((task, i) => (
                  <motion.div 
                    whileHover={{ x: 6, backgroundColor: "var(--color-muted) opacity: 0.5" }}
                    key={task.id} 
                    className="flex items-start md:items-center justify-between p-5 transition-all group/item hover:bg-muted/50"
                  >
                    <div className="flex items-start space-x-4">
                      <Checkbox id={task.id} className="mt-1 md:mt-0 rounded border-2 border-indigo-500/50 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 h-5 w-5" />
                      <div>
                        <label htmlFor={task.id} className="text-base font-semibold leading-none cursor-pointer group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
                          {task.title}
                        </label>
                        <p className="text-sm font-medium text-muted-foreground mt-1.5 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {task.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`hidden md:flex ml-4 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      task.priority === 'High' ? 'border-rose-500/30 text-rose-500 bg-rose-500/10' : 
                      task.priority === 'Medium' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 
                      'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                    }`}>
                      {task.priority}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="md:col-span-12 lg:col-span-5">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-purple-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-500 group">
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-500">
                <CalendarIcon className="w-5 h-5 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center bg-gradient-to-br from-card to-muted/20">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border shadow-sm bg-card p-4 mx-auto font-medium"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2 */}
        <motion.div variants={item} className="md:col-span-12 lg:col-span-7">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-rose-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-rose-500/10 hover:border-rose-500/50 transition-all duration-500 group">
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-500">
                <GraduationCap className="w-5 h-5 text-rose-500 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { id: "e1", title: "Math Exam", date: "Mar 18", days: 3 },
                  { id: "e2", title: "AI Final Exam", date: "Mar 22", days: 7 },
                ].map((exam) => (
                  <motion.div 
                    whileHover={{ x: 6, backgroundColor: "var(--color-muted) opacity: 0.5" }}
                    key={exam.id} 
                    className="flex justify-between items-center p-5 transition-all hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-rose-500/30">
                        <span className="text-[10px] uppercase leading-none mb-0.5 opacity-90">{exam.date.split(' ')[0]}</span>
                        <span className="text-lg leading-none">{exam.date.split(' ')[1]}</span>
                      </div>
                      <label className="text-lg font-bold">
                        {exam.title}
                      </label>
                    </div>
                    <Badge variant="outline" className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${exam.days <= 3 ? 'bg-rose-500 flex text-white border-transparent shadow shadow-rose-500/50' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                      In {exam.days} days
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="md:col-span-12 lg:col-span-5">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-emerald-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all duration-500 group relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                <Clock className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold">Focus Timer</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[220px] relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-teal-600 tabular-nums drop-shadow-sm"
              >
                25:00
              </motion.div>
              <div className="flex gap-4 w-full px-4">
                <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 h-12 text-base font-bold rounded-xl transition-all hover:-translate-y-1">
                  <Play className="mr-2 w-5 h-5" /> Start Focus
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all">
                  <Square className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 3 */}
        <motion.div variants={item} className="md:col-span-12 lg:col-span-6">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-amber-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-amber-500/10 hover:border-amber-500/50 transition-all duration-500 group">
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                <BookOpen className="w-5 h-5 text-amber-500 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold">Quick Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { id: "n1", title: "Idea for new React Project using NextJS" },
                  { id: "n2", title: "Key insights from the design patterns book" },
                  { id: "n3", title: "Remember to email professor regarding grades" },
                ].map((note) => (
                  <motion.div 
                    whileHover={{ x: 6, backgroundColor: "var(--color-muted) opacity: 0.5" }}
                    key={note.id} 
                    className="flex items-center space-x-4 p-5 hover:bg-muted/50 transition-all cursor-pointer group/note"
                  >
                    <div className="w-4 h-4 rounded-full border-[3px] border-amber-500/50 flex-shrink-0 group-hover/note:bg-amber-500 transition-colors shadow shadow-amber-500/20" />
                    <span className="text-base font-semibold text-foreground/80 group-hover/note:text-foreground transition-colors">{note.title}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="md:col-span-12 lg:col-span-6">
          <Card className="h-full border-2 border-border/80 shadow-xl shadow-pink-500/5 bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-pink-500/10 hover:border-pink-500/50 transition-all duration-500 group">
            <CardHeader className="py-6 px-8 border-b-2 border-border/50 bg-card backdrop-blur-md flex flex-row items-center">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center mr-3 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500">
                <CalendarIcon className="w-5 h-5 text-pink-500 group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold">Study Planner Highlights</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { id: "s1", title: "Review Graph Neural Networks Notes" },
                  { id: "s2", title: "Practice Dynamic Programming Leetcode" },
                  { id: "s3", title: "Watch MIT 6.006 ML Lecture 14" },
                ].map((item) => (
                  <motion.div 
                    whileHover={{ x: 6, backgroundColor: "var(--color-muted) opacity: 0.5" }}
                    key={item.id} 
                    className="flex items-center space-x-4 p-5 hover:bg-muted/50 transition-all cursor-pointer group/plan"
                  >
                    <div className="w-4 flex justify-center text-pink-500 font-bold group-hover/plan:scale-150 transition-transform">
                      -
                    </div>
                    <span className="text-base font-semibold text-foreground/80 group-hover/plan:text-foreground transition-colors">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
