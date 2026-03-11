"use client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar as CalendarIcon, Clock, Type, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface CalendarEvent {
  id?: number;
  title: string;
  type: "task" | "exam";
  time: string;
  date: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<"task" | "exam">("task");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*');

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  // Function to check if a date has events
  const getEventsForDate = (checkDate: Date) => {
    const checkDateStr = checkDate.toISOString().split('T')[0];
    return events.filter(
      (event) => event.date === checkDateStr
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const selectedEvents = date ? getEventsForDate(date) : [];

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !newEventTitle.trim() || !newEventTime) return;

    const dateStr = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{ title: newEventTitle, type: newEventType, time: newEventTime, date: dateStr }])
      .select();

    if (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Make sure the "calendar_events" table exists.');
    } else if (data) {
      setEvents([...events, data[0]]);
      setNewEventTitle("");
      setNewEventTime("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Calendar</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage your schedule, events, and upcoming deadlines in high definition.</p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        <Card className="lg:col-span-5 xl:col-span-4 border-2 border-border/80 shadow-2xl bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden neon-stroke flex flex-col">
          <CardHeader className="border-b border-border/50 bg-card/80 backdrop-blur-md pb-6 pt-8 px-8">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-500" /> Date Selection
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">Select a date to view or add events</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex justify-center items-center py-8">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border shadow-lg bg-background/50 backdrop-blur-md p-6 transform scale-125 origin-center font-medium"
              modifiers={{
                hasEvent: events.map((e) => new Date(e.date)),
              }}
              modifiersClassNames={{
                hasEvent: "bg-indigo-500/20 font-bold text-indigo-600 dark:text-indigo-400 relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-indigo-500 after:rounded-full",
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 xl:col-span-8 border-2 border-border/80 shadow-2xl bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden neon-stroke flex flex-col relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
          
          <CardHeader className="border-b border-border/50 bg-card/80 backdrop-blur-md pb-6 pt-8 px-8 z-10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Events for {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a date"}
              </CardTitle>
              <CardDescription className="text-base mt-2">Manage events for the selected day</CardDescription>
            </div>
            
            <Badge variant="outline" className="text-base py-1 px-4 border-indigo-500/30 text-indigo-500 bg-indigo-500/10">
              {selectedEvents.length} Event(s)
            </Badge>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
            {/* Add Event Form */}
            <form onSubmit={handleAddEvent} className="flex flex-col md:flex-row gap-4 mb-8 bg-background/40 p-6 rounded-2xl border border-border/50 shadow-inner">
              <div className="flex-1 relative">
                <Type className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Event title..." 
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="pl-10 h-12 text-lg bg-background/60 shadow-inner"
                  required
                />
              </div>
              <div className="w-full md:w-40 relative">
                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="time" 
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="pl-10 h-12 text-lg bg-background/60 shadow-inner"
                  required
                />
              </div>
              <div className="flex bg-background/60 rounded-xl p-1 shadow-inner h-12 border border-border/50 w-full md:w-auto">
                <button type="button" onClick={() => setNewEventType("task")} className={`flex-1 md:px-6 rounded-lg font-bold text-sm transition-all ${newEventType === 'task' ? 'bg-indigo-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Task</button>
                <button type="button" onClick={() => setNewEventType("exam")} className={`flex-1 md:px-6 rounded-lg font-bold text-sm transition-all ${newEventType === 'exam' ? 'bg-rose-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Exam</button>
              </div>
              <Button type="submit" disabled={!date} className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 text-base font-bold w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" /> Add Event
              </Button>
            </form>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <AnimatePresence>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  </div>
                ) : selectedEvents.length > 0 ? (
                  selectedEvents.map((event, index) => (
                    <motion.div 
                      key={`${event.title}-${event.time}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-6 border-l-4 rounded-xl bg-card border shadow-md hover:shadow-lg transition-all group"
                      style={{ borderLeftColor: event.type === 'exam' ? '#f43f5e' : '#6366f1' }}
                    >
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-xl">{event.title}</h4>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <Badge variant={event.type === "exam" ? "destructive" : "default"} className={`px-4 py-1.5 text-sm uppercase tracking-wide border-0 shadow-sm ${event.type === "task" ? "bg-indigo-500 hover:bg-indigo-600" : ""}`}>
                        {event.type}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-background/20 rounded-2xl border border-dashed border-border/50"
                  >
                    <CalendarIcon className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-xl font-medium text-center">No events scheduled for this day.</p>
                    <p className="text-base mt-2 flex items-center gap-2">
                      Enjoy your free time! 
                      <span role="img" aria-label="party" className="text-2xl">🎉</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
