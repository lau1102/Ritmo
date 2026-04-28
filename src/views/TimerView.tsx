import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, TrendingUp, Flame, Lock, Target, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ViewState, Task } from '../types';
import { UserProfile } from '../App';

interface TimerViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  tasks: Task[];
  toggleTask: (id: string) => void;
  profile: UserProfile | null;
}

export function TimerView({ setView, tasks, toggleTask, profile }: TimerViewProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const pendingTasks = tasks.filter(t => !t.completed);

  // Default to first pending task if none selected and not active
  useEffect(() => {
    if (!activeTaskId && pendingTasks.length > 0) {
      setActiveTaskId(pendingTasks[0].id);
    }
  }, [pendingTasks, activeTaskId]);

  // Mock timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      setTimeLeft(25 * 60); // 25 mins
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen pb-32"
    >
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md border-b border-primary/5">
         <div className="flex items-center gap-3">
          <button onClick={() => setView('PROFILE')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 active:scale-95 transition-transform">
             <img src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBvp1ffCwW-nzy23N6M-C-3RZDONszscXG_F9SEdU7O1SDM7ypyMpZoJIUtmG2fL6vewmgZ-Lhgw0FIvwXLutoarNtHyzq4Vyob7t36bcsNmpQotZuF6-OXvxTLum5IZBefFuvydXpFAXLARXgF6G71a0y_jAZUWcDjyrGyRglBb9thJhRpHgil_MGjAfI07-Mlif-TwyCQ4B_pgEtpga1AlQls54qAgnNsbKv8bhwFgS7uo5bu88V1FcUFwNm8RbDnss7kyMuuDg"} alt="Avatar" className="w-full h-full object-cover" />
          </button>
          <span className="font-extrabold text-lg text-primary tracking-tight">TaskFlow</span>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-primary font-semibold text-sm">Lvl {profile?.nivel || 1}</span>
        </div>
      </header>

      <main className="px-6 pt-24 space-y-8 max-w-md mx-auto w-full">
        {/* Active Task Selector */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-xs text-secondary tracking-widest uppercase">ENFOCADO EN</h2>
            <button 
              onClick={() => setShowTaskSelector(!showTaskSelector)}
              className="text-primary text-sm font-bold flex items-center gap-1"
            >
              Cambiar <ChevronRight className={`w-4 h-4 transition-transform ${showTaskSelector ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              {!showTaskSelector ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-primary/5 border border-primary/10 p-4 rounded-[24px] flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-on-surface truncate">
                      {activeTask?.text || (pendingTasks.length > 0 ? "Selecciona una tarea" : "Sin tareas pendientes")}
                    </h3>
                    <p className="text-secondary text-xs font-medium">Bloque actual</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest border border-primary/10 p-2 rounded-[24px] shadow-lg space-y-1 max-h-[300px] overflow-y-auto scrollbar-hide"
                >
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTaskId(t.id);
                          setShowTaskSelector(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${
                          activeTaskId === t.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeTaskId === t.id ? 'bg-primary' : 'bg-outline/20'}`} />
                        <span className="font-semibold text-sm truncate">{t.text}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-secondary text-sm font-medium">
                      No hay tareas pendientes. <br /> ¡Agrega una en el inicio!
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-7xl font-extrabold text-on-surface tracking-tighter tabular-nums leading-none">
                {formatTime(timeLeft)}
            </h1>
            <p className="font-medium text-secondary opacity-70">
                {isActive ? 'Enfocado' : 'Sin actividad — toca iniciar'}
            </p>
          </div>
          
          <div className="flex gap-4 w-full">
            <button 
                onClick={toggleTimer}
                className="flex-1 bg-primary text-white py-5 rounded-[24px] font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isActive ? (
                   // Adding a pause icon could be here, reusing play for simplicity mapping to design
                   <><Play className="w-5 h-5 fill-white" /> Pausar</>
              ) : (
                  <><Play className="w-5 h-5 fill-white" /> Iniciar</>
              )}
            </button>
            <button 
                onClick={resetTimer}
                className="flex-1 bg-surface-container-lowest border border-primary/10 text-primary py-5 rounded-[24px] font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] flex flex-col justify-between h-32 bg-gradient-to-br from-white to-indigo-50/50 border border-primary/5">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <p className="text-secondary text-sm font-medium">Productividad</p>
              <p className="text-xl font-bold text-on-surface">+12%</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] flex flex-col justify-between h-32 bg-gradient-to-br from-white to-orange-50/50 border border-orange-500/5">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            <div>
              <p className="text-secondary text-sm font-medium">Racha</p>
              <p className="text-xl font-bold text-on-surface">5 días</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-xs text-secondary tracking-widest uppercase">Actividad Reciente</h2>
            <button className="text-primary text-sm font-bold" onClick={() => setView('STATS')}>Estadísticas</button>
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.completed).slice(0, 3).map((task) => (
              <div key={task.id} className="bg-surface-container-lowest rounded-[20px] flex items-stretch overflow-hidden group hover:scale-[1.01] transition-transform shadow-[0_4px_12px_rgba(83,81,162,0.03)] border flex-1 justify-between border-primary/5">
                <div className="w-2 bg-primary"></div>
                <div className="p-4 flex flex-1 justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex flex-1 overflow-hidden">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" />
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-on-surface text-base truncate">{task.text}</h3>
                          <p className="text-secondary text-xs font-medium opacity-70">Tarea completada</p>
                        </div>
                    </div>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.completed).length === 0 && (
              <div className="bg-surface-container-lowest rounded-[24px] p-8 text-center border-2 border-dashed border-primary/10">
                <p className="text-secondary text-sm font-medium">No has completado tareas hoy.<br/>¡Enfócate y logra tus metas!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
