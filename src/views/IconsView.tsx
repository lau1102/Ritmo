import { motion } from 'motion/react';
import { ArrowLeft, Star, Moon, Zap, Waves, Flame, Flower2, Leaf, Target, Bird, Rabbit, Rainbow, Globe } from 'lucide-react';
import { ViewState } from '../types';

export function IconsView({ setView }: { key?: string, setView: (v: ViewState) => void }) {
  const icons = [
    { id: 'star', icon: Star, active: true },
    { id: 'moon', icon: Moon },
    { id: 'zap', icon: Zap },
    { id: 'waves', icon: Waves },
    { id: 'flame', icon: Flame },
    { id: 'flower', icon: Flower2 },
    { id: 'leaf', icon: Leaf },
    { id: 'target', icon: Target },
    { id: 'bird', icon: Bird },
    { id: 'rabbit', icon: Rabbit },
    { id: 'rainbow', icon: Rainbow },
    { id: 'globe', icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center min-h-screen bg-surface"
    >
      <header className="w-full max-w-md bg-surface/80 backdrop-blur-md flex justify-between items-center h-16 px-6 fixed top-0 z-50 border-b border-primary/5">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('SETTINGS')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 transition-all">
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-primary font-bold text-xl tracking-tight">Elige tu icono</h1>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      <main className="w-full max-w-md px-6 pt-24 pb-32 flex flex-col items-center">
        <section className="w-full flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-36 h-36 rounded-full bg-surface-container-low flex items-center justify-center shadow-sm relative z-10 border-4 border-white">
              <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center">
                <Star className="w-14 h-14 text-white fill-white" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-0"></div>
          </div>
          <p className="mt-6 font-bold text-[11px] text-outline uppercase tracking-widest">Vista previa</p>
        </section>

        <section className="w-full">
          <header className="mb-4">
            <h2 className="font-bold text-[11px] text-outline uppercase tracking-widest px-1">ELIGE UNO</h2>
          </header>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {icons.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  className={`aspect-square bg-white rounded-[24px] flex items-center justify-center transition-all active:scale-90 duration-200 border shadow-sm ${item.active ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-primary/5 hover:bg-surface-container'}`}
                >
                  <Icon className={`w-8 h-8 ${item.active ? 'text-primary fill-primary' : 'text-secondary'}`} />
                </button>
              )
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 w-full max-w-md p-6 bg-gradient-to-t from-surface via-surface/90 to-transparent z-40">
        <button onClick={() => setView('SETTINGS')} className="w-full py-5 bg-primary text-white font-bold text-lg rounded-[24px] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
            Guardar
        </button>
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </motion.div>
  );
}
