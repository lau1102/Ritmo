import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, BadgeCheck, Pencil, Sunrise, Moon, LogOut, Check, X, Trash2, Plus, Bell } from 'lucide-react';
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
  const [reminders, setReminders] = useState([
    { id: '1', label: 'Mañana', time: '07:00', active: true, type: 'morning' },
    { id: '2', label: 'Noche', time: '21:00', active: true, type: 'night' }
  ]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [newReminderTime, setNewReminderTime] = useState('08:00');
  const [newReminderLabel, setNewReminderLabel] = useState('');

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

  const handleAddReminder = () => {
    if (!newReminderTime) return;
    const newRem = {
      id: Math.random().toString(36).substring(7),
      label: newReminderLabel || 'Recordatorio',
      time: newReminderTime,
      active: true,
      type: 'custom'
    };
    setReminders([...reminders, newRem]);
    setIsAddingReminder(false);
    setNewReminderLabel('');
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const startEditingReminder = (id: string) => {
    const r = reminders.find(rem => rem.id === id);
    if (r) {
      setEditingReminderId(id);
      setNewReminderTime(r.time);
      setNewReminderLabel(r.label);
    }
  };

  const saveEditedReminder = () => {
    setReminders(reminders.map(r => r.id === editingReminderId ? { ...r, time: newReminderTime, label: newReminderLabel || r.label } : r));
    setEditingReminderId(null);
    setNewReminderLabel('');
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
          <h1 className="font-bold text-xl text-primary">Ritmo</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-contain" />
            ) : (
                <span className="text-primary font-bold text-xs">
                    {profile?.nombre?.split(' ').map(n => n[0]).join('') || profile?.email?.[0]?.toUpperCase() || 'U'}
                </span>
            )}
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
            <span className="font-bold text-[11px] text-outline uppercase tracking-widest">RECORDATORIOS</span>
            <button onClick={() => setIsAddingReminder(true)} className="text-sm text-primary font-extrabold cursor-pointer hover:underline">Añadir +</button>
          </div>
          <div className="mt-4 space-y-3">
            <AnimatePresence>
              {isAddingReminder && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary/5 p-4 rounded-[24px] border border-primary/20 space-y-3 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nombre (ej: Meditar)" 
                      value={newReminderLabel}
                      onChange={(e) => setNewReminderLabel(e.target.value)}
                      className="flex-1 bg-white p-2 rounded-xl text-sm border border-primary/10 outline-none"
                    />
                    <input 
                      type="time" 
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      className="bg-white p-2 rounded-xl text-sm border border-primary/10 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddReminder} className="flex-1 bg-primary text-white py-2 rounded-xl font-bold text-sm">Guardar</button>
                    <button onClick={() => setIsAddingReminder(false)} className="flex-1 bg-surface-container py-2 rounded-xl font-bold text-sm">Cancelar</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {reminders.map((reminder) => (
              <div key={reminder.id} className={`bg-white p-5 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between border border-primary/5 transition-all ${editingReminderId === reminder.id ? 'ring-2 ring-primary bg-primary/[0.02]' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-[16px] ${reminder.active ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline-variant'}`}>
                    {reminder.type === 'morning' ? <Sunrise className="w-6 h-6" /> : reminder.type === 'night' ? <Moon className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                  </div>
                  <div>
                    {editingReminderId === reminder.id ? (
                      <div className="space-y-1">
                        <input type="text" value={newReminderLabel} onChange={(e) => setNewReminderLabel(e.target.value)} className="bg-surface-container p-1 rounded text-xs font-bold w-24 outline-none border border-primary/10" />
                        <input type="time" value={newReminderTime} onChange={(e) => setNewReminderTime(e.target.value)} className="block bg-surface-container p-1 rounded text-base font-extrabold text-primary w-24 outline-none border border-primary/10" />
                      </div>
                    ) : (
                      <>
                        <p className={`font-bold text-base ${reminder.active ? 'text-on-surface' : 'text-outline'}`}>{reminder.label}</p>
                        <p className={`text-xl font-extrabold -tracking-tight ${reminder.active ? 'text-primary' : 'text-outline-variant'}`}>{reminder.time}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingReminderId === reminder.id ? (
                    <button onClick={saveEditedReminder} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                      <Check className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <button onClick={() => startEditingReminder(reminder.id)} className="p-2 text-outline-variant hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteReminder(reminder.id)} className="p-2 text-outline-variant hover:text-error transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer ml-1">
                        <input type="checkbox" checked={reminder.active} onChange={() => toggleReminder(reminder.id)} className="sr-only peer" />
                        <div className="w-12 h-7 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </>
                  )}
                </div>
              </div>
            ))}
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
