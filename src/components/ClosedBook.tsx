import { useState } from 'react';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL;

interface ClosedBookProps {
  coverSide: 'front' | 'back';
  transitionState: 'closed' | 'opening' | 'open' | 'closing' | 'flipping';
  onAnimationComplete: () => void;
  onClick?: () => void;
  dimensions: { width: number; height: number };
}

export default function ClosedBook({
  coverSide,
  transitionState,
  onAnimationComplete,
  onClick,
  dimensions,
}: ClosedBookProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFront = coverSide === 'front';
  const isOpen = transitionState === 'opening' || transitionState === 'open';
  const activeHover = isHovered && !!onClick;

  // Ao abrir, a capa gira 180° como uma porta no eixo da lombada
  const coverRotate = isOpen ? (isFront ? -180 : 180) : 0;
  const baseScale = isOpen ? 1.0 : 0.8;

  return (
    <motion.div
      className="relative flex items-center justify-center preserve-3d"
      style={{ width: dimensions.width, height: dimensions.height }}
      initial={false}
      animate={{
        rotateY: isFront ? 0 : 180,
        scale: activeHover ? 0.83 : baseScale,
        y: activeHover ? -15 : 0,
        rotateZ: activeHover ? [0, -1, 1, -0.6, 0.6, 0] : 0,
        rotateX: activeHover ? [0, 0.8, -0.8, 0.5, -0.5, 0] : 0,
        x: transitionState === 'open' ? '50%' : '0%',
      }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Miolo do livro */}
      <div
        className="absolute inset-0 preserve-3d rounded-r-2xl cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          pointerEvents: onClick ? 'auto' : 'none',
          boxShadow: activeHover ? '0 30px 40px rgba(0,0,0,0.8)' : '0 10px 15px rgba(0,0,0,0.4)',
        }}
      >
        {/* Página inicial revelada sob a capa ao abrir (pág 03 na frente, 18 no verso) */}
        <div className="absolute inset-0 bg-[#e6dcc3] border border-[#d4c49c] rounded-r-2xl pointer-events-none">
          <img
            src={`${BASE_URL}pages/page-${isFront ? '03' : '18'}.webp`}
            alt={isFront ? 'Página inicial de rosto' : 'Última página do livro'}
            className="w-full h-full object-fill opacity-90 mix-blend-multiply rounded-r-2xl"
            style={{ transform: isFront ? 'none' : 'scaleX(-1)' }}
          />
        </div>

        {/* Capa animada (abre como porta) */}
        <motion.div
          className="absolute inset-0 preserve-3d z-10"
          style={{ transformOrigin: isFront ? 'left' : 'right' }}
          initial={false}
          animate={{ rotateY: coverRotate }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Capa frontal */}
          <div
            className="absolute inset-0 preserve-3d bg-[#2a1a11] rounded-r-2xl border border-[#1a0f0a] backface-hidden"
            style={{ zIndex: isFront ? 2 : 1 }}
          >
            <img src={`${BASE_URL}pages/page-01.webp`} alt="Capa Frontal" className="w-full h-full object-cover rounded-r-2xl pointer-events-none" />
          </div>

          {/* Capa traseira */}
          <div
            className="absolute inset-0 preserve-3d bg-[#2a1a11] rounded-r-2xl border border-[#1a0f0a] backface-hidden"
            style={{ transform: 'rotateY(180deg)', zIndex: isFront ? 1 : 2 }}
          >
            <img src={`${BASE_URL}pages/page-20.webp`} alt="Capa Traseira" className="w-full h-full object-cover rounded-r-2xl pointer-events-none" />
          </div>

          {/* Verso interno da capa (visível após a rotação 180°) */}
          <div
            className="absolute inset-0 preserve-3d bg-[#e6dcc3] rounded-r-2xl border border-[#d4c49c] backface-hidden"
            style={{ transform: isFront ? 'rotateY(180deg)' : 'rotateY(0deg)', zIndex: 0 }}
          >
            <img src={`${BASE_URL}pages/page-${isFront ? '02' : '19'}.webp`} alt="Verso da Capa" className="w-full h-full object-cover rounded-r-2xl pointer-events-none" />
          </div>
        </motion.div>

        {/* Base do livro apoiada na mesa */}
        <div className="absolute inset-0 preserve-3d bg-[#2a1a11] border border-[#1a0f0a] rounded-r-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
