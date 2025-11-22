import React from 'react';
import { LaptopIllustration } from './LaptopIllustration.tsx';
import { ActionButton } from './ActionButton.tsx';

interface CertificateSectionProps {
  highContrast?: boolean;
}

export const CertificateSection: React.FC<CertificateSectionProps> = ({ highContrast = false }) => {
  const titleClass = highContrast ? 'text-yellow-400' : 'text-[#005844]';
  const subtitleClass = highContrast ? 'text-yellow-200' : 'text-[#005844]';
  const textClass = highContrast ? 'text-white' : 'text-black';
  const strongClass = highContrast ? 'text-yellow-400 font-bold' : 'font-bold';

  return (
    <div className={`flex flex-col gap-6 font-sans ${highContrast ? 'text-white' : 'text-gray-800'}`}>
      {/* Sección título */}
      <div className="space-y-4">
        <h1 id="cert-title" tabIndex={0} className={`text-2xl md:text-[1.625rem] font-bold leading-tight transition-colors ${titleClass}`}>
          Certificados académicos en línea, a través del Portal Web Universitario
        </h1>
        
        <h2 tabIndex={0} className={`text-lg md:text-xl italic font-serif transition-colors ${subtitleClass}`}>
          Ahora puedes generar tus certificados académicos
        </h2>
      </div>

      {/* Contenido de texto con negritas específicas */}
      <section aria-labelledby="cert-title" tabIndex={0} className={`space-y-4 text-base leading-relaxed transition-colors ${textClass}`}>
        <p tabIndex={0}>
          Entre otros, puedes descargar e imprimir la <strong className={strongClass}>constancia de matrícula del semestre actual</strong>, el <strong className={strongClass}>certificado con el promedio de notas del último semestre, del semestre en curso</strong>, de los <strong className={strongClass}>créditos aprobados y los cancelados durante el semestre y durante el programa</strong>, y de las <strong className={strongClass}>horas de dedicación a la semana y durante el semestre académico</strong>.
        </p>
        <p tabIndex={0}>
          También puedes descargar el certificado para la <strong className={strongClass}>re-expedición de la TIP</strong>, el de afiliación al <strong className={strongClass}>Programa de Salud</strong> (en caso de que estés afiliado), la constancia de matrícula del semestre anterior, el promedio académico actual, y el promedio acumulado, entre otros certificados estudiantiles
        </p>
      </section>

      {/* Área de acciones */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-4 px-4 md:px-12">
        
        {/* Lado izquierdo: ilustración + botón */}
        <div className="flex items-center gap-4">
          <div className="shrink-0 -mb-2">
            <LaptopIllustration className={`w-24 h-24 md:w-32 md:h-32 ${highContrast ? 'opacity-90' : ''}`} />
          </div>
          <ActionButton text="Solicitar trámite" highContrast={highContrast} />
        </div>

        {/* Lado derecho: botón */}
        <div className="flex items-center">
             <ActionButton text="Consultar trámite" highContrast={highContrast} />
        </div>

      </div>
    </div>
  );
};