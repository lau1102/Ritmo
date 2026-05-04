import { Heart, Star, Flower2, Moon, Cloud, Sun, User } from 'lucide-react';

const iconMap: Record<string, any> = {
  heart: Heart,
  star: Star,
  flower: Flower2,
  moon: Moon,
  cloud: Cloud,
  sun: Sun,
};

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  iconClassName?: string;
}

export function Avatar({ src, name, className = '', iconClassName = '' }: AvatarProps) {
  const isIcon = src && iconMap[src.toLowerCase()];
  
  if (isIcon) {
    const Icon = iconMap[src.toLowerCase()];
    return (
      <div className={`flex items-center justify-center bg-primary/10 rounded-full ${className}`}>
        <Icon className={`w-1/2 h-1/2 text-primary ${iconClassName}`} />
      </div>
    );
  }

  if (src && (src.startsWith('http') || src.startsWith('/'))) {
    return (
      <div className={`overflow-hidden flex items-center justify-center bg-primary/5 rounded-full ${className}`}>
        <img src={src} alt="Avatar" className="w-full h-full object-contain" />
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
