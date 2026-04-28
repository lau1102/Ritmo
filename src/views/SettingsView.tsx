import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, BadgeCheck, Pencil, Sunrise, Moon, LogOut, Check, X } from 'lucide-react';
import { ViewState } from '../types';

import { UserProfile } from '../App';

interface SettingsViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  profile: UserProfile | null;
  updateProfileName: (name: string) => Promise<void>;
}

export function SettingsView({ setView, profile, updateProfileName }: SettingsViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile?.nombre || '');

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateProfileName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelName = () => {
    setTempName(profile?.nombre || '');
    setIsEditingName(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-surface pb-32"
    >
      <header className="flex justify-between items-center h-16 px-6 w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('PROFILE')} className="hover:bg-surface-container transition-colors p-2 -ml-2 rounded-full active:scale-95">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-bold text-xl text-primary">Productivity</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <img src={profile?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCUnS9FEY6U0wZOcIdh5XRMuR_OwCWsfCUyVHFja2-JhtFROwjEoRDqVI7MFMdUo47xHlSwrhKIDol4dqOFq_SZqn7aIe7MmvhX8NXShP3HU-BRlSFoTENF4vSn7-D0F9pI7ONSlePFVU-9QsXe6J2P0jC74yEpjq9aPDmI0p3nV4x0iWM1QamrUNr01EkrDqN3nYGiJBfgJ2UWvzhlCNNuajZVZs9L4UIALMnJTRyPATEAutJQf0a-64wqlsPODKG36_aZpo_Vgw"} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-6 max-w-md mx-auto w-full">
        <div className="py-8 text-center">
          <h2 className="font-display text-4xl font-extrabold text-on-surface tracking-tight">Configuración</h2>
          <p className="text-secondary font-medium text-sm mt-2">Personaliza tu experiencia de enfoque</p>
        </div>

        <div className="mb-8 pl-1">
          <span className="font-bold text-[11px] text-outline uppercase tracking-widest">CUENTA</span>
          <div className="mt-4 space-y-3">
            
            <button onClick={() => setView('ICONS')} className="w-full bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between hover:bg-surface-container/50 active:scale-[0.98] transition-all group border border-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary">
                  {profile?.avatar?.startsWith('/iconos/') ? (
                    <img src={profile.avatar} className="w-8 h-8" />
                  ) : (
                    <BadgeCheck className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-bold text-base text-on-surface">Icono de perfil</p>
                  <p className="text-sm font-medium text-secondary">Cambia tu avatar</p>
                </div>
              </div>
              <Menu className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors rotate-180" />
            </button>

            <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between border border-primary/5">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xs text-outline uppercase tracking-tighter">Nombre</p>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent font-bold text-primary text-base outline-none border-b-2 border-primary/20 focus:border-primary"
                    />
                  ) : (
                    <p className="text-base font-bold text-primary truncate">{profile?.nombre || profile?.email?.split('@')[0] || 'Usuario'}</p>
                  )}
                </div>
              </div>
              {isEditingName ? (
                <div className="flex gap-1">
                  <button onClick={handleSaveName} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={handleCancelName} className="p-2 text-outline hover:bg-surface-container rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="w-10 h-10 rounded-[14px] bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors active:scale-95"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
            </div>

          </div>
        </div>

        <div className="mb-8 pl-1">
          <div className="flex justify-between items-end pr-1">
            <span className="font-bold text-[11px] text-outline uppercase tracking-widest">NOTIFICACIONES</span>
            <span className="text-sm text-primary font-extrabold cursor-pointer hover:underline">Añadir +</span>
          </div>
          <div className="mt-4 space-y-3">
            
            <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between border-l-[6px] border-l-primary border border-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-[16px] text-primary">
                  <Sunrise className="w-6 h-6 fill-primary/20" />
                </div>
                <div>
                  <p className="font-bold text-base text-on-surface">Mañana</p>
                  <p className="text-xl text-primary font-extrabold -tracking-tight">7:00 am</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-8 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between border-l-[6px] border-l-secondary border border-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-container rounded-[16px] text-secondary">
                  <Moon className="w-6 h-6 fill-secondary/20" />
                </div>
                <div>
                  <p className="font-bold text-base text-on-surface">Noche</p>
                  <p className="text-xl text-secondary font-extrabold -tracking-tight">9:00 pm</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-8 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

          </div>
        </div>

        <div className="mb-8 pl-1">
          <span className="font-bold text-[11px] text-outline uppercase tracking-widest">SESIÓN</span>
          <div className="mt-4">
            <button onClick={() => setView('SPLASH')} className="w-full bg-error-container/30 border-2 border-error/10 py-5 rounded-[24px] flex items-center justify-center gap-3 text-error font-extrabold text-lg hover:bg-error-container/50 transition-all active:scale-[0.98]">
              <LogOut className="w-5 h-5 stroke-[2.5]" />
              Cerrar sesión
            </button>
          </div>
        </div>

      </main>
    </motion.div>
  );
}
