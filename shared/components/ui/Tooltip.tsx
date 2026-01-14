
import React, { useState, useRef, useId, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  side = 'top', 
  className = '',
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const tooltipId = useId();

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const gap = 12; 

      let top = 0;
      let left = 0;

      switch (side) {
        case 'top':
          top = rect.top + scrollY - gap;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + scrollY + gap;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'left':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - gap;
          break;
        case 'right':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + gap;
          break;
      }
      
      setCoords({ top, left });
    }
  }, [side]);

  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
      const options = { passive: true };
      window.addEventListener('scroll', updatePosition, options);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  const transformClass = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2'
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className={`inline-block outline-none focus-within:ring-2 focus-within:ring-blue-500/20 rounded-lg ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div 
          id={tooltipId}
          role="tooltip"
          style={{ 
            top: coords.top, 
            left: coords.left,
            position: 'absolute'
          }}
          className={`
            z-[9999] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-100 bg-slate-900 border border-slate-700
            rounded-2xl shadow-2xl pointer-events-none animate-fadeIn whitespace-nowrap backdrop-blur-xl bg-opacity-95
            ${transformClass[side]}
          `}
        >
          {content}
          <div className={`absolute w-2.5 h-2.5 bg-slate-900 border-slate-700 rotate-45 transform
            ${side === 'top' ? 'border-r border-b bottom-[-5px] left-1/2 -translate-x-1/2' : ''}
            ${side === 'bottom' ? 'border-l border-t top-[-5px] left-1/2 -translate-x-1/2' : ''}
            ${side === 'left' ? 'border-r border-t right-[-5px] top-1/2 -translate-y-1/2' : ''}
            ${side === 'right' ? 'border-l border-b left-[-5px] top-1/2 -translate-y-1/2' : ''}
          `} aria-hidden="true" />
        </div>,
        document.body
      )}
    </>
  );
};
