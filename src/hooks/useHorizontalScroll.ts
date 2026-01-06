import { useEffect, useRef, useState, useCallback } from 'react';

export function useHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tankX, setTankX] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);

  const updateProgress = useCallback(() => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const currentProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

      setScrollX(scrollLeft);
      setProgress(currentProgress);
      setTankX(50 + (currentProgress / 100) * (window.innerWidth - 200));

      // Calculate current page
      const pageWidth = window.innerWidth;
      setCurrentPage(Math.round(scrollLeft / pageWidth));
    }
  }, []);

  const scrollToPage = useCallback((pageIndex: number) => {
    if (containerRef.current) {
      const pageWidth = window.innerWidth;
      const totalPages = Math.ceil(containerRef.current.scrollWidth / pageWidth);
      const targetPage = Math.max(0, Math.min(pageIndex, totalPages - 1));

      containerRef.current.scrollTo({
        left: targetPage * pageWidth,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollNext = useCallback(() => {
    scrollToPage(currentPage + 1);
  }, [currentPage, scrollToPage]);

  const scrollPrev = useCallback(() => {
    scrollToPage(currentPage - 1);
  }, [currentPage, scrollToPage]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY;
      updateProgress();
    }
  }, [updateProgress]);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('scroll', updateProgress);
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('scroll', updateProgress);
      };
    }
  }, [handleWheel, updateProgress]);

  return { containerRef, scrollX, progress, tankX, currentPage, scrollNext, scrollPrev, scrollToPage };
}
