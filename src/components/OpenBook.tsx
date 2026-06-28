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

const TOTAL_PAGES = 16; 
// 16 pages = 8 spreads
const pageNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18];

const pages = pageNumbers.map(num => {
  const padded = num.toString().padStart(2, '0');
  return `${BASE_URL}pages/page-${padded}.webp`;
});

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

  const handlePageClick = (isLeft: boolean) => {
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      const current = pageFlip.getCurrentPageIndex();
      
      if (isLeft && current === 0) {
        onClose('front');
      } else if (!isLeft && current >= TOTAL_PAGES - 2) {
        onClose('back');
      }
    }
  };

  useEffect(() => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      if (startSide === 'back') {
        // Go to last spread instantly if possible
        bookRef.current.pageFlip().turnToPage(TOTAL_PAGES - 2);
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
          {pages.map((url, i) => (
            <Page key={i} index={i} imageUrl={url} onClickPage={handlePageClick} />
          ))}
        </HTMLFlipBook>
      </div>
    </motion.div>
  );
}
