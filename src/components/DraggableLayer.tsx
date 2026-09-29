import React, { useRef, useState, useEffect } from 'react';
import { CanvasLayer } from '../data/layers';
import { Lock, Move, RotateCcw } from 'lucide-react';

interface DraggableLayerProps {
  layer?: CanvasLayer;
  isDraggingEnabled?: boolean;
  isSelected?: boolean;
  canvasZoom?: number;
  isExporting?: boolean;
  onUpdateLayer?: (updated: Partial<CanvasLayer>) => void;
  onSelectLayer?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const DraggableLayer: React.FC<DraggableLayerProps> = ({
  layer,
  isDraggingEnabled = false,
  isSelected = false,
  canvasZoom = 100,
  isExporting = false,
  onUpdateLayer,
  onSelectLayer,
  className = '',
  style = {},
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; layerX: number; layerY: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  // If no layer provided, just render children
  if (!layer) {
    return <div className={className} style={style}>{children}</div>;
  }

  // If layer is hidden, do not render or hide completely
  if (!layer.isVisible) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click
    if (e.button !== 0) return;
    if (layer.isLocked || !isDraggingEnabled) return;

    // Prevent text selection while dragging
    e.stopPropagation();
    onSelectLayer?.();
    hasMovedRef.current = false;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: layer.x,
      layerY: layer.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current || !onUpdateLayer) return;

      const scale = canvasZoom / 100;
      const dx = (moveEvent.clientX - dragStartRef.current.mouseX) / scale;
      const dy = (moveEvent.clientY - dragStartRef.current.mouseY) / scale;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      onUpdateLayer({
        x: Math.round(dragStartRef.current.layerX + dx),
        y: Math.round(dragStartRef.current.layerY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (layer.isLocked || !isDraggingEnabled) return;
    if (e.touches.length !== 1) return;

    e.stopPropagation();
    onSelectLayer?.();
    hasMovedRef.current = false;

    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      layerX: layer.x,
      layerY: layer.y
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!dragStartRef.current || !onUpdateLayer || moveEvent.touches.length !== 1) return;

      const currentTouch = moveEvent.touches[0];
      const scale = canvasZoom / 100;
      const dx = (currentTouch.clientX - dragStartRef.current.mouseX) / scale;
      const dy = (currentTouch.clientY - dragStartRef.current.mouseY) / scale;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }

      onUpdateLayer({
        x: Math.round(dragStartRef.current.layerX + dx),
        y: Math.round(dragStartRef.current.layerY + dy)
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const hasOffset = layer.x !== 0 || layer.y !== 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClickCapture={(e) => {
        // If in drag mode and we moved, stop child click handlers
        if (isDraggingEnabled && hasMovedRef.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      onClick={(e) => {
        if (isDraggingEnabled) {
          e.stopPropagation();
          onSelectLayer?.();
        }
      }}
      className={`relative transition-shadow duration-150 ${className} ${
        isDraggingEnabled && !isExporting
          ? layer.isLocked
            ? 'cursor-not-allowed'
            : isDragging
            ? 'cursor-grabbing select-none'
            : 'cursor-grab select-none'
          : ''
      } ${
        isDraggingEnabled && !isExporting && isSelected
          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 rounded-xl'
          : isDraggingEnabled && !isExporting && isHovered
          ? 'ring-1 ring-cyan-400/60 rounded-xl'
          : ''
      }`}
      style={{
        ...style,
        transform: `translate3d(${layer.x}px, ${layer.y}px, 0)`,
        opacity: layer.opacity,
        zIndex: layer.zIndex
      }}
    >
      {/* On-Canvas Visual Helper Badge when in Drag Mode */}
      {isDraggingEnabled && !isExporting && (isSelected || isHovered || isDragging) && (
        <div
          data-export-hide="true"
          className="absolute -top-6 left-0 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/95 border border-cyan-500/60 text-white text-[10px] font-bold shadow-lg backdrop-blur-md pointer-events-auto"
        >
          {layer.isLocked ? (
            <span className="flex items-center gap-1 text-red-400">
              <Lock className="w-3 h-3" />
              <span>Bloqueada</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-cyan-300">
              <Move className="w-3 h-3" />
              <span>Arrastrar</span>
            </span>
          )}

          <span className="text-slate-300 max-w-[120px] truncate">{layer.name}</span>

          {hasOffset && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayer?.({ x: 0, y: 0 });
              }}
              className="text-slate-400 hover:text-yellow-400 p-0.5 rounded transition-colors"
              title="Restablecer posición inicial"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}

          {layer.opacity < 1 && (
            <span className="text-yellow-400 font-mono text-[9px]">
              {Math.round(layer.opacity * 100)}%
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};
