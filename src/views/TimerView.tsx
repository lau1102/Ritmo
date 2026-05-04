import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, TrendingUp, Flame, Lock, Target, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { ViewState, Task } from '../types';
import { UserProfile } from '../App';
import { Avatar } from '../components/Avatar';

interface TimerViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  tasks: Task[];
  toggleTask: (id: string) => void;
  profile: UserProfile | null;
  sessions: any[];
  addSession: (taskName: string, durationSeconds: number) => Promise<void>;
}

export function TimerView({ setView, tasks, toggleTask, profile, sessions, addSession }: TimerViewProps) {
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [timerMode, setTimerMode] = useState<'STOPWATCH' | 'POMODORO'>('STOPWATCH');
  const [pomodoroMins, setPomodoroMins] = useState(25);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const pendingTasks = tasks.filter(t => !t.completed);

  // Default task selection
  useEffect(() => {
    if (!activeTaskId && pendingTasks.length > 0) {
      setActiveTaskId(pendingTasks[0].id);
    }
  }, [pendingTasks, activeTaskId]);

  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeSeconds((prev) => {
          if (timerMode === 'POMODORO') {
            if (prev <= 1) {
              handleSessionComplete(pomodoroMins * 60);
              return 0;
            }
            return prev - 1;
          }
          return prev + 1; // STOPWATCH mode counts up
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timerMode, pomodoroMins]);

  const handleSessionComplete = (duration: number) => {
    setIsActive(false);
    if (activeTask) {
      addSession(activeTask.text, duration);
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      if (timerMode === 'POMODORO' && timeSeconds === 0) {
        setTimeSeconds(pomodoroMins * 60);
      }
      startTimeRef.current = Date.now();
    }
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    if (isActive || timeSeconds > 0) {
      const duration = timerMode === 'POMODORO' ? (pomodoroMins * 60 - timeSeconds) : timeSeconds;
      
      if (duration > 0 && activeTask) {
        addSession(activeTask.text, duration);
      }
      
      setIsActive(false);
      setTimeSeconds(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seg`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
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
          <button onClick={() => setView('PROFILE')} className="group flex items-center justify-center active:scale-95 transition-transform">
            <Avatar 
              src={profile?.avatar} 
              name={profile?.nombre}
              className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
            />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-on-surface leading-tight">{profile?.nombre || 'Mi Ritmo'}</span>
            <span className="font-medium text-[10px] text-outline uppercase tracking-tighter">Enfoque</span>
          </div>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-primary font-semibold text-sm">Lvl {profile?.nivel || 1}</span>
        </div>
      </header>

      <main className="px-6 pt-24 space-y-8 max-w-md mx-auto w-full">
        {/* Mode Selector */}
        <section className="flex bg-surface-container rounded-2xl p-1 shadow-inner">
          <button 
            onClick={() => {
              if (isActive) return;
              setTimerMode('STOPWATCH');
              setTimeSeconds(0);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${timerMode === 'STOPWATCH' ? 'bg-white shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
          >
            Libre (Toggl)
          </button>
          <button 
            onClick={() => {
              if (isActive) return;
              setTimerMode('POMODORO');
              setTimeSeconds(pomodoroMins * 60);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${timerMode === 'POMODORO' ? 'bg-white shadow-sm text-primary' : 'text-outline hover:text-on-surface'}`}
          >
            Pomodoro
          </button>
        </section>

        {timerMode === 'POMODORO' && (
          <section className="flex justify-center gap-2">
            {[15, 25, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => {
                  if (isActive) return;
                  setPomodoroMins(m);
                  setTimeSeconds(m * 60);
                }}
                className={`w-12 h-10 rounded-xl text-xs font-bold transition-all border ${pomodoroMins === m ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-outline hover:bg-surface-container'}`}
              >
                {m}m
              </button>
            ))}
          </section>
        )}

        {/* Active Task Selector */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-xs text-secondary tracking-widest uppercase">TRABAJANDO EN</h2>
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
                    </div>
                    <p className="text-secondary text-xs font-medium">Proyecto actual</p>
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
                          if (!isActive && timerMode === 'POMODORO') setTimeSeconds(pomodoroMins * 60);
                          else if (!isActive) setTimeSeconds(0);
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
            <h1 className={`text-7xl font-extrabold tracking-tighter tabular-nums leading-none ${isActive ? 'text-primary' : 'text-on-surface opacity-90'}`}>
                {formatTime(timeSeconds)}
            </h1>
            <p className="font-medium text-secondary text-sm">
                {isActive ? (timerMode === 'STOPWATCH' ? 'Contando tiempo...' : 'Tiempo restante') : 'Listo para empezar'}
            </p>
          </div>
          
          <div className="flex gap-4 w-full">
            <button 
                onClick={toggleTimer}
                disabled={!activeTaskId}
                className={`flex-1 ${isActive ? 'bg-orange-500' : 'bg-primary'} text-white py-5 rounded-[24px] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100`}
            >
              {isActive ? (
                   <><Clock className="w-5 h-5" /> Pausar</>
              ) : (
                  <><Play className="w-5 h-5 fill-white" /> {timeSeconds > 0 ? 'Continuar' : 'Iniciar'}</>
              )}
            </button>
            <button 
                onClick={stopTimer}
                disabled={timeSeconds === 0}
                className="flex-1 bg-surface-container-lowest border border-error/10 text-error py-5 rounded-[24px] font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
            >
              <Square className="w-5 h-5 fill-error/20" />
              Parar
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-xs text-secondary tracking-widest uppercase">Historial de Sesiones</h2>
            <span className="text-outline text-[10px] font-bold uppercase tracking-widest">{sessions.length} registros</span>
          </div>
          <div className="space-y-3 pb-8">
            {sessions.map((session, idx) => {
               const startTime = new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
               const date = new Date(session.created_at).toLocaleDateString();
               return (
                <div key={session.id || idx} className="bg-surface-container-lowest rounded-[20px] p-4 flex items-center justify-between shadow-[0_4px_12px_rgba(83,81,162,0.03)] border border-primary/5 group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-on-surface text-sm truncate">{session.tarea_nombre || 'Sin tarea'}</h3>
                            <div className="flex items-center gap-2 text-outline text-[11px] font-medium">
                                <span>{date}</span>
                                <span>•</span>
                                <span>{startTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-bold text-primary text-sm">{formatDuration(session.duracion_segundos)}</p>
                        <p className="text-[10px] text-outline font-bold uppercase tracking-widest">DURACIÓN</p>
                    </div>
                </div>
               );
            })}
            {sessions.length === 0 && (
              <div className="bg-surface-container-lowest rounded-[24px] p-8 text-center border-2 border-dashed border-primary/10">
                <p className="text-secondary text-sm font-medium">No hay sesiones aún.<br/>¡Empieza a registrar tu tiempo!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
