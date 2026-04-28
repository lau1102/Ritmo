import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Check, X, Trophy, Droplet, BookOpen, Dumbbell, Clock } from 'lucide-react';
import { ViewState } from '../types';

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
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
            const isChecked = [0, 1, 2, 4, 5].includes(i);
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
        <p className="text-secondary font-medium text-sm">5 de 7 días planificaste tu mañana</p>
        <div className="mt-4 w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '71%' }} transition={{ duration: 1 }} className="bg-primary h-full rounded-full" />
        </div>
      </section>

      {/* Prioridades */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-4">Prioridades más repetidas</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
              <span className="text-sm font-bold text-on-surface">Diseño app</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">4 veces</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-500/10"></div>
              <span className="text-sm font-bold text-on-surface">Estudiar historia</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[11px] font-bold">3 veces</span>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-error ring-4 ring-error/10"></div>
              <span className="text-sm font-bold text-on-surface">Ejercicio</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-error-container text-error text-[11px] font-bold">2 veces</span>
          </div>
        </div>
      </section>

      {/* Hora Check-in */}
      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-outline uppercase tracking-widest">Hora de check-in mañana</h3>
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div className="divide-y divide-primary/5">
          {[
            { day: 'Lunes', time: '7:45am' },
            { day: 'Martes', time: '8:10am' },
            { day: 'Miércoles', time: '7:50am' },
            { day: 'Jueves', time: '8:30am' },
            { day: 'Viernes', time: '8:00am' },
          ].map((item, i) => (
            <div key={i} className="py-3.5 flex justify-between items-center">
              <span className="text-sm font-medium text-secondary">{item.day}</span>
              <span className="text-sm font-bold text-on-surface">{item.time}</span>
            </div>
          ))}
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
            <p className="text-xs font-semibold text-secondary mt-1">¡Vas por buen camino!</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary stroke-[2.5]" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-extrabold text-primary">68%</span>
            <span className="text-xs font-semibold text-secondary">Objetivo: 85%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 p-3.5 bg-sky-50 rounded-[14px]">
          <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
          <p className="text-xs font-bold text-sky-700">Mejor hábito: Tomar agua — 7/7 días</p>
        </div>
      </section>

      {/* Habito por Habito */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-bold text-outline uppercase tracking-widest px-2 pt-2">Hábito por hábito</h4>
        
        {/* Tomar Agua */}
        <div className="bg-surface-container-lowest rounded-[24px] p-5 flex flex-col space-y-5 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-blue-50 flex items-center justify-center text-blue-600">
                <Droplet className="w-5 h-5 fill-blue-600" />
              </div>
              <span className="font-bold text-on-surface text-base">Tomar agua</span>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg">100%</span>
          </div>
          
          <div className="flex justify-between items-center px-1">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-outline">{day}</span>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-primary/20">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
          </div>
        </div>

        {/* Leer 15 min */}
        <div className="bg-surface-container-lowest rounded-[24px] p-5 flex flex-col space-y-5 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-orange-50 flex items-center justify-center text-orange-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-on-surface text-base">Leer 15 min</span>
            </div>
            <span className="text-xs font-bold text-secondary bg-surface-container px-2.5 py-1.5 rounded-lg">71%</span>
          </div>
          
          <div className="flex justify-between items-center px-1">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
              const isChecked = [0, 1, 3, 4, 6].includes(i);
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-outline">{day}</span>
                  {isChecked ? (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-primary/20">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/5 border border-primary/10"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '71%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
          </div>
        </div>

        {/* Ejercicio */}
        <div className="bg-surface-container-lowest rounded-[24px] p-5 flex flex-col space-y-5 shadow-[0_4px_20px_-4px_rgba(83,81,162,0.04)] border border-primary/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="font-bold text-on-surface text-base">Ejercicio</span>
            </div>
            <span className="text-xs font-bold text-secondary bg-surface-container px-2.5 py-1.5 rounded-lg">57%</span>
          </div>
          
          <div className="flex justify-between items-center px-1">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
              const isChecked = [0, 2, 3, 5].includes(i);
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-outline">{day}</span>
                  {isChecked ? (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-primary/20">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/5 border border-primary/10"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '57%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
          </div>
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
          {[ 
              { day: 'L', height: '60%' },
              { day: 'M', height: '75%' },
              { day: 'X', height: '50%' },
              { day: 'J', height: '100%', active: true },
              { day: 'V', height: '85%' },
              { day: 'S', height: '30%' },
              { day: 'D', height: '20%' },
          ].map((item) => (
              <div key={item.day} className="flex flex-col items-center flex-1 gap-3">
                  <div className="w-full bg-primary/5 rounded-full relative group h-36 overflow-hidden">
                      <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: item.height }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`absolute bottom-0 w-full rounded-full ${item.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-primary/80'}`}
                      />
                  </div>
                  <span className={`text-[11px] font-bold uppercase ${item.active ? 'text-primary' : 'text-outline'}`}>{item.day}</span>
              </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_24px_rgba(83,81,162,0.04)] border border-primary/5">
        <h3 className="font-bold text-xs text-secondary mb-6 tracking-widest uppercase">POR ACTIVIDAD</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-semibold text-on-surface">Diseño</span>
              </div>
              <span className="text-sm font-bold text-primary">5h 20m</span>
            </div>
            <div className="h-2.5 w-full bg-primary/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1 }} className="h-full bg-primary rounded-full"></motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                <span className="font-semibold text-on-surface">Estudio</span>
              </div>
              <span className="text-sm font-bold text-primary">3h 10m</span>
            </div>
            <div className="h-2.5 w-full bg-sky-50 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1 }} className="h-full bg-sky-400 rounded-full"></motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-semibold text-on-surface">Ejercicio</span>
              </div>
              <span className="text-sm font-bold text-primary">1h 30m</span>
            </div>
            <div className="h-2.5 w-full bg-emerald-50 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} transition={{ duration: 1 }} className="h-full bg-emerald-400 rounded-full"></motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_24px_rgba(83,81,162,0.04)] border-l-4 border-primary">
          <span className="block text-2xl font-extrabold text-primary">14h</span>
          <span className="text-sm font-medium text-secondary">total semana</span>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[0_4px_24px_rgba(83,81,162,0.04)] flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">J</span>
          </div>
          <span className="text-sm font-medium text-secondary leading-tight">mejor día</span>
        </div>
      </div>
    </motion.div>
  )
}

export function StatsView({ setView }: { key?: string, setView: (v: ViewState) => void }) {
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
             <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX1BsGrm-ZscpOi-r308EaHgs3D3j4LEgGXlgIE3fdngYnO9hgmOJ5dvfJgWAPTUL62xSVbiudR0VqFvHV6ViJbRtvKKpKCGOJG2tZTtPumjpsAM4JdalWJElH-FmBkYHutH3GpcaRHv8z7j7DJLg0cNqpeR3IuvOjpOtYHfuSYja88aDTqLBcBGr7e90V9kLcy8VyTnMnyz_eAEqNk4pY-eyxwFfMPnX7TfE0ThqWA6AO0XTw0eHUzphr7J1c_3bmAhqWIZt12w" alt="Avatar" className="w-full h-full object-cover" />
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
