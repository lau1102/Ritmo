import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Camera, Smile, Palette, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { supabase } from '../lib/supabase';
import * as ICONOS from '../assets/iconos';

import { Avatar } from '../components/Avatar';

const AVATARS = [
  ICONOS.CORAZON_1,
  ICONOS.ESTRELLA_1,
  ICONOS.FLOR_1,
  ICONOS.LUNA_1,
  ICONOS.NUBE_1,
  ICONOS.SOL_1
];

export function RegisterView({ setView }: { key?: string, setView: (v: ViewState) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Guardar en tabla usuarios
        const { error: dbError } = await supabase
          .from('usuarios')
          .insert([
            { 
              id: authData.user.id, 
              nombre: name, 
              email: email, 
              avatar: selectedAvatar,
              nivel: 1,
              experiencia: 0,
              streak: 0,
              monedas: 0,
              last_check_in: new Date().toISOString()
            }
          ]);

        if (dbError) throw dbError;
        
        setView('MASCOT');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen bg-surface items-center w-full"
    >
      <header className="flex justify-between items-center px-6 py-4 w-full max-w-md sticky top-0 z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('SPLASH')} className="hover:bg-primary/5 transition-colors rounded-full p-2 flex items-center justify-center active:scale-95 text-primary -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold tracking-tight text-primary hover:underline cursor-pointer" onClick={() => setView('SPLASH')}>Ritmo</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-extrabold text-primary tracking-tighter">Ritmo</div>
      </header>

      <main className="flex-1 flex flex-col px-6 py-6 w-full max-w-md">
        <div className="space-y-1 mb-6 text-center">
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">Crea tu cuenta</h1>
          <p className="text-secondary font-medium text-sm">¡Bienvenida! Empieza tu camino hoy.</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-4 rounded-2xl text-sm font-medium mb-4 border border-error/10">
            {error}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-[32px] p-6 shadow-[0_4px_24px_rgba(83,81,162,0.04)] space-y-6 w-full border border-primary/5">
          {/* Avatar Selection */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest pl-1">Elige tu avatar</label>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
              {AVATARS.map((path, i) => (
                <div key={i} className="relative flex-shrink-0 cursor-pointer" onClick={() => setSelectedAvatar(path)}>
                  <Avatar 
                    src={path} 
                    className={`w-16 h-16 border-2 p-1 transition-all flex items-center justify-center ${selectedAvatar === path ? 'border-primary bg-primary/5' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    iconClassName="w-10 h-10"
                  />
                  {selectedAvatar === path && (
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
              <button type="button" className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors text-outline hover:text-primary flex-shrink-0">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant pl-1" htmlFor="name">Tu nombre</label>
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej. Sofía García"
                className="w-full bg-surface-container-low border border-transparent rounded-[16px] px-4 py-3.5 text-on-surface placeholder:text-outline focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant pl-1" htmlFor="email">tu@correo.com</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@ejemplo.com"
                className="w-full bg-surface-container-low border border-transparent rounded-[16px] px-4 py-3.5 text-on-surface placeholder:text-outline focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant pl-1" htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
              <div className="relative group">
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-transparent rounded-[16px] px-4 py-3.5 pr-12 text-on-surface placeholder:text-outline focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm tracking-widest"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold text-lg py-4 rounded-[20px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear mi cuenta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 pb-6">
          <span className="text-secondary font-medium">¿Ya tienes cuenta? </span>
          <button onClick={() => setView('LOGIN')} className="text-primary font-bold hover:underline">Inicia sesión</button>
        </div>
      </main>
    </motion.div>
  );
}
