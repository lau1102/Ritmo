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
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchTasks(session.user.id);
        fetchHabits(session.user.id);
      } else {
        setProfile(null);
        setTasks([]);
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
    if (data) setProfile(data);
  };

  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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

    if (data) {
      const newTask: Task = {
        id: data[0].id,
        text: data[0].texto,
        completed: data[0].completada,
        usuario_id: data[0].usuario_id
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tareas')
      .update({ completada: !task.completed })
      .eq('id', id);

    if (!error) {
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id);

    if (!error) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleHabit = async (id: string) => {
    if (!user) return;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const { error } = await supabase
      .from('habitos')
      .upsert({ 
        id: id.length > 10 ? id : undefined, // Check if it's a real UUID or mock
        nombre: habit.name,
        completado: !habit.completed,
        usuario_id: user.id
      })
      .select();

    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
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
