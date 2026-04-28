import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';
import { mascotas } from '../data/mascots';

interface MascotViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  selectedMascotId: string;
  setSelectedMascotId: (id: string) => void;
}

export function MascotView({ setView, selectedMascotId, setSelectedMascotId }: MascotViewProps) {
  const initialIndex = mascotas.findIndex(m => m.id === selectedMascotId) || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  useEffect(() => {
    setSelectedMascotId(mascotas[currentIndex].id);
  }, [currentIndex, setSelectedMascotId]);

  const prevMascot = () => {
    setCurrentIndex((prev) => (prev === 0 ? mascotas.length - 1 : prev - 1));
  };

  const nextMascot = () => {
    setCurrentIndex((prev) => (prev === mascotas.length - 1 ? 0 : prev + 1));
  };

  const currentMascot = mascotas[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-center min-h-screen py-12 px-6 bg-surface overflow-hidden"
    >
      <div className="text-center mb-10 w-full pt-10">
        <h2 className="font-display text-3xl font-extrabold text-primary mb-2 tracking-tight">Escoge tu mascota</h2>
        <p className="text-outline font-medium">Elige el compañero que te guiará</p>
      </div>

      <div className="relative w-full max-w-sm mx-auto flex items-center justify-between gap-4 mb-10">
        <button onClick={prevMascot} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container transition-colors active:scale-95 shadow-sm z-20">
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        
        <div className="flex-1 aspect-square relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-110 transition-transform pointer-events-none"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentMascot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", opacity: { repeat: 0, duration: 0.3 }, scale: { repeat: 0, duration: 0.3 } }}
                src={currentMascot.image} 
                alt={`Mascota ${currentMascot.name}`} 
                className="w-full h-auto max-h-[250px] object-contain drop-shadow-xl" 
              />
            </AnimatePresence>
          </div>
        </div>

        <button onClick={nextMascot} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container transition-colors active:scale-95 shadow-sm z-20">
          <ChevronRight className="w-6 h-6 text-primary" />
        </button>
      </div>

      <div className="w-full relative h-[180px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentMascot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-container-lowest rounded-[32px] p-6 w-full text-center shadow-[0_4px_24px_rgba(83,81,162,0.04)] border border-primary/5 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-on-surface mb-3">{currentMascot.name}</h3>
            <div className="flex justify-center gap-2 mb-4">
              {currentMascot.tags.map((tag, i) => (
                <span key={i} className={`${i === 0 ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'} px-3 py-1 rounded-full text-xs font-bold tracking-wide`}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-secondary font-medium leading-relaxed text-sm line-clamp-4">
              {currentMascot.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-auto">
        <button 
          onClick={() => setView('HOME')}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Continuar
        </button>
      </div>
    </motion.div>
  );
}
