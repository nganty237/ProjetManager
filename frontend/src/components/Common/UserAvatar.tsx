import { useState } from 'react';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({
  name,
  avatar,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str: string) => {
    if (!str) return '?';
    return str
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const sizeClasses = sizeMap[size];

  if (avatar && !imageError) {
    return (
      <img
        src={avatar}
        alt={name || 'Utilisateur'}
        onError={() => setImageError(true)}
        className={`${sizeClasses} rounded-full object-cover shrink-0 border border-slate-200/80 shadow-xs ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-white/80 ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
