import React, { useState, useRef, useCallback } from 'react';

interface TransformState {
  scale: number;
  position: { x: number; y: number };
}

export const useCanvasTransform = (initialScale = 1) => {
  const [transform, setTransform] = useState<TransformState>({
    scale: initialScale,
    position: { x: 0, y: 0 }
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const setScale = (newScale: number | ((s: number) => number)) => {
    setTransform(prev => {
      const s = typeof newScale === 'function' ? newScale(prev.scale) : newScale;
      const clamped = Math.min(Math.max(s, 0.1), 5); // 10% to 500%
      return { ...prev, scale: clamped };
    });
  };

  const handleZoomIn = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(s => s + 0.25);
  }, []);

  const handleZoomOut = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(s => s - 0.25);
  }, []);

  const handleReset = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTransform({ scale: 1, position: { x: 0, y: 0 } });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Zoom on wheel
    const delta = -e.deltaY;
    setScale(s => s + (delta > 0 ? 0.1 : -0.1));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { 
      x: e.clientX - transform.position.x, 
      y: e.clientY - transform.position.y 
    };
  }, [transform.position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setTransform(prev => ({
      ...prev,
      position: {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  return {
    scale: transform.scale,
    position: transform.position,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset: handleReset
  };
};