import React, { useState } from 'react';
import { BANNER_FORMATS, BannerFormat, ChannelBranding } from '../data/branding';
import { TemplateData } from '../data/templates';
import { FixtureBanner } from './banners/FixtureBanner';
import { VersusBanner } from './banners/VersusBanner';
import { LineupBanner } from './banners/LineupBanner';
import { GoalBanner } from './banners/GoalBanner';
import { ResultBanner } from './banners/ResultBanner';
import { StandingsBanner } from './banners/StandingsBanner';
import { CanvasLayer } from '../data/layers';
import { X, Download, Check, Smartphone, Square, Monitor, Sparkles, Copy, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiFormatExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TemplateData;
  branding: ChannelBranding;
  layers: CanvasLayer[];
  onApplyFormatToCanvas: (format: BannerFormat) => void;
  onExportAll: () => Promise<void>;
}

export const MultiFormatExportModal: React.FC<MultiFormatExportModalProps> = ({
  isOpen,
  onClose,
  data,
  branding,
  layers,
  onApplyFormatToCanvas,
  onExportAll
}) => {
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadAll = async () => {
    setIsExportingAll(true);
    try {
      await onExportAll();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.error('Error exporting all formats:', e);
    } finally {
      setIsExportingAll(false);
    }
  };

  const renderBannerInFormat = (fmt: BannerFormat) => {
    const commonProps = {
      data,
      branding,
      format: fmt,
      layers,
      isDragModeActive: false,
      canvasZoom: 100,
      isExporting: false
    };

    switch (data.type) {
      case 'fixture':
        return <FixtureBanner {...commonProps} />;
      case 'versus':
        return <VersusBanner {...commonProps} />;
      case 'lineup':
        return <LineupBanner {...commonProps} />;
      case 'goal':
        return <GoalBanner {...commonProps} />;
      case 'result':
        return <ResultBanner {...commonProps} />;
      case 'standings':
        return <StandingsBanner {...commonProps} />;
      default:
        return <FixtureBanner {...commonProps} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat flex items-center gap-2">
                <span>Adaptación Automática Multi-Formato</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                  Sin rediseñar
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Visualiza y exporta simultáneamente en vertical, cuadrado y horizontal para todas tus redes sociales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={isExportingAll}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 transition-all text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingAll ? 'Generando...' : 'Descargar Todo el Lote'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formats Grid Comparison View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {BANNER_FORMATS.filter(f => f.id !== 'facebook-feed').map((fmt) => (
              <div key={fmt.id} className="space-y-2 flex flex-col items-center">
                <div className="w-full flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    {fmt.id === 'tiktok-story' && <Smartphone className="w-4 h-4 text-cyan-400" />}
                    {fmt.id === 'facebook-square' && <Square className="w-4 h-4 text-emerald-400" />}
                    {fmt.id === 'horizontal-16-9' && <Monitor className="w-4 h-4 text-yellow-400" />}
                    <span className="font-bold text-white text-xs">{fmt.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {fmt.aspectRatio}
                  </span>
                </div>

                {/* Banner Miniature Frame with accurate aspect ratio */}
                <div
                  className="w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950 relative group"
                  style={{
                    aspectRatio:
                      fmt.id === 'tiktok-story'
                        ? '9/16'
                        : fmt.id === 'facebook-square'
                        ? '1/1'
                        : '16/9',
                    maxHeight: '440px'
                  }}
                >
                  <div className="w-full h-full transform origin-top-left">
                    {renderBannerInFormat(fmt)}
                  </div>

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-xs p-4">
                    <button
                      onClick={() => {
                        onApplyFormatToCanvas(fmt);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Usar en Lienzo</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400">
                  {fmt.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
