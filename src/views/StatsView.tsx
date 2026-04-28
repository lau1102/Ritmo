import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Check, X, Trophy, Droplet, BookOpen, Dumbbell, Clock } from 'lucide-react';
import { ViewState } from '../types';
import { UserProfile } from '../App';

function MorningTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <header className="mb-2">
        <h2 className="text-[24px] font-extrabold text-on-surface tracking-tight">Tus mañanas</h2>
      </header>
      
      {/* Check-ins Realizados */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">Check-ins Realizados</h3>
        <div className="flex justify-between items-center mb-6 px-1">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => {
            const isChecked = false; // Reset to zero
            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-outline">{day}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isChecked ? 'bg-primary text-white' : 'bg-primary/5 text-outline-variant'}`}>
                  {isChecked ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-secondary font-medium text-sm">Empieza a planear tu día mañana</p>
        <div className="mt-4 w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1 }} className="bg-primary h-full rounded-full" />
        </div>
      </section>

      {/* Prioridades */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">Prioridades más repetidas</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center bg-surface-container-low rounded-xl border-2 border-dashed border-outline/10">
          <p className="text-sm font-bold text-outline">Sin datos aún</p>
          <p className="text-[10px] text-outline/60 mt-1">Completa tareas para ver tus tendencias</p>
        </div>
      </section>
    </motion.div>
  )
}

function HabitsTab() {
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
      
      {/* Semana completada */}
      <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-primary">Semana completada</h3>
            <p className="text-xs font-semibold text-secondary mt-1">¡Crea tu primera racha!</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary stroke-[2.5]" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-extrabold text-primary">0%</span>
            <span className="text-xs font-semibold text-secondary">Objetivo: 85%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
          </div>
        </div>
      </section>

      {/* Habito por Habito */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-bold text-outline uppercase tracking-widest px-2 pt-2">Hábito por hábito</h4>
        
        {/* Sin datos */}
        <div className="bg-surface-container-lowest rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5 border-dashed">
            <p className="text-sm font-bold text-outline">No hay hábitos registrados</p>
            <p className="text-[10px] text-outline/60 mt-1">Usa la app diariamente para ver tu progreso</p>
        </div>
      </section>
    </motion.div>
  )
}

function NightTab() {
  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
    >
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_24px_rgba(83,81,162,0.04)] border border-primary/5">
        <h2 className="font-bold text-xl text-on-surface mb-6">Horas enfocada esta semana</h2>
        <div className="flex items-end justify-between h-48 gap-2 mb-4 px-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="flex flex-col items-center flex-1 gap-3">
                  <div className="w-full bg-primary/5 rounded-full relative group h-36 overflow-hidden">
                      <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: '0%' }}
                          className={`absolute bottom-0 w-full rounded-full bg-primary/80`}
                      />
                  </div>
                  <span className={`text-[11px] font-bold uppercase text-outline`}>{day}</span>
              </div>
          ))}
        </div>
        <p className="text-center text-xs font-bold text-outline/50">Inicia el temporizador para registrar horas</p>
      </section>

      <section className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_24px_rgba(83,81,162,0.04)] flex items-center transition-all bg-primary/[0.02]">
          <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-primary">0h</span>
            <span className="text-sm font-medium text-secondary">tiempo total</span>
          </div>
      </section>
    </motion.div>
  )
}

export function StatsView({ setView, profile }: { key?: string, setView: (v: ViewState) => void, profile: UserProfile | null }) {
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
             <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
               <img src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCX1BsGrm-ZscpOi-r308EaHgs3D3j4LEgGXlgIE3fdngYnO9hgmOJ5dvfJgWAPTUL62xSVbiudR0VqFvHV6ViJbRtvKKpKCGOJG2tZTtPumjpsAM4JdalWJElH-FmBkYHutH3GpcaRHv8z7j7DJLg0cNqpeR3IuvOjpOtYHfuSYja88aDTqLBcBGr7e90V9kLcy8VyTnMnyz_eAEqNk4pY-eyxwFfMPnX7TfE0ThqWA6AO0XTw0eHUzphr7J1c_3bmAhqWIZt12w"} alt="Avatar" className="w-full h-full object-cover" />
             </div>
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
           {activeTab === 'MORNING' && <MorningTab key="morning" />}
           {activeTab === 'HABITS' && <HabitsTab key="habits" />}
           {activeTab === 'NIGHT' && <NightTab key="night" />}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
