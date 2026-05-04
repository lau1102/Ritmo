export type ViewState = 'SPLASH' | 'MASCOT' | 'HOME' | 'TIMER' | 'STATS' | 'PROFILE' | 'SETTINGS' | 'ICONS' | 'LOGIN' | 'REGISTER';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  usuario_id?: string;
  fecha?: string;
}
