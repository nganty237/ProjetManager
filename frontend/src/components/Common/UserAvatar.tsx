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
    md: 'w-9 h-9 text-xs font-semibold',
    lg: 'w-11 h-11 text-sm font-semibold',
    xl: 'w-14 h-14 text-base font-bold',
  };

  const sizeClasses = sizeMap[size];

  if (avatar && !imageError) {
    return (
      <img
        src={avatar}
        alt={name || 'Utilisateur'}
        onError={() => setImageError(true)}
        className={`${sizeClasses} object-cover shrink-0 rounded-full border border-slate-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 rounded-full border border-slate-200 font-medium ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

export default UserAvatar;
