import React from 'react';

interface IllustrationProps {
  className?: string;
  /** Opcional: ruta de imagen para reemplazar la predeterminada */
  src?: string;
  /** Texto accesible opcional. Si está vacío la imagen es decorativa. */
  alt?: string;
}

export const LaptopIllustration: React.FC<IllustrationProps> = ({ className, src = '/assets/laptop.png', alt = '' }) => {
  const combinedClass = className ? `${className} object-contain` : 'object-contain';

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === ''}
      className={combinedClass}
    />
  );
};