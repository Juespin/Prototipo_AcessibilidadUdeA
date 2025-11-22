import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <div className="w-full h-3 bg-[#7ebc00] border-b border-green-700 shadow-sm relative overflow-hidden">
        {/* Patrón decorativo que imita el borde superior de la imagen */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#005844]" />
        <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#6ea100]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#005844]" />
    </div>
  );
};