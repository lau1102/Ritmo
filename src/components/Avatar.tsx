import { User } from 'lucide-react';
import * as ICONOS from '../assets/iconos';

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  iconClassName?: string;
}

export function Avatar({ src, name, className = '', iconClassName = '' }: AvatarProps) {
  if (src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'))) {
    return (
      <div className={`overflow-hidden flex items-center justify-center bg-primary/5 rounded-full ${className}`}>
        <img src={src} alt="Avatar" className="w-full h-full object-contain" />
      </div>
    );
  }

  // Si src es solo un nombre de icono (ej: "heart") lo convertimos a ruta si coincide con los nuestros
  const iconsMap: Record<string, string> = {
    heart: ICONOS.CORAZON_1,
    star: ICONOS.ESTRELLA_1,
    flower: ICONOS.FLOR_1,
    moon: ICONOS.LUNA_1,
    cloud: ICONOS.NUBE_1,
    sun: ICONOS.SOL_1
  };

  const normalized = src?.toLowerCase();
  if (normalized && iconsMap[normalized]) {
    return (
      <div className={`overflow-hidden flex items-center justify-center bg-primary/5 rounded-full ${className}`}>
        <img src={iconsMap[normalized]} alt="Avatar" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-primary/10 rounded-full ${className}`}>
      {name ? (
        <span className="text-primary font-bold text-xs">
          {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-primary" />
      )}
    </div>
  );
}
