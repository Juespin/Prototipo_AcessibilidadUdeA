import React, { useState, useEffect } from 'react';
import { CertificateSection } from './components/CertificateSection.tsx';
import { TopBar } from './components/TopBar.tsx';
import { AccessibilityBar } from './components/AccessibilityBar.tsx';

const App: React.FC = () => {
  const [fontSizePct, setFontSizePct] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  // Gestiona el escalado global de la fuente
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSizePct}%`;
  }, [fontSizePct]);

  const handleIncreaseFont = () => {
    setFontSizePct(prev => Math.min(prev + 10, 150)); // Máx. 150%
  };

  const handleDecreaseFont = () => {
    setFontSizePct(prev => Math.max(prev - 10, 80)); // Mín. 80%
  };

  const handleSetFontSize = (size: 'mediano' | 'grande' | 'muyGrande' | 'extraGrande') => {
    const map: Record<string, number> = {
      mediano: 100,
      grande: 110,
      muyGrande: 120,
      extraGrande: 140,
    };
    setFontSizePct(map[size] ?? 100);
  };

  const handleToggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  const handleReset = () => {
    setFontSizePct(100);
    setHighContrast(false);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${highContrast ? 'bg-black' : 'bg-white'}`}>
      <AccessibilityBar 
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        onSetFontSize={handleSetFontSize}
        onToggleContrast={handleToggleContrast}
        onReset={handleReset}
        highContrast={highContrast}
      />
      
      <TopBar />
      
      <main className={`flex-grow flex flex-col items-center pt-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
        <div className={`w-full max-w-6xl transition-colors duration-300 ${highContrast ? 'bg-black border border-gray-800 p-4 rounded' : 'bg-white'}`}>
          <CertificateSection highContrast={highContrast} />
        </div>
      </main>
    </div>
  );
};

export default App;