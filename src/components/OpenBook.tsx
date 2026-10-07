import React, { useRef, useEffect } from 'react';
import HTMLFlipBookType from 'react-pageflip';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL;

interface IPageFlip {
  turnToPage(page: number): void;
  getCurrentPageIndex(): number;
  flipPrev(): void;
  flipNext(): void;
}

interface IFlipBook {
  pageFlip(): IPageFlip;
}

const HTMLFlipBook = HTMLFlipBookType as unknown as React.ElementType;

interface OpenBookProps {
  startSide: 'front' | 'back';
  dimensions: { width: number; height: number };
  onClose: (side: 'front' | 'back') => void;
  onPageChange?: (current: number) => void;
  isMobile?: boolean;
}

// Sequência do miolo (16 páginas = 8 spreads; divisores 02 e 18 ocultados em telas pequenas)
const PAGE_NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18];

const Page = React.forwardRef<
  HTMLDivElement,
  { imageUrl: string; index: number; onClickPage: (isLeft: boolean) => void }
>(({ imageUrl, index, onClickPage }, ref) => {
  const isLeft = index % 2 === 0;
  const rounded = isLeft ? 'rounded-l-2xl' : 'rounded-r-2xl';
  return (
    <div
      ref={ref}
      data-density="soft"
      className={`page bg-white cursor-pointer ${rounded}`}
      onClick={() => onClickPage(isLeft)}
    >
      <img
        src={imageUrl}
        alt={`Página ${index + 2}`}
        className={`w-full h-full object-fill pointer-events-none select-none ${rounded}`}
        loading={index > 3 ? 'lazy' : 'eager'}
      />
      <div className="sr-only">{`Texto da página ${index + 2}`}</div>
    </div>
  );
});

export default function OpenBook({ startSide, dimensions, onClose, onPageChange, isMobile }: OpenBookProps) {
  const bookRef = useRef<IFlipBook>(null);

  const activePages = isMobile
    ? PAGE_NUMBERS.filter((n) => n !== 2 && n !== 18)
    : PAGE_NUMBERS;
  const total = activePages.length;

  const handlePageClick = (isLeft: boolean) => {
    const pf = bookRef.current?.pageFlip();
    if (!pf) return;
    const current = pf.getCurrentPageIndex();
    if (isLeft && current === 0) onClose('front');
    else if (!isLeft && current >= total - (isMobile ? 1 : 2)) onClose('back');
  };

  useEffect(() => {
    const pf = bookRef.current?.pageFlip();
    if (pf) {
      pf.turnToPage(startSide === 'back' ? total - (isMobile ? 1 : 2) : 0);
    }
  }, [startSide, total, isMobile]);

  if (!dimensions.width) return null;

  return (
    <motion.div
      className="relative perspective-[2000px]"
      style={{ width: isMobile ? dimensions.width : dimensions.width * 2, height: dimensions.height }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
    >
      <div className="relative shadow-2xl w-full h-full">
        <HTMLFlipBook
          ref={bookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          showCover={false}
          mobileScrollSupport={true}
          className="demo-book"
          usePortrait={isMobile}
          onFlip={(e: { data: number }) => onPageChange?.(e.data)}
        >
          {activePages.map((num, i) => (
            <Page
              key={num}
              index={i}
              imageUrl={`${BASE_URL}pages/page-${num.toString().padStart(2, '0')}.webp`}
              onClickPage={handlePageClick}
            />
          ))}
        </HTMLFlipBook>

        {/* Setas de Navegação */}
        <button
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className={`absolute z-50 p-2 text-amber-500/60 hover:text-amber-400 drop-shadow transition-colors ${
            isMobile ? 'bottom-4 left-4 scale-75' : 'top-1/2 -translate-y-1/2 -left-16 scale-125'
          }`}
          aria-label="Página Anterior"
        >
          <svg className="h-10 w-10 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className={`absolute z-50 p-2 text-amber-500/60 hover:text-amber-400 drop-shadow transition-colors ${
            isMobile ? 'bottom-4 right-4 scale-75' : 'top-1/2 -translate-y-1/2 -right-16 scale-125'
          }`}
          aria-label="Próxima Página"
        >
          <svg className="h-10 w-10 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
