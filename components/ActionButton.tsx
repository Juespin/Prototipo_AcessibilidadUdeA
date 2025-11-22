import React from 'react';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  highContrast?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick, highContrast = false }) => {
  const bgClass = highContrast 
    ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-white' 
    : 'bg-[#74b816] hover:bg-[#66a312] text-white';

  return (
    <button
      onClick={onClick}
      className={`
        ${bgClass}
        font-bold 
        text-lg 
        py-3 
        px-8 
        rounded-full 
        shadow-sm
        transition-colors 
        duration-200 
        whitespace-nowrap
        min-w-[200px]
      `}
    >
      {text}
    </button>
  );
};