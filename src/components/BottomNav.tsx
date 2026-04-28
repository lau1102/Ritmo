import { CheckSquare, Timer, Calendar, User, Settings } from 'lucide-react';
import { ViewState } from '../types';
import { cn } from '../lib/utils';

interface BottomNavProps {
  view: ViewState;
  setView: (v: ViewState) => void;
}

export function BottomNav({ view, setView }: BottomNavProps) {
  if (!['HOME', 'TIMER', 'STATS', 'PROFILE'].includes(view)) return null;

  const navItems = [
    { id: 'HOME', icon: CheckSquare, label: 'TAREAS' },
    { id: 'TIMER', icon: Timer, label: 'TIEMPO' },
    { id: 'STATS', icon: Calendar, label: 'SEMANA' },
    { id: 'PROFILE', icon: User, label: 'PERFIL' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[100] flex justify-around items-center px-2 pt-3 pb-8 bg-surface-container-lowest/90 backdrop-blur-lg rounded-t-[32px] shadow-[0_-8px_30px_rgba(83,81,162,0.08)]">
      {navItems.map((item) => {
        const isActive = view === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 active:scale-95",
              isActive ? "text-primary" : "text-outline hover:text-primary/70"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}>
              <Icon className={cn("w-6 h-6", isActive ? "fill-primary/20" : "")} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
