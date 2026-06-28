import React, { useRef, useEffect } from 'react';
import HTMLFlipBookType from 'react-pageflip';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL;

interface IPageFlip {
  turnToPage(page: number): void;
  getCurrentPageIndex(): number;
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

const pageNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18];

const Page = React.forwardRef<HTMLDivElement, { imageUrl: string, index: number, onClickPage: (isLeft: boolean) => void }>((props, ref) => {
  const roundedClass = props.index % 2 === 0 ? 'rounded-l-2xl' : 'rounded-r-2xl';
  return (
    <div 
      className={`page bg-white cursor-pointer ${roundedClass}`} 
      ref={ref} 
      data-density="soft"
      onClick={() => props.onClickPage(props.index % 2 === 0)}
    >
      <img 
        src={props.imageUrl} 
        alt={`Conteúdo da página ${props.index + 2}`} 
        className={`w-full h-full object-fill pointer-events-none select-none ${roundedClass}`}
        loading={props.index > 3 ? "lazy" : "eager"}
      />
      <div className="sr-only">{`Texto legível da página ${props.index + 2} para acessibilidade`}</div>
    </div>
  );
});

export default function OpenBook({ startSide, dimensions, onClose, onPageChange, isMobile }: OpenBookProps) {
  const bookRef = useRef<IFlipBook>(null);

  const renderPageNumbers = isMobile 
    ? pageNumbers.filter(num => num !== 2 && num !== 18) 
    : pageNumbers;
    
  const currentTotalPages = renderPageNumbers.length;

  const renderPages = renderPageNumbers.map(num => {
    const padded = num.toString().padStart(2, '0');
    return `${BASE_URL}pages/page-${padded}.webp`;
  });

  const handlePageClick = (isLeft: boolean) => {
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      const current = pageFlip.getCurrentPageIndex();
      
      if (isLeft && current === 0) {
        onClose('front');
      } else if (!isLeft && current >= currentTotalPages - (isMobile ? 1 : 2)) {
        onClose('back');
      }
    }
  };

  const flipPrev = () => bookRef.current?.pageFlip().flipPrev();
  const flipNext = () => bookRef.current?.pageFlip().flipNext();

  useEffect(() => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      if (startSide === 'back') {
        // Go to last page/spread instantly if possible
        bookRef.current.pageFlip().turnToPage(currentTotalPages - (isMobile ? 1 : 2));
      } else {
        bookRef.current.pageFlip().turnToPage(0);
      }
    }
  }, [startSide]);

  if (dimensions.width === 0) return null;

  return (
    <motion.div 
      className="relative perspective-[2000px]"
      style={{ width: isMobile ? dimensions.width : dimensions.width * 2, height: dimensions.height }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
    >
      {/* Container do livro aberto com largura total fixa baseada na página */}
      <div 
        className="relative shadow-2xl w-full h-full" 
      >
        <HTMLFlipBook 
          width={dimensions.width} 
          height={dimensions.height} 
          size="fixed"
          showCover={false}
          mobileScrollSupport={true}
          className="demo-book"
          ref={bookRef}
          usePortrait={isMobile}
          onFlip={(e: { data: number }) => onPageChange && onPageChange(e.data)}
        >
          {renderPages.map((url, i) => (
            <Page key={i} index={i} imageUrl={url} onClickPage={handlePageClick} />
          ))}
        </HTMLFlipBook>

        {/* Setas de Navegação */}
        <button 
          onClick={flipPrev}
          className={`absolute z-50 p-2 text-amber-500/50 hover:text-amber-400/80 transition-colors drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] ${
            isMobile 
              ? 'bottom-4 left-4 scale-75' 
              : 'top-1/2 -translate-y-1/2 -left-16 scale-125'
          }`}
          aria-label="Página Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={flipNext}
          className={`absolute z-50 p-2 text-amber-500/50 hover:text-amber-400/80 transition-colors drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] ${
            isMobile 
              ? 'bottom-4 right-4 scale-75' 
              : 'top-1/2 -translate-y-1/2 -right-16 scale-125'
          }`}
          aria-label="Próxima Página"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
