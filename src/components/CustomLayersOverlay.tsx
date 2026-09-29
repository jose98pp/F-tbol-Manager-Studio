import React from 'react';
import { CanvasLayer } from '../data/layers';
import { DraggableLayer } from './DraggableLayer';

interface CustomLayersOverlayProps {
  layers: CanvasLayer[];
  isDragModeActive: boolean;
  selectedLayerId?: string;
  canvasZoom: number;
  isExporting: boolean;
  onUpdateLayer?: (id: string, updated: Partial<CanvasLayer>) => void;
  onSelectLayer?: (id: string) => void;
}

export const CustomLayersOverlay: React.FC<CustomLayersOverlayProps> = ({
  layers,
  isDragModeActive,
  selectedLayerId,
  canvasZoom,
  isExporting,
  onUpdateLayer,
  onSelectLayer
}) => {
  const customLayers = layers.filter(l => l.category === 'custom' && l.isVisible);

  if (customLayers.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {customLayers.map(layer => (
        <div key={layer.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <DraggableLayer
            layer={layer}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === layer.id}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.(layer.id, up)}
            onSelectLayer={() => onSelectLayer?.(layer.id)}
            className="pointer-events-auto select-none"
          >
            <div className="px-4 py-2 rounded-2xl bg-slate-950/85 border border-cyan-400/50 shadow-2xl backdrop-blur-md text-center max-w-xs">
              <span className="font-anton uppercase tracking-wider text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-white drop-shadow-md block">
                {layer.customText || 'TEXTO PERSONALIZADO'}
              </span>
            </div>
          </DraggableLayer>
        </div>
      ))}
    </div>
  );
};
