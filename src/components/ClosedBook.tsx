import { motion } from 'framer-motion';
import { useState } from 'react';

const BASE_URL = import.meta.env.BASE_URL;

interface ClosedBookProps {
  coverSide: 'front' | 'back';
  transitionState: 'closed' | 'opening' | 'open' | 'closing' | 'flipping';
  onAnimationComplete: () => void;
  onClick?: () => void;
  dimensions: { width: number; height: number };
}

export default function ClosedBook({ coverSide, transitionState, onAnimationComplete, onClick, dimensions }: ClosedBookProps) {
  
  const isFront = coverSide === 'front';

  // O container inteiro faz o zoom e vira (flip 180 no eixo Y)
  // Quando a capa é frontal, rotateY = 0. Quando é verso, rotateY = 180.
  // Quando transitionState for 'flipping', animamos o rotateY.
  
  // O scale do zoom:
  const scale = (transitionState === 'opening' || transitionState === 'open') ? 1.0 : 0.8;
  
  // A capa individual (front ou back) que vai "abrir" como uma porta:
  let coverRotate = 0;
  if (transitionState === 'opening' || transitionState === 'open') {
    coverRotate = isFront ? -180 : 180;
  }

  // Animation durations
  const duration = 0.8;
  const [isHovered, setIsHovered] = useState(false);
  const activeHover = isHovered && !!onClick;

  return (
    <motion.div
      className="relative flex items-center justify-center preserve-3d"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      initial={false}
      animate={{
        rotateY: isFront ? 0 : 180,
        scale: activeHover ? 0.83 : scale,
        y: activeHover ? -15 : 0,
        rotateZ: activeHover ? [0, -1, 1, -0.6, 0.6, -0.2, 0.2, 0] : 0,
        rotateX: activeHover ? [0, 0.8, -0.8, 0.5, -0.5, 0.2, -0.2, 0] : 0,
        x: transitionState === 'open' ? '50%' : '0%',
      }}
      transition={{
        rotateZ: { duration: activeHover ? 0.7 : 0.8, ease: "easeInOut" },
        rotateX: { duration: activeHover ? 0.7 : 0.8, ease: "easeInOut" },
        scale: { duration: activeHover ? 0.7 : 0.8, ease: "easeOut" },
        y: { duration: activeHover ? 0.7 : 0.8, ease: "easeOut" },
        x: { duration: 0.8, ease: "easeInOut" },
        rotateY: { duration: 0.8, ease: "easeInOut" }
      }}
      onAnimationComplete={onAnimationComplete}
    >
      
      {/* Bloco de páginas (miolo do livro) */}
      <div 
        className="absolute inset-0 preserve-3d transition-shadow duration-700 rounded-r-2xl"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          pointerEvents: onClick ? 'auto' : 'none', 
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: activeHover ? '0px 30px 40px rgba(0,0,0,0.8)' : '0px 10px 15px rgba(0,0,0,0.4)'
        }}
      >
        {/* Lado de cima do miolo (visível se olharmos de cima) */}
        <div className="absolute inset-0 bg-[#e6dcc3] border border-[#d4c49c] rounded-r-2xl pointer-events-none">
           {/* Imagem da página interna revelada durante a transição */}
           <img 
              src={isFront ? `${BASE_URL}pages/page-03.webp` : `${BASE_URL}pages/page-18.webp`} 
              alt={isFront ? "Página inicial de rosto" : "Última página do livro"}
              className="w-full h-full object-fill opacity-90 mix-blend-multiply rounded-r-2xl"
              style={{ transform: isFront ? 'none' : 'scaleX(-1) translateX(0%)' }}
           />
        </div>

        {/* Capa animada (abre como porta) */}
        <motion.div 
          className="absolute inset-0 preserve-3d z-10"
          style={{ 
            transformOrigin: isFront ? 'left' : 'right',
          }}
          initial={false}
          animate={{ rotateY: coverRotate }}
          transition={{ duration, ease: "easeInOut" }}
        >
          {/* Capa frontal e traseira dentro do container animado */}
          <div className="absolute inset-0 preserve-3d bg-[#2a1a11] rounded-r-2xl shadow-lg border border-[#1a0f0a]" style={{ backfaceVisibility: 'hidden', zIndex: isFront ? 2 : 1 }}>
            <img 
              src={`${BASE_URL}pages/page-01.webp`} 
              alt="Capa Frontal do Livro"
              className="w-full h-full object-cover pointer-events-none rounded-r-2xl"
            />
          </div>

          <div className="absolute inset-0 preserve-3d bg-[#2a1a11] rounded-r-2xl shadow-lg border border-[#1a0f0a]" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', zIndex: isFront ? 1 : 2 }}>
            <img 
              src={`${BASE_URL}pages/page-20.webp`} 
              alt="Capa Traseira do Livro"
              className="w-full h-full object-cover pointer-events-none rounded-r-2xl"
            />
          </div>
          
          {/* Verso da capa (a parte de dentro que fica visível quando a capa abre) */}
          <div className="absolute inset-0 preserve-3d bg-[#e6dcc3] rounded-r-2xl shadow-inner border border-[#d4c49c]" style={{ transform: isFront ? 'rotateY(180deg)' : 'rotateY(0deg)', backfaceVisibility: 'hidden', zIndex: 0 }}>
             <img 
               src={isFront ? `${BASE_URL}pages/page-02.webp` : `${BASE_URL}pages/page-19.webp`}
               alt="Verso Interno da Capa"
               className="w-full h-full object-cover pointer-events-none rounded-r-2xl"
             />
          </div>
        </motion.div>

        {/* Capa estática (o lado que fica na mesa) */}
        {!isFront ? (
          <div className="absolute inset-0 preserve-3d bg-[#2a1a11] border border-[#1a0f0a] rounded-r-2xl pointer-events-none">
            {/* Front cover face down */}
          </div>
        ) : (
          <div className="absolute inset-0 preserve-3d bg-[#2a1a11] border border-[#1a0f0a] rounded-r-2xl pointer-events-none">
            {/* Back cover face down */}
          </div>
        )}

      </div>
    </motion.div>
  );
}
