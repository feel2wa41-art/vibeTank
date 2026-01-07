import { useEffect, useRef, useState, useCallback } from 'react';

// Scroll speed multiplier - increase for faster horizontal scrolling
const SCROLL_SPEED_MULTIPLIER = 2.5;

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
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const targetScrollLeft = targetPage * pageWidth;

      containerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });

      // Update all state immediately for smooth tank movement
      setCurrentPage(targetPage);
      const targetProgress = maxScroll > 0 ? (targetScrollLeft / maxScroll) * 100 : 0;
      setProgress(targetProgress);
      setScrollX(targetScrollLeft);
      setTankX(50 + (targetProgress / 100) * (window.innerWidth - 200));
    }
  }, []);

  const scrollNext = useCallback(() => {
    scrollToPage(currentPage + 1);
  }, [currentPage, scrollToPage]);

  const scrollPrev = useCallback(() => {
    scrollToPage(currentPage - 1);
  }, [currentPage, scrollToPage]);

  // Helper function to find scrollable parent element
  const findScrollableParent = useCallback((element: HTMLElement | null): HTMLElement | null => {
    while (element && element !== containerRef.current) {
      const { scrollHeight, clientHeight } = element;
      const hasVerticalScroll = scrollHeight > clientHeight;
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;

      if (hasVerticalScroll && (overflowY === 'auto' || overflowY === 'scroll')) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Check if the target or its parent is a vertically scrollable element
    const target = e.target as HTMLElement;
    const scrollableParent = findScrollableParent(target);

    if (scrollableParent) {
      // Check if we can scroll vertically within the element
      const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Allow vertical scroll if not at boundaries
      if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
        // Let the vertical scroll happen naturally
        return;
      }
    }

    // Prevent default and do horizontal scroll
    e.preventDefault();

    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY * SCROLL_SPEED_MULTIPLIER;
      updateProgress();
    }
  }, [updateProgress, findScrollableParent]);

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
