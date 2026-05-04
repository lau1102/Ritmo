import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, CheckCircle2, Timer, Flame, Medal, Lock, Edit2, Check, X } from 'lucide-react';
import { ViewState } from '../types';
import { mascotas } from '../data/mascots';
import { UserProfile } from '../App';
import { Avatar } from '../components/Avatar';

interface ProfileViewProps {
  key?: string;
  setView: (v: ViewState) => void;
  selectedMascotId: string;
  profile: UserProfile | null;
  updateProfileName: (name: string) => Promise<void>;
}

export function ProfileView({ setView, selectedMascotId, profile, updateProfileName }: ProfileViewProps) {
  const currentMascot = mascotas.find(m => m.id === selectedMascotId) || mascotas[0];
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile?.nombre || '');

  const handleSave = async () => {
    if (tempName.trim()) {
      await updateProfileName(tempName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempName(profile?.nombre || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen pb-32"
    >
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <button onClick={() => setView('SETTINGS')} className="active:scale-95 transition-transform p-2 -ml-2 rounded-full hover:bg-surface-container">
          <Settings className="w-6 h-6 text-primary" />
        </button>
        <h1 className="font-bold text-xl tracking-tight text-primary">Mi Perfil</h1>
        <Avatar 
          src={profile?.avatar} 
          name={profile?.nombre}
          className="w-10 h-10 border-2 border-primary/20"
        />
      </header>

      <main className="px-6 space-y-8 pt-6 max-w-md mx-auto w-full">
        <section className="flex flex-col items-center text-center space-y-2">
          <div className="relative">
            <div className="w-28 h-28 rounded-[32px] bg-white flex items-center justify-center p-4 shadow-[0_4px_20px_-5px_rgba(83,81,162,0.08)] border border-primary/5">
              <img src={currentMascot.image} alt={`Mascota ${currentMascot.name}`} className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 border-4 border-surface shadow-md">
              <CheckCircle2 className="w-4 h-4 fill-white text-primary" />
            </div>
          </div>
          <div className="pt-2 w-full px-4">
            {isEditing ? (
              <div className="flex flex-col items-center gap-3">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                  className="w-full bg-surface-container text-center font-display text-2xl font-extrabold text-on-surface p-2 rounded-2xl outline-none border-2 border-primary/20 focus:border-primary transition-all"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" /> Guardar
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-surface-container text-outline px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative inline-block cursor-pointer" onClick={() => setIsEditing(true)}>
                <h2 className="font-display text-3xl font-extrabold text-on-surface -tracking-tight pr-8">
                  {profile?.nombre || 'Mi Perfil'}
                </h2>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-outline/30 group-hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>
            )}
            <p className="font-semibold text-sm text-outline mt-1">{profile?.email || ''}</p>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0_4px_20px_-5px_rgba(83,81,162,0.04)] border border-primary/5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-bold text-[11px] text-primary uppercase tracking-widest">Progreso Actual</span>
              <h3 className="font-bold text-xl mt-1 text-on-surface">Nivel {profile?.nivel || 1} - Constante</h3>
            </div>
            <p className="font-bold text-xs text-primary">{profile?.xp || 0} / {(profile?.nivel || 1) * 50} XP</p>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${Math.min(((profile?.xp || 0) / ((profile?.nivel || 1) * 50)) * 100, 100)}%` }} 
              transition={{ duration: 1 }} 
              className="bg-primary h-3 rounded-full"
            />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: CheckCircle2, val: profile?.tareas_completadas || 0, label: 'tareas totales' },
            { icon: Flame, val: profile?.racha || 0, label: 'racha actual' },
            { icon: Medal, val: profile?.habitos_completados || 0, label: 'hábitos' },
            { icon: Timer, val: '0h', label: 'tiempo total' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-surface-container-lowest p-5 rounded-[24px] flex flex-col items-start gap-3 shadow-[0_4px_20px_-5px_rgba(83,81,162,0.03)] border border-primary/5">
                <div className="bg-primary/10 p-2.5 rounded-[14px]">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-on-surface leading-none">{stat.val}</p>
                  <p className="font-semibold text-[13px] text-secondary mt-1">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <section className="space-y-4">
          <h3 className="font-bold text-[11px] text-outline uppercase tracking-widest px-2">Logros</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
            {[
              { label: '7 días seguidos' },
              { label: '50 tareas' },
              { label: 'Maestría' },
              { label: 'Explorador' },
              { label: 'Enfoque Total' }
            ].map((ach, i) => (
              <div key={i} className="flex-none w-36 aspect-square bg-surface-container-lowest rounded-[32px] flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-outline-variant/30 opacity-60">
                <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-outline/40" />
                </div>
                <p className="font-semibold text-xs leading-tight text-outline/60">{ach.label}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </motion.div>
  );
}
