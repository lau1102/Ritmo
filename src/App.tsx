/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewState, Task } from './types';
import { supabase } from './lib/supabase';

import { SplashView } from './views/SplashView';
import { MascotView } from './views/MascotView';
import { HomeView } from './views/HomeView';
import { TimerView } from './views/TimerView';
import { StatsView } from './views/StatsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { IconsView } from './views/IconsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { BottomNav } from './components/BottomNav';

export interface UserProfile {
  id: string;
  nombre: string;
  avatar: string;
  email: string;
  nivel: number;
  xp: number;
  racha: number;
  tareas_completadas: number;
  habitos_completados: number;
}

export default function App() {
  const [view, setView] = useState<ViewState>('SPLASH');
  const [selectedMascotId, setSelectedMascotId] = useState<string>('sol');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<{ id: string, name: string, completed: boolean }[]>([
    { id: '1', name: 'Meditar 5m', completed: false },
    { id: '2', name: 'Beber Agua', completed: false },
    { id: '3', name: 'Leer', completed: false }
  ]);

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchTasks(session.user.id);
        fetchHabits(session.user.id);
        setView('HOME'); // Navegación directa al estar logueado
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchTasks(session.user.id);
        fetchHabits(session.user.id);
        if (event === 'SIGNED_IN') setView('HOME'); // Navegación directa al loguear
      } else {
        setUser(null);
        setProfile(null);
        setTasks([]);
        if (event === 'SIGNED_OUT') setView('LOGIN');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // Si el perfil no existe, lo creamos (importante para usuarios antiguos o fallos en registro)
      const { data: newData, error: createError } = await supabase
        .from('usuarios')
        .insert([{ 
          id: userId, 
          nombre: user?.email?.split('@')[0] || 'Usuario', 
          email: user?.email,
          nivel: 1,
          xp: 0,
          racha: 0,
          tareas_completadas: 0,
          habitos_completados: 0,
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUnS9FEY6U0wZOcIdh5XRMuR_OwCWsfCUyVHFja2-JhtFROwjEoRDqVI7MFMdUo47xHlSwrhKIDol4dqOFq_SZqn7aIe7MmvhX8NXShP3HU-BRlSFoTENF4vSn7-D0F9pI7ONSlePFVU-9QsXe6J2P0jC74yEpjq9aPDmI0p3nV4x0iWM1QamrUNr01EkrDqN3nYGiJBfgJ2UWvzhlCNNuajZVZs9L4UIALMnJTRyPATEAutJQf0a-64wqlsPODKG36_aZpo_Vgw"
        }])
        .select()
        .single();
      
      if (newData) setProfile(newData);
      if (createError) console.error("Error creando perfil:", createError);
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;

    setProfile(current => {
      // Si no hay perfil, usamos valores por defecto
      const baseProfile = current || { nivel: 1, xp: 0, tareas_completadas: 0 };
      
      let newXP = (baseProfile.xp || 0) + amount;
      let newLevel = baseProfile.nivel || 1;
      let tareasCompletadas = baseProfile.tareas_completadas || 0;

      if (amount > 0) {
        tareasCompletadas += 1;
      } else {
        tareasCompletadas = Math.max(0, tareasCompletadas - 1);
      }
      
      // Lógica de Subida de Nivel
      let xpRequired = newLevel * 50;
      while (newXP >= xpRequired) {
        newXP -= xpRequired;
        newLevel++;
        xpRequired = newLevel * 50;
      }

      // Lógica de Bajada de Nivel
      while (newXP < 0 && newLevel > 1) {
        newLevel--;
        xpRequired = newLevel * 50;
        newXP += xpRequired;
      }
      
      if (newXP < 0) newXP = 0;

      const updated = { 
        ...current, 
        id: user.id,
        xp: newXP, 
        nivel: newLevel,
        tareas_completadas: tareasCompletadas
      } as UserProfile;

      // Sincronizar con Supabase
      supabase
        .from('usuarios')
        .update({ 
          xp: updated.xp, 
          nivel: updated.nivel,
          tareas_completadas: updated.tareas_completadas
        })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error("Error syncing XP/Level:", error);
        });

      return updated;
    });
  };

  const fetchTasks = async (userId: string) => {
    const { data } = await supabase
      .from('tareas')
      .select('*')
      .eq('usuario_id', userId)
      .order('created_at', { ascending: false });
    if (data) {
      setTasks(data.map((t: any) => ({
        id: t.id,
        text: t.texto,
        completed: t.completada,
        usuario_id: t.usuario_id
      })));
    }
  };

  const fetchHabits = async (userId: string) => {
    const { data } = await supabase
      .from('habitos')
      .select('*')
      .eq('usuario_id', userId);
    
    if (data && data.length > 0) {
      setHabits(data.map((h: any) => ({
        id: h.id,
        name: h.nombre,
        completed: h.completado
      })));
    }
  };

  const addTask = async (text: string) => {
    if (!text.trim() || !user) return;
    
    const tempId = Math.random().toString(36).substring(7);
    const newTask: Task = {
      id: tempId,
      text: text.trim(),
      completed: false,
      usuario_id: user.id
    };
    
    // Update UI immediately (optimistic)
    setTasks(prev => [newTask, ...prev]);

    try {
      const { data, error } = await supabase
        .from('tareas')
        .insert([
          { 
            texto: text.trim(), 
            completada: false, 
            usuario_id: user.id 
          }
        ])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        return;
      }

      if (data && data.length > 0) {
        setTasks(prev => prev.map(t => t.id === tempId ? {
          ...t,
          id: data[0].id
        } : t));
      }
    } catch (err) {
      console.error("Unexpected error adding task:", err);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic update
    const newStatus = !task.completed;
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: newStatus } : t
    ));

    // Sumar o restar XP (Inmediato)
    if (newStatus) {
      addXP(10);
    } else {
      addXP(-10);
    }

    // Si es un ID temporal, ya actualizamos localmente.
    // El sync real de la tarea se hará cuando tenga ID de base de datos.
    if (id.length < 20) return;

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ completada: newStatus })
        .eq('id', id);

      if (error) {
        console.error("Error updating task:", error);
        // Rollback local si falla la base de datos
        setTasks(prev => prev.map(t => 
          t.id === id ? { ...t, completed: !newStatus } : t
        ));
        if (newStatus) addXP(-10); else addXP(10);
        return;
      }
    } catch (err) {
      console.error("Unexpected error updating task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    // If it's a temp ID, just remove locally
    if (id.length < 20) {
      setTasks(prev => prev.filter(task => task.id !== id));
      return;
    }

    // Optimistic delete
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(task => task.id !== id));

    try {
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting task:", error);
        setTasks(previousTasks);
      }
    } catch (err) {
      console.error("Unexpected error deleting task:", err);
      setTasks(previousTasks);
    }
  };

  const toggleHabit = async (id: string) => {
    if (!user || !profile) return;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newStatus = !habit.completed;

    const { error } = await supabase
      .from('habitos')
      .upsert({ 
        id: id.length > 20 ? id : undefined, 
        nombre: habit.name,
        completado: newStatus,
        usuario_id: user.id
      })
      .select();

    if (!error) {
      setHabits(habits.map(h => 
        h.id === id ? { ...h, completed: newStatus } : h
      ));
      
      if (newStatus) {
        // Podríamos sumar XP por hábitos también si el usuario lo desea, 
        // pero por ahora solo el perfil cuenta tareas.
        await supabase.from('usuarios').update({ habitos_completados: profile.habitos_completados + 1 }).eq('id', user.id);
        fetchProfile(user.id);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-surface overflow-x-hidden font-sans shadow-2xl">
      <AnimatePresence mode="wait">
        {view === 'SPLASH' && <SplashView key="splash" setView={setView} />}
        {view === 'LOGIN' && <LoginView key="login" setView={setView} />}
        {view === 'REGISTER' && <RegisterView key="register" setView={setView} />}
        {view === 'MASCOT' && <MascotView key="mascot" setView={setView} selectedMascotId={selectedMascotId} setSelectedMascotId={setSelectedMascotId} />}
        {view === 'HOME' && (
          <HomeView key="home" 
            setView={setView} 
            selectedMascotId={selectedMascotId} 
            tasks={tasks} 
            addTask={addTask} 
            toggleTask={toggleTask} 
            deleteTask={deleteTask}
            habits={habits}
            toggleHabit={toggleHabit}
            profile={profile}
          />
        )}
        {view === 'TIMER' && <TimerView key="timer" setView={setView} tasks={tasks} toggleTask={toggleTask} />}
        {view === 'STATS' && <StatsView key="stats" setView={setView} />}
        {view === 'PROFILE' && <ProfileView key="profile" setView={setView} selectedMascotId={selectedMascotId} profile={profile} />}
        {view === 'SETTINGS' && <SettingsView key="settings" setView={setView} />}
        {view === 'ICONS' && <IconsView key="icons" setView={setView} />}
      </AnimatePresence>
      <BottomNav view={view} setView={setView} />
    </div>
  );
}
