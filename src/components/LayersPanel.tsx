import React, { useState } from 'react';
import { CanvasLayer } from '../data/layers';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Move,
  Type,
  Image as ImageIcon,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LayersPanelProps {
  layers: CanvasLayer[];
  onUpdateLayers: (newLayers: CanvasLayer[]) => void;
  selectedLayerId?: string;
  onSelectLayer: (id: string) => void;
  isDragModeActive: boolean;
  onToggleDragMode: () => void;
  onResetAllLayers: () => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  onUpdateLayers,
  selectedLayerId,
  onSelectLayer,
  isDragModeActive,
  onToggleDragMode,
  onResetAllLayers
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customText, setCustomText] = useState('');

  // Sort layers by zIndex descending (highest on top like Photoshop/Figma)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLayers(
      layers.map(l => (l.id === id ? { ...l, isLocked: !l.isLocked } : l))
    );
  };

  const handleToggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLayers(
      layers.map(l => (l.id === id ? { ...l, isVisible: !l.isVisible } : l))
    );
  };

  const handleOpacityChange = (id: string, opacity: number) => {
    onUpdateLayers(
      layers.map(l => (l.id === id ? { ...l, opacity } : l))
    );
  };

  const handleResetLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLayers(
      layers.map(l => (l.id === id ? { ...l, x: 0, y: 0, opacity: 1, isLocked: false, isVisible: true } : l))
    );
  };

  const handleMoveLayerUp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = sortedLayers.findIndex(l => l.id === id);
    if (index <= 0) return; // already at top

    const currentLayer = sortedLayers[index];
    const targetLayer = sortedLayers[index - 1];

    // Swap z-indices
    const newLayers = layers.map(l => {
      if (l.id === currentLayer.id) return { ...l, zIndex: targetLayer.zIndex + 1 };
      if (l.id === targetLayer.id) return { ...l, zIndex: targetLayer.zIndex - 1 };
      return l;
    });

    onUpdateLayers(newLayers);
  };

  const handleMoveLayerDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = sortedLayers.findIndex(l => l.id === id);
    if (index >= sortedLayers.length - 1) return; // already at bottom

    const currentLayer = sortedLayers[index];
    const targetLayer = sortedLayers[index + 1];

    // Swap z-indices
    const newLayers = layers.map(l => {
      if (l.id === currentLayer.id) return { ...l, zIndex: Math.max(1, targetLayer.zIndex - 1) };
      if (l.id === targetLayer.id) return { ...l, zIndex: targetLayer.zIndex + 1 };
      return l;
    });

    onUpdateLayers(newLayers);
  };

  const handleAddCustomTextLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const maxZ = Math.max(...layers.map(l => l.zIndex), 40);
    const newLayer: CanvasLayer = {
      id: `custom-text-${Date.now()}`,
      name: `Texto: "${customText.trim().slice(0, 15)}"`,
      category: 'custom',
      x: 0,
      y: 0,
      zIndex: maxZ + 1,
      opacity: 1,
      isLocked: false,
      isVisible: true,
      customText: customText.trim()
    };

    onUpdateLayers([...layers, newLayer]);
    setCustomText('');
    setShowAddCustom(false);
    onSelectLayer(newLayer.id);
  };

  const handleRemoveCustomLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLayers(layers.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden text-xs">
      {/* Panel Top Toolbar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Capas del Lienzo</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-400 font-mono">
              {layers.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onResetAllLayers}
              className="px-2 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Restablecer posición, opacidad y bloqueo de todas las capas"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>

        {/* Big Canvas Drag Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDragMode}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer shadow-sm ${
              isDragModeActive
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>{isDragModeActive ? '✓ Modo Arrastrar Activo' : 'Activar Arrastre en Lienzo'}</span>
          </button>

          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            title="Añadir capa de texto personalizado"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Custom Text Layer Form Drawer */}
        {showAddCustom && (
          <form onSubmit={handleAddCustomTextLayer} className="p-2.5 bg-slate-950 rounded-xl border border-cyan-500/40 space-y-2 mt-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Agregar Texto / Marca de Agua
            </span>
            <input
              type="text"
              required
              placeholder="Ej. TRANSMISIÓN EXCLUSIVA, FECHA 7..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs focus:border-cyan-500 focus:outline-none"
            />
            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[11px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-[11px]"
              >
                Agregar Capa
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Layers List (Top to Bottom) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {sortedLayers.map((layer, index) => {
          const isSelected = selectedLayerId === layer.id;
          const isTop = index === 0;
          const isBottom = index === sortedLayers.length - 1;
          const hasOffset = layer.x !== 0 || layer.y !== 0;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`group p-2 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/95 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Row Header: Controls & Info */}
              <div className="flex items-center justify-between gap-1.5">
                {/* Reorder Buttons */}
                <div className="flex flex-col shrink-0">
                  <button
                    disabled={isTop}
                    onClick={(e) => handleMoveLayerUp(layer.id, e)}
                    className={`p-0.5 rounded hover:bg-slate-700 ${
                      isTop ? 'opacity-20 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-white cursor-pointer'
                    }`}
                    title="Mover capa hacia arriba (adelante)"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={isBottom}
                    onClick={(e) => handleMoveLayerDown(layer.id, e)}
                    className={`p-0.5 rounded hover:bg-slate-700 ${
                      isBottom ? 'opacity-20 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-white cursor-pointer'
                    }`}
                    title="Mover capa hacia abajo (atrás)"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Layer Icon & Name */}
                <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
                  <div
                    className={`p-1 rounded-md shrink-0 ${
                      layer.category === 'frame'
                        ? 'bg-purple-500/20 text-purple-400'
                        : layer.category === 'header'
                        ? 'bg-amber-500/20 text-amber-400'
                        : layer.category === 'title'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : layer.category === 'footer'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {layer.category === 'title' || layer.category === 'custom' ? (
                      <Type className="w-3 h-3" />
                    ) : (
                      <Layers className="w-3 h-3" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white block truncate leading-tight">
                      {layer.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>z: {layer.zIndex}</span>
                      {hasOffset && (
                        <span className="text-yellow-400 font-mono">
                          ({layer.x > 0 ? `+${layer.x}` : layer.x}px, {layer.y > 0 ? `+${layer.y}` : layer.y}px)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Toggles: Lock, Visibility, Reset */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reset single layer */}
                  {hasOffset && (
                    <button
                      onClick={(e) => handleResetLayer(layer.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                      title="Restablecer posición inicial"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}

                  {/* Lock Toggle */}
                  <button
                    onClick={(e) => handleToggleLock(layer.id, e)}
                    className={`p-1 rounded transition-colors ${
                      layer.isLocked
                        ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={layer.isLocked ? 'Capa bloqueada (no se puede arrastrar)' : 'Bloquear capa'}
                  >
                    {layer.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={(e) => handleToggleVisibility(layer.id, e)}
                    className={`p-1 rounded transition-colors ${
                      !layer.isVisible
                        ? 'text-slate-600 bg-slate-900 hover:text-slate-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={layer.isVisible ? 'Ocultar capa' : 'Mostrar capa'}
                  >
                    {layer.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>

                  {/* Delete custom layer */}
                  {layer.category === 'custom' && (
                    <button
                      onClick={(e) => handleRemoveCustomLayer(layer.id, e)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                      title="Eliminar capa personalizada"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Opacity Slider Row (always accessible or when selected) */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <Sliders className="w-3 h-3 text-slate-400" />
                  <span>Opacidad:</span>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-[170px]">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-cyan-400 font-bold w-8 text-right">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Arrastra en el lienzo para mover</span>
        </span>
        <span className="text-slate-500">Orden superior = Frente</span>
      </div>
    </div>
  );
};
