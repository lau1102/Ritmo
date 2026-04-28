import { motion } from 'motion/react';
import { Moon } from 'lucide-react';
import { ViewState } from '../types';

export function SplashView({ setView }: { key?: string, setView: (v: ViewState) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-between min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-[#F3F2F8] to-white"
    >
      <div className="flex flex-col items-center text-center w-full mt-12">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 mb-8 bg-primary/10 rounded-[32px] flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary opacity-5 animate-pulse"></div>
          <Moon className="w-12 h-12 text-primary fill-primary" />
        </motion.div>
        
        <h1 className="font-display text-5xl text-primary tracking-tighter mb-4 font-extrabold">Ritmo</h1>
        <p className="font-medium text-outline max-w-[280px] text-lg leading-snug">
          Tu compañero ideal para una vida activa y saludable junto a tu mascota.
        </p>
      </div>

      <div className="w-full space-y-4 mt-auto">
        <button 
          onClick={() => setView('REGISTER')}
          className="w-full py-5 bg-primary text-white rounded-[24px] font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Registrarse
        </button>
        <button 
          onClick={() => setView('LOGIN')}
          className="w-full py-5 border-2 border-primary/20 text-primary rounded-[24px] font-bold text-lg active:scale-[0.98] transition-all bg-white/50 backdrop-blur-sm"
        >
          Iniciar Sesión
        </button>
        
        <p className="text-center text-xs font-semibold text-outline/60 pt-4">
          Al continuar, aceptas nuestros <a href="#" className="underline">Términos y Condiciones</a>
        </p>
      </div>
    </motion.div>
  );
}
