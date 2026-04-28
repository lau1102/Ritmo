import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Medal, Plus, CheckCircle2, Circle, Trash2, Heart } from 'lucide-react';
import { ViewState, Task } from '../types';
import { mascotas } from '../data/mascots';
import { UserProfile } from '../App';

interface HomeViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  selectedMascotId: string;
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  habits: { id: string, name: string, completed: boolean }[];
  toggleHabit: (id: string) => void;
  profile: UserProfile | null;
}

export function HomeView({ setView, selectedMascotId, tasks, addTask, toggleTask, deleteTask, habits, toggleHabit, profile }: HomeViewProps) {
  const currentMascot = mascotas.find(m => m.id === selectedMascotId) || mascotas[0];
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen pb-40"
    >
      <header className="sticky top-0 w-full z-40 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md border-b border-primary/5">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('PROFILE')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 active:scale-95 transition-transform">
            <img src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCUnS9FEY6U0wZOcIdh5XRMuR_OwCWsfCUyVHFja2-JhtFROwjEoRDqVI7MFMdUo47xHlSwrhKIDol4dqOFq_SZqn7aIe7MmvhX8NXShP3HU-BRlSFoTENF4vSn7-D0F9pI7ONSlePFVU-9QsXe6J2P0jC74yEpjq9aPDmI0p3nV4x0iWM1QamrUNr01EkrDqN3nYGiJBfgJ2UWvzhlCNNuajZVZs9L4UIALMnJTRyPATEAutJQf0a-64wqlsPODKG36_aZpo_Vgw"} alt="Avatar" className="w-full h-full object-cover" />
          </button>
          <span className="font-semibold text-lg text-primary">Nivel 12</span>
        </div>
        <Medal className="w-6 h-6 text-primary" />
      </header>

      <div className="px-6 pt-6 space-y-8 flex-1">
        <section className="flex flex-col items-center text-center space-y-4">
          <div>
            <p className="text-secondary font-semibold text-sm">Buenos días, {profile?.nombre?.split(' ')[0] || 'Ritmo'}</p>
            <h2 className="text-[30px] leading-tight font-extrabold text-on-surface tracking-tight mt-1">¿Qué vas a lograr hoy?</h2>
          </div>
          
          <div className="relative mt-2">
            <motion.img 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              src={currentMascot.image} 
              alt={`Mascota ${currentMascot.name}`} 
              className="w-40 h-40 object-contain drop-shadow-lg" 
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-container-lowest font-bold text-primary px-4 py-1.5 rounded-full shadow-md text-xs border border-primary/5 whitespace-nowrap">
                Nivel 12 — Constante
            </div>
          </div>
        </section>

        {/* Habitos Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-outline uppercase tracking-widest">Hábitos Diarios</h3>
            <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">
              {habits.filter(h => h.completed).length}/{habits.length}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  habit.completed 
                  ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' 
                  : 'bg-surface-container-lowest text-on-surface border-transparent shadow-sm'
                }`}
              >
                <Heart className={`w-4 h-4 ${habit.completed ? 'fill-white' : ''}`} />
                <span className="font-bold text-sm whitespace-nowrap">{habit.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)]">
          <div className="flex justify-between items-end mb-3">
            <span className="font-bold text-[11px] text-primary/60 uppercase tracking-widest">XP DEL DÍA</span>
            <span className="font-bold text-xs text-primary/60">{completedTasks.length * 20} / 100</span>
          </div>
          <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((completedTasks.length * 20), 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-outline uppercase tracking-widest">Tareas</h3>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {pendingTasks.length} pendientes
            </span>
          </div>

            <div className="relative group">
            <input 
              type="text" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe una nueva tarea..."
              className="w-full bg-surface-container-lowest p-4 pr-14 rounded-[20px] shadow-[0_4px_12px_rgba(83,81,162,0.03)] border-2 border-transparent focus:border-primary/20 outline-none transition-all text-on-surface font-medium placeholder:text-outline/40"
            />
            <button 
              onClick={handleAddTask}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingTasks.map((task) => (
                <motion.div 
                  layout
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest p-4 rounded-[20px] shadow-[0_4px_12px_rgba(83,81,162,0.03)] flex items-center justify-between group active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="text-outline/30 hover:text-primary transition-colors"
                    >
                      <Circle className="w-6 h-6" />
                    </button>
                    <p className="font-semibold text-on-surface">{task.text}</p>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-outline/20 hover:text-error transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              {completedTasks.length > 0 && (
                <motion.div 
                  layout
                  className="pt-4"
                >
                  <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-3 px-1">Completadas</h4>
                  <div className="space-y-3 opacity-60">
                    {completedTasks.map((task) => (
                      <motion.div 
                        layout
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-surface-container p-4 rounded-[20px] flex items-center gap-4"
                      >
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className="text-primary"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <p className="font-medium text-outline line-through flex-1">{task.text}</p>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-outline/20 hover:text-error transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <button onClick={handleAddTask} className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform z-40 md:hidden">
        <Plus className="w-7 h-7" />
      </button>
    </motion.div>
  );
}
