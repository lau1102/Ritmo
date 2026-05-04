import { motion } from 'motion/react';
import { ArrowLeft, Heart, Star, Flower2 as Flower, Moon, Cloud, Sun } from 'lucide-react';
import { ViewState } from '../types';
import { UserProfile } from '../App';
import { Avatar } from '../components/Avatar';
import * as ICONOS from '../assets/iconos';

interface IconsViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  profile: UserProfile | null;
  updateProfileAvatar: (avatar: string) => Promise<void>;
}

export function IconsView({ setView, profile, updateProfileAvatar }: IconsViewProps) {
  const icons = [
    { id: 'corazon_1', path: ICONOS.CORAZON_1 },
    { id: 'corazon_2', path: ICONOS.CORAZON_2 },
    { id: 'estrella_1', path: ICONOS.ESTRELLA_1 },
    { id: 'estrella_2', path: ICONOS.ESTRELLA_2 },
    { id: 'flor_1', path: ICONOS.FLOR_1 },
    { id: 'flor_2', path: ICONOS.FLOR_2 },
    { id: 'luna_1', path: ICONOS.LUNA_1 },
    { id: 'luna_2', path: ICONOS.LUNA_2 },
    { id: 'nube_1', path: ICONOS.NUBE_1 },
    { id: 'nube_2', path: ICONOS.NUBE_2 },
    { id: 'sol_1', path: ICONOS.SOL_1 },
    { id: 'sol_2', path: ICONOS.SOL_2 },
  ];

  const handleSelectIcon = async (path: string) => {
    await updateProfileAvatar(path);
  };

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
            <Avatar 
              src={profile?.avatar} 
              name={profile?.nombre}
              className="w-36 h-36 border-4 border-white shadow-sm z-10"
              iconClassName="w-16 h-16"
            />
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl -z-0"></div>
          </div>
          <p className="mt-6 font-bold text-[11px] text-outline uppercase tracking-widest">Vista previa</p>
        </section>

        <section className="w-full">
          <header className="mb-4">
            <h2 className="font-bold text-[11px] text-outline uppercase tracking-widest px-1">ELIGE UNO</h2>
          </header>
          <div className="grid grid-cols-3 gap-3">
            {icons.map((item) => {
              const isActive = profile?.avatar === item.path;
              return (
                <button 
                  key={item.id}
                  onClick={() => handleSelectIcon(item.path)}
                  className={`aspect-square bg-white rounded-[24px] flex items-center justify-center transition-all active:scale-90 duration-200 border p-4 shadow-sm ${isActive ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-primary/5 hover:bg-surface-container'}`}
                >
                  <img src={item.path} alt={item.id} className={`w-full h-full object-contain ${isActive ? '' : 'opacity-80'}`} />
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
