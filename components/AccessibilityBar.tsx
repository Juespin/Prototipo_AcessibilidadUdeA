import React, { useState, useRef, useEffect } from 'react';

interface AccessibilityBarProps {
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  onSetFontSize?: (size: 'mediano' | 'grande' | 'muyGrande' | 'extraGrande') => void;
  onSetBrightness?: (level: 'muyBajo' | 'bajo' | 'medio' | 'alto' | 'muyAlto') => void;
  onToggleDyslexic?: (enabled: boolean) => void;
  onToggleContrast: () => void;
  onReset: () => void;
  highContrast: boolean;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  onIncreaseFont,
  onDecreaseFont,
  onSetBrightness,
  onToggleDyslexic,
  onSetFontSize,
  onToggleContrast,
  onReset,
  highContrast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<'mediano' | 'grande' | 'muyGrande' | 'extraGrande'>('mediano');
  const [brightness, setBrightness] = useState<'muyBajo' | 'bajo' | 'medio' | 'alto' | 'muyAlto'>('medio');
  const [dyslexic, setDyslexic] = useState<boolean>(false);
  const [magnifier, setMagnifier] = useState<boolean>(false);
  const [readingRuler, setReadingRuler] = useState<boolean>(false);
  const [rulerHeight, setRulerHeight] = useState<number>(36); // px

  const handleSetFontSize = (size: 'mediano' | 'grande' | 'muyGrande' | 'extraGrande') => {
    setFontSize(size);
    if (onSetFontSize) {
      onSetFontSize(size);
      return;
    }
    // Fallback si el padre no implementa `onSetFontSize`:
    // Ajustar `font-size` raíz para reflejar el cambio.
    if (typeof document !== 'undefined' && document.documentElement) {
      const map: Record<string, string> = {
        mediano: '100%',
        grande: '110%',
        muyGrande: '120%',
        extraGrande: '140%'
      };
      const val = map[size] ?? '100%';
      document.documentElement.style.fontSize = val;
      return;
    }
  };

  const handleSetBrightness = (level: 'muyBajo' | 'bajo' | 'medio' | 'alto' | 'muyAlto') => {
    setBrightness(level);
    if (typeof onSetBrightness === 'function') {
      onSetBrightness(level);
      return;
    }
    // Fallback: aplicar filtro de brillo global en root si no hay handler.
    // Afecta toda la página; usar valores modestos.
    if (typeof document !== 'undefined' && document.documentElement) {
      const map: Record<string, number> = { muyBajo: 0.7, bajo: 0.85, medio: 1, alto: 1.15, muyAlto: 1.3 };
      const val = map[level] ?? 1;
      document.documentElement.style.transition = 'filter 150ms ease';
      document.documentElement.style.filter = `brightness(${val})`;
    }
  };

