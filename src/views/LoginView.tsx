import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Moon, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { supabase } from '../lib/supabase';

export function LoginView({ setView }: { key?: string, setView: (v: ViewState) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      setView('HOME');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
        <main className="w-full max-w-md px-6 py-12 flex-1 flex flex-col justify-center">
            {/* Logo & Greeting Section */}
            <div className="text-center mb-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/80 rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                <Moon className="w-12 h-12 text-white fill-white" />
              </div>
              <h1 className="font-display text-4xl text-primary font-bold tracking-tight mb-2">Bienvenido a Ritmo</h1>
              <p className="font-medium text-secondary text-base">Tu espacio de calma y productividad</p>
            </div>

            {error && (
              <div className="bg-error/10 text-error p-4 rounded-2xl text-sm font-medium mb-4 border border-error/10 text-center">
                {error}
              </div>
            )}

            {/* Login Card */}
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-[0_4px_24px_rgba(83,81,162,0.04)] w-full border border-primary/5">
              <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-widest pl-1" htmlFor="email">Correo electrónico</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      className="w-full bg-surface-container-low border border-transparent rounded-[20px] py-4 pl-12 pr-4 font-medium text-on-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                      id="email" 
                      placeholder="ejemplo@correo.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-widest pl-1" htmlFor="password">Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      className="w-full bg-surface-container-low border border-transparent rounded-[20px] py-4 pl-12 pr-4 font-medium text-on-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none tracking-widest" 
                      id="password" 
                      placeholder="••••••••" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <button type="button" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">¿Olvidaste tu contraseña?</button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white font-bold text-lg py-4 rounded-[20px] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 w-full mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] bg-primary/10 flex-1"></div>
                  <span className="text-xs font-semibold text-outline">o continúa con</span>
                  <div className="h-[1px] bg-primary/10 flex-1"></div>
                </div>

                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 bg-white border border-primary/10 rounded-[20px] py-4 hover:bg-surface-container-low transition-colors active:scale-95 text-on-surface font-semibold shadow-sm"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                  <span>Continuar con Google</span>
                </button>
              </form>
            </div>

            <div className="mt-8 text-center pb-8">
              <span className="text-secondary font-medium">¿No tienes una cuenta? </span>
              <button onClick={() => setView('REGISTER')} className="text-primary font-bold hover:underline underline-offset-4">Regístrate gratis</button>
            </div>
        </main>
    </motion.div>
  );
}
