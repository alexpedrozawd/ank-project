import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ClosedBook from './ClosedBook';
import OpenBook from './OpenBook';

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

  // Inicializa trilha sonora e adiciona desbloqueio de autoplay no primeiro toque
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const unlock = () => {
      if (audio.paused && !audio.muted) audio.play().catch(() => {});
    };

    audio.play().catch(() => {
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !audioRef.current.muted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) audioRef.current.play().catch(() => {});
    }
  };

  // Mantém proporção A4 (0.707) adaptada à janela
  useEffect(() => {
    const updateDimensions = () => {
      const h = window.innerHeight * 0.85;
      const w = h * 0.707;
      const isMobile = window.innerWidth < 640;
      const maxWidth = isMobile ? window.innerWidth - 20 : window.innerWidth / 2 - 20;
      const maxHeight = window.innerHeight - 40;
      const finalWidth = Math.min(w, maxWidth);
      const finalHeight = finalWidth === w ? Math.min(h, maxHeight) : finalWidth / 0.707;
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
    setCoverSide(forceSide ?? (currentPage >= 14 ? 'back' : 'front'));
    setState('closing');
  };

  const handleFlipCover = () => {
    setState('flipping');
    setCoverSide((prev) => (prev === 'front' ? 'back' : 'front'));
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

  const isMobile = window.innerWidth < 640;
  const bookWidth = isMobile ? dimensions.width : dimensions.width * 2;
  const scaleFactor =
    isMaximized && dimensions.width > 0
      ? Math.min(window.innerWidth / bookWidth, window.innerHeight / dimensions.height) * 0.98
      : 1;

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[2000px] overflow-hidden">
      <audio ref={audioRef} src={`${BASE_URL}ankh-soundtrack.mp3`} loop />

      {/* Controles de Cabeçalho */}
      <nav className="absolute top-[1%] flex items-center gap-4 z-50 backdrop-blur-sm bg-black/20 px-6 py-2 rounded-full border border-amber-900/50 shadow-lg">
        {!isMaximized && (
          <>
            <button
              onClick={toggleMute}
              className="p-2 text-amber-500 hover:text-amber-400 transition-colors"
              title={isMuted ? 'Ativar Música' : 'Desativar Música'}
              aria-label={isMuted ? 'Ativar Música' : 'Desativar Música'}
            >
              <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                {isMuted ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>

            <div className="w-px h-6 bg-amber-900/50" />

            <div className="relative h-10 w-36 flex items-center justify-center">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: state === 'open' ? 1 : 0, pointerEvents: state === 'open' ? 'auto' : 'none' }}
                onClick={() => handleClose()}
                className="absolute inset-0 px-6 py-2 bg-amber-600/90 text-slate-900 border border-amber-800 rounded-full font-semibold shadow hover:bg-amber-500 transition-colors"
              >
                Fechar Livro
              </motion.button>

              <motion.button
                initial={{ opacity: 1 }}
                animate={{ opacity: state === 'closed' ? 1 : 0, pointerEvents: state === 'closed' ? 'auto' : 'none' }}
                onClick={handleFlipCover}
                className="absolute inset-0 px-6 py-2 bg-amber-600/90 text-slate-900 border border-amber-800 rounded-full font-semibold shadow hover:bg-amber-500 transition-colors"
              >
                Virar Livro
              </motion.button>
            </div>

            <div className="w-px h-6 bg-amber-900/50" />
          </>
        )}

        <button
          onClick={() => setIsMaximized((prev) => !prev)}
          disabled={state !== 'open'}
          className={`p-2 transition-all duration-500 rounded-full ${
            state === 'open'
              ? 'text-amber-400 hover:text-amber-200 scale-125 cursor-pointer'
              : 'text-gray-500/40 cursor-not-allowed scale-100'
          }`}
          style={{
            filter: state === 'open' ? 'drop-shadow(0 0 8px #f59e0b)' : 'none',
          }}
          title={isMaximized ? 'Restaurar Tamanho' : 'Expandir Livro'}
          aria-label={isMaximized ? 'Restaurar Tamanho' : 'Expandir Livro'}
        >
          <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
            {isMaximized ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20V14H3m12 6v-6h6M9 4v6H3m12-6v6h6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </nav>

      {/* Livro Fechado (Mesa e Transições) */}
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

      {/* Livro Aberto */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end pb-[1%] transition-all duration-700 ease-out origin-bottom"
        style={{
          opacity: state === 'open' ? 1 : 0,
          pointerEvents: state === 'open' ? 'auto' : 'none',
          zIndex: state === 'open' ? 10 : 0,
          transform: `scale(${scaleFactor})`,
        }}
      >
        {dimensions.width > 0 && (
          <OpenBook
            startSide={coverSide}
            dimensions={dimensions}
            onClose={handleClose}
            onPageChange={setCurrentPage}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
