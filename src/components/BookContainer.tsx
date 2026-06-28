import { useState, useEffect, useRef } from 'react';
import ClosedBook from './ClosedBook';
import OpenBook from './OpenBook';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL;

export type BookState = 'closed' | 'opening' | 'open' | 'closing' | 'flipping';

export default function BookContainer() {
  const [state, setState] = useState<BookState>('closed');
  const [coverSide, setCoverSide] = useState<'front' | 'back'>('front');
  const [queuedState, setQueuedState] = useState<BookState | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);



  useEffect(() => {
    let interactionListenersActive = true;
    
    const removeListeners = () => {
      if (!interactionListenersActive) return;
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      interactionListenersActive = false;
    };

    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.play().then(() => {
          removeListeners();
        }).catch(() => {});
      }
    };

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => {
        // If autoplay works immediately, no need for listeners
        removeListeners();
      }).catch(() => {
        // Autoplay blocked, attach interaction listeners
        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);
      });
    }

    return () => {
      removeListeners();
    };
  }, [isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !audioRef.current.muted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
  };

  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight;
      const h = vh * 0.85;
      const w = h * 0.707;
      
      const isMobile = window.innerWidth < 640;
      const maxWidth = isMobile 
        ? window.innerWidth - 20
        : window.innerWidth / 2 - 20;
      const maxHeight = window.innerHeight - 40;

      const finalWidth = Math.min(w, maxWidth);
      const finalHeight = (finalWidth === w) ? Math.min(h, maxHeight) : (finalWidth / 0.707);

      setDimensions({ width: finalWidth, height: finalHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleOpen = () => {
    if (coverSide === 'back') {
      setCoverSide('front');
      setState('flipping');
      setQueuedState('opening');
    } else {
      setState('opening');
    }
  };

  const handleClose = (forceSide?: 'front' | 'back') => {
    if (typeof forceSide === 'string') {
      setCoverSide(forceSide);
    } else {
      setCoverSide(currentPage >= 14 ? 'back' : 'front');
    }
    setState('closing');
  };
  
  const handleFlipCover = () => {
    setState('flipping');
    setCoverSide(prev => prev === 'front' ? 'back' : 'front');
  };

  const onClosedBookAnimationComplete = () => {
    if (state === 'opening') {
      setState('open');
    } else if (state === 'closing' || state === 'flipping') {
      if (queuedState) {
        setState(queuedState);
        setQueuedState(null);
      } else {
        setState('closed');
      }
    }
  };

  let scaleFactor = 1;
  if (isMaximized && dimensions.width > 0) {
    const isMobile = window.innerWidth < 640;
    const currentBookWidth = isMobile ? dimensions.width : (dimensions.width * 2);
    const currentBookHeight = dimensions.height;
    
    // Scale maximo para caber na tela
    const scaleX = window.innerWidth / currentBookWidth;
    const scaleY = window.innerHeight / currentBookHeight;
    // 0.98 para nao colar completamente nas bordas
    scaleFactor = Math.min(scaleX, scaleY) * 0.98;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[2000px] overflow-hidden">

      
      <audio ref={audioRef} src={`${BASE_URL}ankh-soundtrack.mp3`} loop />

      {/* Header Buttons Container */}
      <div className="absolute top-[1%] flex items-center gap-4 z-50 backdrop-blur-sm bg-black/20 px-6 py-2 rounded-full border border-amber-900/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        <button
          onClick={toggleMute}
          className="p-2 text-amber-500 hover:text-amber-400 transition-colors"
          title={isMuted ? "Ativar Música" : "Desativar Música"}
          aria-label={isMuted ? "Ativar Música" : "Desativar Música"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <div className="w-px h-6 bg-amber-900/50" />

        <button
          onClick={toggleMaximize}
          disabled={state !== 'open'}
          className={`p-2 transition-all duration-700 ease-out rounded-full ${
            state === 'open' 
              ? 'text-amber-400 hover:text-amber-200 scale-125' 
              : 'text-gray-500/40 cursor-not-allowed scale-100'
          }`}
          style={{
            filter: state === 'open' ? 'drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 20px #f59e0b)' : 'none'
          }}
          title={isMaximized ? "Restaurar Tamanho" : "Expandir Livro"}
          aria-label={isMaximized ? "Restaurar Tamanho" : "Expandir Livro"}
        >
          {isMaximized ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20V14H3m12 6v-6h6M9 4v6H3m12-6v6h6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        <div className="w-px h-6 bg-amber-900/50" />

        <div className="relative h-10 w-36 flex items-center justify-center">
          {/* Botão de Fechar */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: state === 'open' ? 1 : 0, pointerEvents: state === 'open' ? 'auto' : 'none' }}
            onClick={() => handleClose()}
            className="absolute inset-0 px-6 py-2 bg-amber-600/90 text-slate-900 border border-amber-800 rounded-full font-semibold shadow-lg hover:bg-amber-500 transition-colors"
          >
            Fechar Livro
          </motion.button>

          {/* Botão de Virar */}
          <motion.button
            initial={{ opacity: 1 }}
            animate={{ opacity: state === 'closed' ? 1 : 0, pointerEvents: state === 'closed' ? 'auto' : 'none' }}
            onClick={handleFlipCover}
            className="absolute inset-0 px-6 py-2 bg-amber-600/90 text-slate-900 border border-amber-800 rounded-full font-semibold shadow-lg hover:bg-amber-500 transition-colors"
          >
            Virar Livro
          </motion.button>
        </div>
      </div>

      {/* Livro Fechado (usado para capa e animação de transição) */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-end pb-[1%] pointer-events-none"
        style={{ opacity: state === 'open' ? 0 : 1, zIndex: state === 'open' ? 0 : 10 }}
      >
        <ClosedBook 
          coverSide={coverSide}
          transitionState={state}
          onAnimationComplete={onClosedBookAnimationComplete}
          onClick={state === 'closed' ? handleOpen : undefined}
          dimensions={dimensions}
        />
      </div>

      {/* Livro Aberto (react-pageflip) */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-out origin-center"
        style={{ 
          opacity: state === 'open' ? 1 : 0, 
          pointerEvents: state === 'open' ? 'auto' : 'none',
          zIndex: state === 'open' ? 10 : 0,
          transform: `scale(${scaleFactor})`
        }}
      >
        {/* Renderizamos sempre para não perder estado, mas só interage quando open */}
        {dimensions.width > 0 && (
          <OpenBook 
            startSide={coverSide} 
            dimensions={dimensions} 
            onClose={handleClose} 
            onPageChange={setCurrentPage}
            isMobile={window.innerWidth < 640}
          />
        )}
      </div>

    </div>
  );
}
