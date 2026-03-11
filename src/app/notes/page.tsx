"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Bookmark, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Note {
  id: number;
  title: string;
  content: string;
  user_id?: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const addNote = async () => {
    if (!newTitle.trim()) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{ title: newTitle, content: newContent }])
      .select();

    if (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Make sure the "notes" table exists in your Supabase project.');
    } else if (data) {
      setNotes([data[0], ...notes]);
      setNewTitle("");
      setNewContent("");
    }
  };

  const deleteNote = async (id: number) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] w-full mx-auto h-full flex flex-col pb-2 min-h-[600px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Notes</h1>
          <p className="text-muted-foreground mt-1 text-lg">Capture quick thoughts and study material in your premium workspace.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        {/* Editor Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 bg-card/60 backdrop-blur-xl p-6 rounded-2xl border-2 border-border/80 shadow-xl neon-stroke h-full relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none" />
          <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold">
            <Edit3 className="w-5 h-5" />
            <span>Create Note</span>
          </div>
          <Input 
            placeholder="Note Title" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="font-bold text-lg h-12 bg-background/50 border-border/50 focus-visible:ring-indigo-500 rounded-xl shadow-inner"
          />
          <textarea 
            placeholder="Type your notes here..." 
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="flex-1 w-full p-4 resize-none outline-none border-2 border-border/50 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-full bg-background/50 shadow-inner text-base"
          />
          <Button onClick={addNote} className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 text-base font-bold transition-transform hover:scale-105 mt-2 rounded-xl">
            <Plus className="mr-2 h-5 w-5" /> Save Note
          </Button>
        </motion.div>

        {/* Notes Grid */}
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto pr-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
          <AnimatePresence>
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-16 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </motion.div>
            ) : notes.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-16 text-center text-muted-foreground bg-card/50 rounded-2xl border-2 border-border/50 border-dashed text-lg flex flex-col items-center justify-center">
                <Bookmark className="w-12 h-12 mb-4 opacity-20" />
                No notes yet. Start writing!
              </motion.div>
            ) : (
              notes.map((note, index) => (
                <motion.div 
                  key={note.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-card/60 backdrop-blur-md rounded-2xl border-2 border-border/80 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 h-auto self-start neon-stroke overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-6">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-white hover:bg-rose-500 transition-all h-9 w-9 shadow-sm rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <h3 className="font-bold text-xl mb-3 text-foreground pr-8">{note.title}</h3>
                    <p className="text-muted-foreground/90 whitespace-pre-wrap text-base leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
