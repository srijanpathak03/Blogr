import React from 'react';

interface AvatarProps {
  name: string;
  size: 'small' | 'large';
}

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'small' }) => {
  const sizeClasses = size === 'small' ? 'h-8 w-8' : 'h-10 w-10';
  const textSizeClasses = size === 'small' ? 'text-xs' : 'text-sm';
  const bgColorClass = getColorFromName(name);

  return (
    <div 
      className={`flex-shrink-0 rounded-full ${bgColorClass} flex items-center justify-center font-bold text-white ${sizeClasses}`}
    >
      <span className={`${textSizeClasses} font-medium`}>
        {name[0].toUpperCase()}
      </span>
    </div>
  );
};