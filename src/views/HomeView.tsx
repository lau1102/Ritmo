import { useState, KeyboardEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Medal, Plus, CheckCircle2, Circle, Trash2, Heart } from 'lucide-react';
import { ViewState, Task } from '../types';
import { mascotas } from '../data/mascots';
import { UserProfile } from '../App';
import { Avatar } from '../components/Avatar';
import { CORAZON_1, CORAZON_2 } from '../assets/iconos';

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
  addHabit: (name: string) => void;
  updateHabit: (id: string, name: string) => void;
  deleteHabit: (id: string) => void;
  profile: UserProfile | null;
}

interface HabitItemProps {
  key?: string;
  habit: { id: string, name: string, completed: boolean };
  toggleHabit: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function HabitItem({ habit, toggleHabit, onEdit, onDelete }: HabitItemProps) {
  return (
    <div className="flex-shrink-0 flex flex-col gap-2 group">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleHabit(habit.id)}
        className={`flex items-center gap-3 px-6 py-4 rounded-[28px] border-2 transition-all shadow-sm ${
          habit.completed 
          ? 'bg-primary/10 border-primary/40 shadow-primary/5' 
          : 'bg-white text-on-surface border-primary/5 hover:border-primary/20'
        }`}
      >
        <motion.div
           animate={habit.completed ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
           transition={{ duration: 0.5, ease: "easeInOut" }}
           className="relative flex items-center justify-center w-6 h-6"
        >
             {habit.completed ? (
               <img src={CORAZON_2} alt="Habit Icon" className="w-full h-full object-contain" />
             ) : (
               <img src={CORAZON_1} alt="Habit Icon" className="w-full h-full object-contain opacity-40" />
             )}
        </motion.div>
        <span className={`font-bold text-sm whitespace-nowrap transition-colors ${habit.completed ? 'text-primary font-black' : 'text-on-surface'}`}>
          {habit.name}
        </span>
      </motion.button>
      
      <div className="flex justify-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 px-3 rounded-full bg-primary/5 text-[10px] font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            Editar
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 px-3 rounded-full bg-error/5 text-[10px] font-bold text-error hover:bg-error/10 transition-colors"
          >
            Borrar
          </button>
      </div>
    </div>
  );
}

export function HomeView({ 
  setView, 
  selectedMascotId, 
  tasks, 
  addTask, 
  toggleTask, 
  deleteTask, 
  habits, 
  toggleHabit,
  addHabit,
  updateHabit,
  deleteHabit,
  profile 
}: HomeViewProps) {
  const currentMascot = mascotas.find(m => m.id === selectedMascotId) || mascotas[0];
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName('');
      setIsAddingHabit(false);
    }
  };

  const handleUpdateHabit = () => {
    if (editingHabitId && editName.trim()) {
      updateHabit(editingHabitId, editName.trim());
      setEditingHabitId(null);
      setEditName('');
    }
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    } else {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
          <button onClick={() => setView('PROFILE')} className="group flex items-center justify-center active:scale-95 transition-transform">
            <Avatar 
              src={profile?.avatar} 
              name={profile?.nombre}
              className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
            />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-on-surface leading-tight">{profile?.nombre || 'Mi Ritmo'}</span>
            <span className="font-medium text-[10px] text-outline uppercase tracking-tighter">Nivel {profile?.nivel || 1}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-primary/10 px-2 py-1 rounded-lg flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-primary" />
                <span className="text-primary font-bold text-xs">{profile?.experiencia || 0} XP</span>
            </div>
        </div>
      </header>

      <div className="px-6 pt-6 space-y-8 flex-1">
        <section className="flex flex-col items-center text-center space-y-4">
          <div>
            <p className="text-secondary font-semibold text-sm">Buenos días, {profile?.nombre?.split(' ')[0] || profile?.email?.split('@')[0] || 'Usuario'}</p>
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
                Nivel {profile?.nivel || 1} — {profile && profile.experiencia >= (profile.nivel * 50) * 0.8 ? 'Casi por subir' : 'Constante'}
            </div>
          </div>
        </section>

        {/* Habitos Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-outline uppercase tracking-widest">Hábitos Diarios</h3>
            <div className="flex items-center gap-2">
                 <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                   {habits.filter(h => h.completed).length} / {habits.length || 3} completados
                 </span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide items-start">
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <HabitItem 
                  key={habit.id} 
                  habit={habit} 
                  toggleHabit={toggleHabit} 
                  onEdit={() => {
                    setEditingHabitId(habit.id);
                    setEditName(habit.name);
                  }}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))}
            </AnimatePresence>
            
            {!isAddingHabit ? (
                <button 
                  onClick={() => setIsAddingHabit(true)}
                  className="flex-shrink-0 w-14 h-[60px] rounded-[28px] border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/40 transition-colors bg-surface/50"
                >
                  <Plus className="w-6 h-6" />
                </button>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-shrink-0 bg-white p-3 rounded-[28px] border-2 border-primary/20 shadow-sm flex flex-col gap-2 w-48"
                >
                    <input 
                      autoFocus
                      type="text" 
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="Nombre..."
                      className="bg-surface-container p-2.5 rounded-2xl text-xs font-bold outline-none border border-primary/5 focus:border-primary/20"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAddHabit} className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">Guardar</button>
                        <button onClick={() => setIsAddingHabit(false)} className="flex-1 bg-surface-container py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">Cancel</button>
                    </div>
                </motion.div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {editingHabitId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-surface/80 backdrop-blur-sm"
              onClick={() => setEditingHabitId(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-xs bg-white p-6 rounded-[32px] shadow-xl border border-primary/5"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="font-bold text-lg text-on-surface mb-4">Editar Hábito</h4>
                <input 
                  autoFocus
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container p-4 rounded-2xl font-bold text-on-surface outline-none border border-primary/5 mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={handleUpdateHabit} className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold">Guardar</button>
                  <button onClick={() => setEditingHabitId(null)} className="flex-1 bg-surface-container py-3 rounded-2xl font-bold">Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)]">
          <div className="flex justify-between items-end mb-3">
            <span className="font-bold text-[11px] text-primary/60 uppercase tracking-widest">PROGRESO NIVEL {profile?.nivel || 1}</span>
            <span className="font-bold text-xs text-primary/60">{profile?.experiencia || 0} / {(profile?.nivel || 1) * 50} XP</span>
          </div>
          <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((profile?.experiencia || 0) / ((profile?.nivel || 1) * 50)) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-outline uppercase tracking-widest">Tareas</h3>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              {pendingTasks.length} {pendingTasks.length === 1 ? 'pendiente' : 'pendientes'}
            </span>
          </div>

          <div className="relative group mb-4">
            <input 
              ref={inputRef}
              type="text" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nueva tarea..."
              className="w-full bg-surface-container-lowest p-5 pr-14 rounded-[24px] shadow-sm border-2 border-primary/5 focus:border-primary/20 outline-none transition-all text-on-surface font-semibold placeholder:text-outline/30"
            />
            <button 
              onClick={handleAddTask}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-primary text-white rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingTasks.length === 0 && completedTasks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center opacity-30"
                >
                  <div className="w-16 h-16 bg-outline/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8 text-outline" />
                  </div>
                  <p className="font-bold text-sm text-outline">¡Todo listo por ahora!</p>
                  <p className="text-xs text-outline mt-1 font-medium">Agrega una tarea para empezar</p>
                </motion.div>
              )}

              {pendingTasks.map((task) => (
                <motion.div 
                  layout
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-surface-container-lowest p-4 rounded-[20px] shadow-[0_4px_12px_rgba(83,81,162,0.03)] flex items-center justify-between group active:scale-[0.99] transition-transform border border-transparent hover:border-primary/5"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-primary/30 flex items-center justify-center transition-all bg-white shadow-sm active:scale-90 hover:border-primary cursor-pointer z-10"
                    >
                      <div className="w-3.5 h-3.5 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors" />
                    </button>
                    <p className="font-bold text-on-surface text-base tracking-tight truncate">{task.text}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-outline/20 hover:text-error transition-colors p-3 active:scale-90 cursor-pointer z-10"
                  >
                    <Trash2 className="w-5 h-5" />
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-transform cursor-pointer z-10 shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <p className="font-bold text-outline line-through flex-1 truncate">{task.text}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className="text-outline/10 hover:text-error transition-colors p-3 active:scale-90 cursor-pointer z-10"
                        >
                          <Trash2 className="w-5 h-5" />
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
