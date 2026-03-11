"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Loader2, Share2, Users, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id?: string;
}

export default function Tasks() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTask, completed: false }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Make sure the "tasks" table exists in your Supabase project.');
    } else if (data) {
      setTasks([data[0], ...tasks]);
      setNewTask("");
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };
  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const shareTask = async () => {
    if (!shareEmail.trim() || !selectedTaskId) return;
    setIsSharing(true);
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // 1. Find user by email in profiles
      const { data: targetProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', shareEmail.trim())
        .single();

      if (profileError || !targetProfile) {
        throw new Error("User with this email not found.");
      }

      // 2. Add to collaborators
      const { error: collabError } = await supabase
        .from('task_collaborators')
        .insert([{ task_id: selectedTaskId, user_id: targetProfile.id }]);

      if (collabError) throw collabError;

      // 3. Notify the user
      await supabase.from('notifications').insert([{
        user_id: targetProfile.id,
        title: "New Shared Task",
        content: `${currentUser?.email} shared a task with you: "${tasks.find(t => t.id === selectedTaskId)?.title}"`,
        type: 'share'
      }]);

      alert("Task shared successfully!");
      setShareEmail("");
      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSharing(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-emerald-600">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your daily goals and assignments.</p>
        </div>
      </div>

      <motion.div 
        layout
        className="glass-card neon-stroke p-8 rounded-2xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <form onSubmit={addTask} className="flex gap-3 mb-6 relative z-10">
          <Input 
            placeholder="Add a new task..." 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 bg-background/60 focus-visible:ring-emerald-500 backdrop-blur-sm h-12 text-lg rounded-xl"
          />
          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 h-12 px-6 rounded-xl text-md font-bold">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </form>

        <motion.div layout className="space-y-2 relative z-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-center py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </motion.div>
            ) : tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center py-12 text-muted-foreground text-lg"
              >
                No tasks yet. Enjoy your day!
              </motion.div>
            ) : (
              tasks.map(task => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.01 }}
                  key={task.id} 
                  className={`group flex items-center justify-between p-5 rounded-xl border shadow-sm transition-all neon-stroke ${
                    task.completed ? 'bg-accent/50 border-border opacity-60' : 'bg-background/80 border-border hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id, task.completed)} 
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-5 w-5 rounded-full"
                    />
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`text-lg font-medium leading-none cursor-pointer select-none transition-all ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dialog open={isDialogOpen && selectedTaskId === task.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedTaskId(task.id);
                    }}>
                      <DialogTrigger 
                        render={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-opacity"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10 neon-stroke rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Collaborate</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Share this task with a study partner via email.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2 py-4">
                          <div className="grid flex-1 gap-2">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <Input
                              id="email"
                              placeholder="partner@example.com"
                              value={shareEmail}
                              onChange={(e) => setShareEmail(e.target.value)}
                              className="bg-background/50 border-white/10 h-10 rounded-xl"
                            />
                          </div>
                          <Button 
                            disabled={isSharing}
                            onClick={shareTask}
                            className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 rounded-xl px-6"
                          >
                            {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
