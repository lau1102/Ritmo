import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, TrendingUp, Flame, Lock, Target, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
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
  const [sessions, setSessions] = useState<{taskId: string, minutes: number, completed: boolean, timestamp: string}[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const pendingTasks = tasks.filter(t => !t.completed);

  // Default to first pending task if none selected and not active
  useEffect(() => {
    if (!activeTaskId && pendingTasks.length > 0) {
      setActiveTaskId(pendingTasks[0].id);
    }
  }, [pendingTasks, activeTaskId]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    if (activeTaskId) {
      setSessions(prev => [{
        taskId: activeTaskId,
        minutes: 25,
        completed: true,
        timestamp: new Date().toISOString()
      }, ...prev]);
    }
  };

  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      setTimeLeft(25 * 60); // 25 mins
      startTimeRef.current = 25 * 60;
    }
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    if (isActive || timeLeft > 0) {
      const elapsedSeconds = (startTimeRef.current || 25 * 60) - timeLeft;
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      
      if (elapsedMinutes > 0 && activeTaskId) {
        setSessions(prev => [{
          taskId: activeTaskId,
          minutes: elapsedMinutes,
          completed: false, // Partial session
          timestamp: new Date().toISOString()
        }, ...prev]);
      }
      
      setIsActive(false);
      setTimeLeft(0);
    }
  };

  const getCompletedSessionsForTask = (taskId: string) => {
    return sessions.filter(s => s.taskId === taskId && s.completed).length;
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
          <button onClick={() => setView('PROFILE')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 active:scale-95 transition-transform flex items-center justify-center bg-primary/5">
             {profile?.avatar ? (
               <img src={profile.avatar} alt="Avatar" className="w-full h-full object-contain" />
             ) : (
               <span className="text-primary font-bold text-xs">
                 {profile?.nombre?.split(' ').map(n => n[0]).join('') || 'U'}
               </span>
             )}
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-on-surface leading-tight">{profile?.nombre || 'Mi Ritmo'}</span>
            <span className="font-medium text-[10px] text-outline uppercase tracking-tighter">Temporizador</span>
          </div>
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-on-surface truncate">
                        {activeTask?.text || (pendingTasks.length > 0 ? "Selecciona una tarea" : "Sin tareas pendientes")}
                      </h3>
                      {activeTaskId && (
                        <span className="flex-shrink-0 bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                          {getCompletedSessionsForTask(activeTaskId)} ✓
                        </span>
                      )}
                    </div>
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
                className={`flex-1 ${isActive ? 'bg-orange-500' : 'bg-primary'} text-white py-5 rounded-[24px] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
            >
              {isActive ? (
                   <><Clock className="w-5 h-5" /> Pausar</>
              ) : (
                  <><Play className="w-5 h-5 fill-white" /> Iniciar</>
              )}
            </button>
            <button 
                onClick={stopTimer}
                className="flex-1 bg-surface-container-lowest border border-error/10 text-error py-5 rounded-[24px] font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Square className="w-5 h-5 fill-error/20" />
              Parar
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] flex flex-col justify-between h-32 bg-gradient-to-br from-white to-indigo-50/50 border border-primary/5">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <p className="text-secondary text-sm font-medium">Productividad</p>
              <p className="text-xl font-bold text-on-surface">{(profile?.tareas_completadas || 0) > 0 ? '+12%' : '0%'}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] flex flex-col justify-between h-32 bg-gradient-to-br from-white to-orange-50/50 border border-orange-500/5">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
            <div>
              <p className="text-secondary text-sm font-medium">Racha</p>
              <p className="text-xl font-bold text-on-surface">{profile?.racha || 0} {profile?.racha === 1 ? 'día' : 'días'}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-xs text-secondary tracking-widest uppercase">Actividad Reciente</h2>
            <button className="text-outline text-xs font-bold" onClick={() => setSessions([])}>Limpiar</button>
          </div>
          <div className="space-y-3">
            {sessions.map((session, idx) => {
               const task = tasks.find(t => t.id === session.taskId);
               return (
                <div key={idx} className="bg-surface-container-lowest rounded-[20px] flex items-stretch overflow-hidden group hover:scale-[1.01] transition-transform shadow-[0_4px_12px_rgba(83,81,162,0.03)] border flex-1 justify-between border-primary/5">
                    <div className={`w-2 ${session.completed ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                    <div className="p-4 flex flex-1 justify-between items-center">
                        <div className="flex flex-1 overflow-hidden">
                            {session.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mr-3 mt-0.5" />
                            ) : (
                                <Clock className="w-5 h-5 text-orange-400 shrink-0 mr-3 mt-0.5" />
                            )}
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-on-surface text-base truncate">{task?.text || 'Tarea desconocida'}</h3>
                                <p className="text-secondary text-xs font-medium opacity-70">
                                    {session.completed ? 'Sesión completa (25 min)' : `Sesión parcial (${session.minutes} min)`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
               );
            })}
            {sessions.length === 0 && (
              <div className="bg-surface-container-lowest rounded-[24px] p-8 text-center border-2 border-dashed border-primary/10">
                <p className="text-secondary text-sm font-medium">No hay actividad reciente.<br/>¡Enfócate y logra tus metas!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