  const handleToggleDyslexic = (enabled?: boolean) => {
    const next = typeof enabled === 'boolean' ? enabled : !dyslexic;
    setDyslexic(next);
    if (typeof onToggleDyslexic === 'function') {
      onToggleDyslexic(next);
      return;
    }
    // Fallback: alternar la clase 'dyslexic-font' en root; la app debe proveer la fuente.
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.toggle('dyslexic-font', next);
    }
  };

  // Lupa: crea un elemento en body que sigue el cursor.
  useEffect(() => {
    if (!magnifier) return;
    if (typeof document === 'undefined') return;

    let cancelled = false;
    const lensSize = 220; // px
    const zoom = 1.8;

    const container = document.createElement('div');
    container.className = 'accessibility-magnifier';
    Object.assign(container.style, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      pointerEvents: 'none',
      zIndex: '99999',
      transform: 'translate(-50%, -50%)',
      border: '3px solid rgba(255,255,255,0.9)',
      backgroundColor: 'transparent'
    });

    const inner = document.createElement('div');
    Object.assign(inner.style, {
      transformOrigin: '0 0',
      position: 'absolute',
      left: '0px',
      top: '0px'
    });

    container.appendChild(inner);
    document.body.appendChild(container);

    const loadHtml2Canvas = (): Promise<any> => {
      if ((window as any).html2canvas) return Promise.resolve((window as any).html2canvas);
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        s.onload = () => resolve((window as any).html2canvas);
        s.onerror = reject;
        document.head.appendChild(s);
      });
    };

    const takeSnapshot = async () => {
      try {
        const html2canvas = await loadHtml2Canvas();
        if (cancelled) return;
        // Preferir snapshot de <main> si existe (mejor rendimiento)
        const target = document.querySelector('main') || document.body;
        const canvas = await html2canvas(target as HTMLElement, { backgroundColor: null, scale: window.devicePixelRatio || 1 });
        if (cancelled) return;
        // Usar el canvas generado dentro de la lupa
        // Limpiar hijos previos
        inner.innerHTML = '';
        // Ensure the canvas is not interactive
        canvas.style.pointerEvents = 'none';
        canvas.style.position = 'absolute';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        inner.appendChild(canvas);

        const onMove = (e: MouseEvent) => {
          const x = e.clientX;
          const y = e.clientY;
          container.style.left = `${x}px`;
          container.style.top = `${y}px`;
          const translateX = -(x * zoom) + lensSize / 2;
          const translateY = -(y * zoom) + lensSize / 2;
          inner.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoom})`;
        };

        window.addEventListener('mousemove', onMove);

        const onResize = () => {
            // volver a capturar en resize para mejor fidelidad
          takeSnapshot();
        };
        window.addEventListener('resize', onResize);

        // manejador de limpieza
        const cleanup = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('resize', onResize);
        };

        // Cuando se apaga la lupa, limpiar listeners
        const observer = new MutationObserver(() => {
          if (!magnifier) {
            cleanup();
            observer.disconnect();
          }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
      } catch (err) {
        // Si falla la captura, quitar el contenedor y desactivar la lupa
        if (container.parentNode) container.parentNode.removeChild(container);
        setMagnifier(false);
        console.error('Magnifier snapshot failed', err);
      }
    };

    takeSnapshot();

    return () => {
      cancelled = true;
      if (container.parentNode) container.parentNode.removeChild(container);
    };
  }, [magnifier]);

  // Regla de lectura: barra horizontal que sigue la posición Y del puntero.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let ruler: HTMLDivElement | null = null;
    const onMove = (e: MouseEvent) => {
      if (!ruler) return;
      const y = e.clientY;
      ruler.style.top = `${y}px`;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!ruler) return;
      const t = e.touches[0];
      if (!t) return;
      ruler.style.top = `${t.clientY}px`;
    };

    if (readingRuler) {
      ruler = document.createElement('div');
      ruler.id = 'reading-ruler';
      Object.assign(ruler.style, {
        position: 'fixed',
        left: '0px',
        width: '100%',
        height: `${rulerHeight}px`,
        background: '#e5ff00ff', // dark green
        opacity: '0.5',
        pointerEvents: 'none',
        zIndex: '99998',
        transform: 'translateY(-50%)',
        transition: 'top 60ms linear',
      } as Partial<CSSStyleDeclaration>);

      document.body.appendChild(ruler);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true } as AddEventListenerOptions);
    }

    return () => {
      if (ruler && ruler.parentNode) ruler.parentNode.removeChild(ruler);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
    };
  }, [readingRuler, rulerHeight]);

  const cycleBrightness = () => {
    const order: Array<'muyBajo' | 'bajo' | 'medio' | 'alto' | 'muyAlto'> = ['muyBajo', 'bajo', 'medio', 'alto', 'muyAlto'];
    const idx = order.indexOf(brightness as any);
    const next = order[(idx + 1) % order.length];
    handleSetBrightness(next);
  };

  const cycleFontSize = () => {
    const order: Array<'mediano' | 'grande' | 'muyGrande' | 'extraGrande'> = ['mediano', 'grande', 'muyGrande', 'extraGrande'];
    const idx = order.indexOf(fontSize);
    const next = order[(idx + 1) % order.length];
    handleSetFontSize(next);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full border-b ${highContrast ? 'bg-gray-900 border-gray-700 text-yellow-400' : 'bg-gray-100 border-gray-200 text-gray-600'} transition-colors duration-300 relative z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-end">
        <div className="relative" ref={menuRef}>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide hover:underline focus:outline-none ${highContrast ? 'text-yellow-400' : 'text-gray-600'}`}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            
            <span className="ml-1 inline-flex items-center gap-x-2">
              <img src="/assets/accesibilidad.png" alt="" aria-hidden="true" className="ml-2 h-10 w-10 object-contain" />
              Herramientas de accesibilidad              
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 py-1 focus:outline-none transform origin-top-right transition-all ${highContrast ? 'bg-gray-800 border border-gray-600' : 'bg-white'}`}>
              
                
                <div className="px-4 py-2 text-xs font-semibold">Restablecer opciones</div>
                <button
                  onClick={() => {
                    // restablecer estado interno
                    setFontSize('mediano');
                    setBrightness('medio');
                    setDyslexic(false);
                    // limpiar brillo de fallback si el padre no lo maneja
                    if (typeof onSetBrightness !== 'function' && typeof document !== 'undefined' && document.documentElement) {
                      document.documentElement.style.filter = '';
                    }
                    // quitar clase disléxica de fallback si el padre no la maneja
                    if (typeof onToggleDyslexic !== 'function' && typeof document !== 'undefined' && document.documentElement) {
                      document.documentElement.classList.remove('dyslexic-font');
                    }
                    // notificar al padre del restablecimiento
                    onReset();
                    // si el padre tiene onToggleDyslexic, notificar que está deshabilitado
                    if (typeof onToggleDyslexic === 'function') {
                      onToggleDyslexic(false);
                    }
                  }}
                  className={`group flex w-full items-center px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    <div className="mr-3 w-6 flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    Restablecer
                </button>

                <div className="px-4 py-2 text-xs font-semibold">Selección de contraste</div>
              
                <button
                  onClick={onToggleContrast}
                  className={`group flex w-full items-center px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="mr-3 w-6 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                  </div>
                  {highContrast ? 'Vista normal' : 'Alto contraste'}
                </button>

                  <div className="px-4 py-2 text-xs font-semibold">Fuente</div>
                  <div className="px-3">
                    <button
                      onClick={() => handleToggleDyslexic()}
                      aria-pressed={dyslexic}
                      className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="mr-3 w-8 text-center flex-shrink-0" aria-hidden="true">Aa</span>
                        <span className="capitalize">{dyslexic ? 'Fuente disléxica activada' : 'Fuente disléxica desactivada'}</span>
                      </div>
                      <div className="flex items-center">
                        {dyslexic && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd"/></svg>}
                      </div>
                    </button>
                  </div>

                <div className="px-4 py-2 text-xs font-semibold">Tamaño de letra</div>
                <div className="px-3">

                <button
                  onClick={cycleFontSize}
                  aria-label={`Cambiar tamaño de letra (actual: ${fontSize})`}
                  className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="mr-3 font-serif font-bold w-12 text-center flex-shrink-0" aria-hidden="true">
                      {fontSize === 'mediano' && <span className="text-base leading-none">A</span>}
                      {fontSize === 'grande' && <span className="text-lg leading-none">A+</span>}
                      {fontSize === 'muyGrande' && <span className="text-xl leading-none">A++</span>}
                      {fontSize === 'extraGrande' && <span className="text-2xl leading-none">A+++</span>}
                    </span>
                    <span className="capitalize whitespace-nowrap">
                      {fontSize === 'mediano' && 'Mediano'}
                      {fontSize === 'grande' && 'Grande'}
                      {fontSize === 'muyGrande' && 'Muy grande'}
                      {fontSize === 'extraGrande' && 'Extra grande'}
                    </span>
                  </div>
                </button>
              </div>
              <div className="px-4 py-2 text-xs font-semibold">Brillo</div>
              <div className="px-3">
                <button
                  onClick={cycleBrightness}
                  aria-label={`Cambiar brillo (actual: ${brightness})`}
                  className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="mr-3 w-12 text-center flex-shrink-0" aria-hidden="true">
                      {brightness === 'muyBajo' && <span className="text-xs">☀︎ - -</span>}
                      {brightness === 'bajo' && <span className="text-sm">☀︎ - </span>}
                      {brightness === 'medio' && <span className="text-base">☀︎</span>}
                      {brightness === 'alto' && <span className="text-lg">☀︎ +</span>}
                      {brightness === 'muyAlto' && <span className="text-xl">☀︎ ++</span>}
                    </span>
                    <span className="capitalize whitespace-nowrap">
                      {brightness === 'muyBajo' && 'Muy bajo'}
                      {brightness === 'bajo' && 'Bajo'}
                      {brightness === 'medio' && 'Medio'}
                      {brightness === 'alto' && 'Alto'}
                      {brightness === 'muyAlto' && 'Muy alto'}
                    </span>
                  </div>
                </button>
              </div>
                <div className={`h-px mx-2 ${highContrast ? 'bg-gray-600' : 'bg-gray-100'}`}></div>

                <div className="px-4 py-2 text-xs font-semibold">Lupa</div>
                <div className="px-3">
                  <button
                    onClick={() => setMagnifier(prev => !prev)}
                    aria-pressed={magnifier}
                    className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="mr-3 w-8 text-center flex-shrink-0" aria-hidden="true">🔍</span>
                    </div>
                    <div>{magnifier ? 'Activada' : 'Desactivada'}</div>
                  </button>
                </div>
                <div className={`h-px mx-2 ${highContrast ? 'bg-gray-600' : 'bg-gray-100'}`}></div>

                <div className="px-4 py-2 text-xs font-semibold">Regla de lectura</div>
                <div className="px-3">
                  <button
                    onClick={() => setReadingRuler(prev => !prev)}
                    aria-pressed={readingRuler}
                    className={`group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors ${highContrast ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="mr-3 w-8 text-center flex-shrink-0" aria-hidden="true">▁▁</span>
                    </div>
                    <div>{readingRuler ? 'Activada' : 'Desactivada'}</div>
                  </button>
                </div>
              <div className={`h-px mx-2 ${highContrast ? 'bg-gray-600' : 'bg-gray-100'}`}></div>
              
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};