import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Check, X, Trophy, Clock, Target, Rocket, Coffee, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { ViewState, Task } from '../types';
import { UserProfile } from '../App';
import { Avatar } from '../components/Avatar';

function MorningTab({ profile, tasks, sessions, weeklyHistory }: { 
  profile: UserProfile | null, 
  tasks: Task[], 
  sessions: any[], 
  weeklyHistory: any[],
  key?: string
}) {
  const today = new Date().toISOString().split('T')[0];
  const pendingToday = tasks.filter(t => t.fecha === today && !t.completed);
  
  // Weekly check-in logic
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const now = new Date();
  const d = now.getDay();
  const mondayDiff = d === 0 ? -6 : 1 - d;
  
  const weeklyCheckins = days.map((day, index) => {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() + mondayDiff + index);
    const dateStr = dayDate.toISOString().split('T')[0];
    
    // Check if there's any record in sessions or weeklyHistory for this date
    const hasSession = sessions.some(s => s.fecha === dateStr);
    const hasHabit = weeklyHistory.some(h => h.fecha === dateStr);
    const isFuture = dayDate > now && dateStr !== today;
    
    return {
      day,
      checked: hasSession || hasHabit,
      isToday: dateStr === today,
      isFuture
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <header className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
          <Sun className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-on-surface tracking-tight">Tu Mañana</h2>
          <p className="text-secondary text-xs font-bold uppercase tracking-widest opacity-60">Planificación y hábitos</p>
        </div>
      </header>
      
      {/* Racha Semanal */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">Check-in Semanal</h3>
        <div className="flex justify-between items-center px-1">
          {weeklyCheckins.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className={`text-[11px] font-bold ${item.isToday ? 'text-primary' : 'text-outline/40'}`}>{item.day}</span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                item.checked 
                ? 'bg-green-500 text-white shadow-sm' 
                : item.isFuture
                  ? 'bg-surface-container border border-outline/10 text-outline/20'
                  : 'bg-red-50 text-red-300 border border-red-100'
              }`}>
                {item.checked ? <Check className="w-5 h-5 stroke-[3]" /> : (item.isFuture ? <div className="w-1.5 h-1.5 rounded-full bg-outline/20" /> : <X className="w-5 h-5 stroke-[3]" />)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-secondary font-medium text-xs mt-5 text-center px-4">
          {weeklyCheckins.filter(c => c.checked).length >= 5 ? '¡Increíble constancia esta semana! 🔥' : 'Registra tus hábitos para completar el círculo.'}
        </p>
      </section>

      {/* Tareas Pendientes Hoy */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest">Tareas para hoy</h3>
          <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{pendingToday.length} restantes</span>
        </div>
        
        <div className="grid gap-3">
          {pendingToday.map((task) => (
            <div key={task.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-primary/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              <span className="font-bold text-sm text-on-surface truncate">{task.text}</span>
            </div>
          ))}

          {pendingToday.length === 0 && (
            <div className="bg-surface-container-lowest rounded-[24px] p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline/10">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-outline">¡Todo despejado!</p>
              <p className="text-[10px] text-outline/60 mt-1">No tienes tareas pendientes para hoy.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

function HabitsTab({ profile, habits, toggleHabit, weeklyHistory }: { profile: UserProfile | null, habits: { id: string, name: string, completed: boolean }[], toggleHabit: (id: string) => void, weeklyHistory?: any[], key?: string }) {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const today = new Date().getDay(); // 0-6 (Dom-Sab)
  const todayIndex = today === 0 ? 6 : today - 1; // Ajuste a L=0...D=6

  // Procesar historial semanal
  const weeklyData = days.map((day, index) => {
    const now = new Date();
    const d = now.getDay();
    const diff = now.getDate() - d + (d === 0 ? -6 : 1) + index;
    const dateStr = new Date(now.setDate(diff)).toISOString().split('T')[0];

    const habitsData = weeklyHistory?.filter(h => h.fecha === dateStr) || [];
    const total = habitsData.length;
    const completed = habitsData.filter(h => h.completado).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { day, percentage, isToday: index === todayIndex, hasData: total > 0 };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <header className="mb-2">
        <h2 className="text-[24px] font-extrabold text-on-surface tracking-tight">Tus hábitos</h2>
      </header>
      
      {/* Gráfica Semanal */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-6">Tu semana</h3>
        <div className="flex items-end justify-between h-32 gap-2 mb-4 px-1">
          {weeklyData.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full bg-surface-container h-24 rounded-full relative overflow-hidden group">
                <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${data.percentage}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className={`absolute bottom-0 w-full rounded-full ${data.isToday ? 'bg-primary' : data.hasData ? 'bg-primary/40' : 'bg-outline/20'}`}
                />
              </div>
              <span className={`text-[10px] font-bold ${data.isToday ? 'text-primary' : 'text-outline'}`}>{data.day}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] font-bold text-outline/50">Progreso según hábitos completados</p>
      </section>

      {/* Habito por Habito */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-bold text-outline uppercase tracking-widest px-2 pt-2">Hoy</h4>
        <div className="grid gap-3">
            {habits.map((habit) => (
                <motion.button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        habit.completed 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-white border-primary/5'
                    }`}
                >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        habit.completed ? 'bg-primary text-white' : 'bg-primary/10 text-primary/40'
                    }`}>
                        <Check className="w-4 h-4" />
                    </div>
                    <span className={`font-bold text-sm ${habit.completed ? 'text-primary' : 'text-on-surface'}`}>{habit.name}</span>
                </motion.button>
            ))}
        </div>
      </section>
    </motion.div>
  )
}

function NightTab({ tasks, sessions }: { tasks: Task[], sessions: any[], key?: string }) {
  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(t => t.fecha === today && t.completed);
  const allToday = tasks.filter(t => t.fecha === today);
  
  const totalSecondsToday = sessions
    .filter(s => s.fecha === today)
    .reduce((acc, curr) => acc + (curr.duracion_segundos || 0), 0);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const score = allToday.length > 0 ? (completedToday.length / allToday.length) * 100 : 0;
  
  const getMotivation = (s: number) => {
    if (allToday.length === 0) return "¡Agrega tareas para mañana! 💜";
    if (s === 0) return "Mañana es una nueva oportunidad 💜";
    if (s <= 50) return "¡Buen comienzo, sigue así!";
    if (s < 100) return "¡Casi lo logras, eres increíble!";
    return "¡Día perfecto! 🎉";
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
    >
      <header className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-500">
          <Moon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-on-surface tracking-tight">Tu Noche</h2>
          <p className="text-secondary text-xs font-bold uppercase tracking-widest opacity-60">Resumen y descanso</p>
        </div>
      </header>

      {/* Score Card */}
      <section className="bg-primary p-6 rounded-[28px] text-white shadow-lg shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">Score del día</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-black tracking-tighter">{Math.round(score)}%</span>
            <span className="text-white/60 font-bold mb-1.5">{completedToday.length}/{allToday.length} tareas</span>
          </div>
          <p className="font-bold text-lg leading-snug">{getMotivation(score)}</p>
        </div>
        <Rocket className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 -rotate-12" />
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-[24px] border border-primary/5 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[22px] font-black text-on-surface leading-none mb-1">{formatTime(totalSecondsToday)}</p>
          <p className="text-[10px] font-bold text-outline tracking-wider uppercase">Tiempo enfocado</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[24px] border border-primary/5 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[22px] font-black text-on-surface leading-none mb-1">{completedToday.length}</p>
          <p className="text-[10px] font-bold text-outline tracking-wider uppercase">Completadas</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest px-2">Logros de hoy</h3>
        <div className="space-y-2">
          {completedToday.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-4 bg-green-50/30 rounded-2xl border border-green-100">
              <div className="bg-green-500 rounded-full p-0.5">
                <Check className="w-3 h-3 text-white stroke-[4]" />
              </div>
              <span className="text-on-surface font-bold text-sm truncate">{t.text}</span>
            </div>
          ))}
          {completedToday.length === 0 && (
            <div className="text-center py-6 opacity-40">
              <Coffee className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-bold">Sin tareas completadas hoy</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

export function StatsView({ setView, profile, habits, toggleHabit, weeklyHistory, tasks = [], sessions = [] }: { 
  key?: string, 
  setView: (v: ViewState) => void, 
  profile: UserProfile | null, 
  habits: { id: string, name: string, completed: boolean }[], 
  toggleHabit: (id: string) => void, 
  weeklyHistory?: any[],
  tasks?: Task[],
  sessions?: any[]
}) {
  const [activeTab, setActiveTab] = useState<'MORNING' | 'HABITS' | 'NIGHT'>('MORNING');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen pb-32"
    >
      <header className="bg-surface/90 backdrop-blur-md border-b border-primary/5 fixed top-0 w-full z-50 flex flex-col px-5 pt-4 pb-4 max-w-md mx-auto left-1/2 -translate-x-1/2">
         <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
             <Avatar 
               src={profile?.avatar} 
               name={profile?.nombre}
               className="w-10 h-10 border-2 border-primary/20"
             />
             <h1 className="font-extrabold text-xl text-primary tracking-tight">Rutinas</h1>
          </div>
          <button onClick={() => setView('SETTINGS')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-secondary">
             <Settings className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex justify-between items-center p-1 bg-surface-container rounded-[20px]">
          <button onClick={() => setActiveTab('MORNING')} className={`flex-1 py-3 px-2 rounded-[16px] text-center text-sm transition-all active:scale-95 ${activeTab === 'MORNING' ? 'font-bold bg-surface-container-lowest text-primary shadow-sm' : 'font-medium text-secondary hover:text-primary'}`}>Mañana</button>
          <button onClick={() => setActiveTab('HABITS')} className={`flex-1 py-3 px-2 rounded-[16px] text-center text-sm transition-all active:scale-95 ${activeTab === 'HABITS' ? 'font-bold bg-surface-container-lowest text-primary shadow-sm' : 'font-medium text-secondary hover:text-primary'}`}>Hábitos</button>
          <button onClick={() => setActiveTab('NIGHT')} className={`flex-1 py-3 px-2 rounded-[16px] text-center text-sm transition-all active:scale-95 ${activeTab === 'NIGHT' ? 'font-bold bg-surface-container-lowest text-primary shadow-sm' : 'font-medium text-secondary hover:text-primary'}`}>Noche</button>
        </nav>
      </header>

      <main className="pt-40 px-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
           {activeTab === 'MORNING' && <MorningTab key="morning" profile={profile} tasks={tasks} sessions={sessions} weeklyHistory={weeklyHistory || []} />}
           {activeTab === 'HABITS' && <HabitsTab key="habits" profile={profile} habits={habits} toggleHabit={toggleHabit} weeklyHistory={weeklyHistory} />}
           {activeTab === 'NIGHT' && <NightTab key="night" tasks={tasks} sessions={sessions} />}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
