import React from 'react';
import { TemplateData } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { DraggableLayer } from '../DraggableLayer';
import { CanvasLayer } from '../../data/layers';
import { Trophy, Youtube } from 'lucide-react';

interface StandingsBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  layers?: CanvasLayer[];
  isDragModeActive?: boolean;
  selectedLayerId?: string;
  canvasZoom?: number;
  isExporting?: boolean;
  onUpdateLayer?: (id: string, updated: Partial<CanvasLayer>) => void;
  onSelectLayer?: (id: string) => void;
  onSelectClubToSwap?: (clubId: string, index: number) => void;
  onOpenCompetitionPicker?: () => void;
}

export const StandingsBanner: React.FC<StandingsBannerProps> = ({
  data,
  branding,
  format,
  layers = [],
  isDragModeActive = false,
  selectedLayerId,
  canvasZoom = 100,
  isExporting = false,
  onUpdateLayer,
  onSelectLayer,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const competition = getCompetitionById(data.competitionId);
  const getLayer = (id: string) => layers.find(l => l.id === id);

  const isVertical = format.id === 'tiktok-story';
  const isCyber = branding.theme === 'neon-gaming';

  return (
    <div
      id="soccer-banner-capture"
      className={`relative w-full h-full overflow-hidden flex flex-col justify-between select-none ${
        isCyber
          ? 'bg-[#050811] text-white'
          : competition.headerTheme === 'libertadores'
          ? 'bg-gradient-to-b from-stone-950 via-zinc-950 to-black text-white'
          : 'bg-gradient-to-b from-slate-900 via-zinc-900 to-black text-white'
      }`}
    >
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 10%, ${competition.primaryColor} 0%, transparent 60%),
                              linear-gradient(to bottom, #050811 0%, #0c1222 50%, #03060c 100%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.25) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(34, 197, 94, 0.25) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center ${isVertical ? 'pt-8' : 'pt-4'}`}>
        <DraggableLayer
          layer={getLayer('layer-header')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-header'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-header', up)}
          onSelectLayer={() => onSelectLayer?.('layer-header')}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2">
              <ChannelLogoBadge branding={branding} size="sm" />
              <div className="text-left">
                <span className="block text-xs font-black text-emerald-400 font-orbitron">{branding.channelName}</span>
                <span className="block text-[9px] text-slate-400 font-bold">{branding.tagline}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-yellow-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>TABLA DE POSICIONES</span>
            </div>
          </div>

          {/* Real Tournament Badge */}
          <div
            onClick={onOpenCompetitionPicker}
            className="cursor-pointer hover:scale-105 transition-transform flex flex-col items-center"
            title="Clic para cambiar torneo"
          >
            <div className="h-16 flex items-center justify-center">
              <CompetitionBadge competition={competition} size="md" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-rajdhani mt-0.5">
              {data.roundTitle} • {data.dateRange}
            </span>
          </div>
        </DraggableLayer>
      </div>

      {/* STANDINGS TABLE */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 py-2 overflow-hidden flex flex-col justify-center max-w-4xl mx-auto w-full">
        <DraggableLayer
          layer={getLayer('layer-table')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-table'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-table', up)}
          onSelectLayer={() => onSelectLayer?.('layer-table')}
        >
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Table Header */}
            <div className="grid grid-cols-12 py-2 px-3 bg-slate-950/80 text-[11px] font-black uppercase text-slate-400 border-b border-slate-800 font-montserrat">
              <div className="col-span-1 text-center">POS</div>
              <div className="col-span-5">CLUB</div>
              <div className="col-span-1 text-center">PJ</div>
              <div className="col-span-1 text-center hidden sm:block">G</div>
              <div className="col-span-1 text-center hidden sm:block">E</div>
              <div className="col-span-1 text-center hidden sm:block">P</div>
              <div className="col-span-1 text-center">DG</div>
              <div className="col-span-1 text-right sm:text-center text-emerald-400">PTS</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-800/60 text-xs">
              {data.standings.slice(0, 8).map((row, idx) => {
                const club = getClubById(row.clubId);
                const goalDiff = row.goalsFor - row.goalsAgainst;

                return (
                  <div
                    key={row.clubId + idx}
                    className={`grid grid-cols-12 items-center py-1.5 px-3 transition-colors ${
                      idx < 4 ? 'bg-emerald-950/20' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx === 0
                            ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/30'
                            : idx < 4
                            ? 'bg-emerald-500 text-slate-950'
                            : idx < 8
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {row.position || idx + 1}
                      </span>
                    </div>

                    <div
                      onClick={() => onSelectClubToSwap && onSelectClubToSwap(row.clubId, idx)}
                      className="col-span-5 flex items-center gap-2 cursor-pointer hover:opacity-85"
                      title="Clic para cambiar club"
                    >
                      <ClubBadge club={club} size="sm" />
                      <span className="font-bold text-white font-montserrat truncate text-xs sm:text-sm">
                        {club.name}
                      </span>
                    </div>

                    <div className="col-span-1 text-center font-bold text-slate-300">{row.played}</div>
                    <div className="col-span-1 text-center text-slate-400 hidden sm:block">{row.won}</div>
                    <div className="col-span-1 text-center text-slate-400 hidden sm:block">{row.drawn}</div>
                    <div className="col-span-1 text-center text-slate-400 hidden sm:block">{row.lost}</div>
                    <div className={`col-span-1 text-center font-bold ${goalDiff > 0 ? 'text-emerald-400' : goalDiff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                    </div>
                    <div className="col-span-1 text-right sm:text-center font-black text-emerald-400 text-sm font-anton">
                      {row.points}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2 bg-slate-950 flex flex-wrap items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Clasificación Principal
                </span>
              </div>
              <span className="text-slate-500">Actualizado con {branding.channelName}</span>
            </div>
          </div>
        </DraggableLayer>
      </div>

      {/* FOOTER */}
      <DraggableLayer
        layer={getLayer('layer-broadcast-bar')}
        isDraggingEnabled={isDragModeActive}
        isSelected={selectedLayerId === 'layer-broadcast-bar'}
        canvasZoom={canvasZoom}
        isExporting={isExporting}
        onUpdateLayer={(up) => onUpdateLayer?.('layer-broadcast-bar', up)}
        onSelectLayer={() => onSelectLayer?.('layer-broadcast-bar')}
        className={`relative z-10 shrink-0 w-full px-6 py-2.5 border-t border-slate-800 bg-slate-950/95 ${isVertical ? 'pb-8' : ''}`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChannelLogoBadge branding={branding} size="sm" />
            <div>
              <span className="block text-xs font-black text-white font-orbitron">{branding.channelName}</span>
              <span className="block text-[9px] text-emerald-400">{branding.tagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded text-white font-black text-xs">
              <Youtube className="w-3.5 h-3.5" />
              <span>{branding.youtubeHandle}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded font-black text-xs">
              <span>{branding.kickHandle}</span>
            </div>
          </div>
        </div>
      </DraggableLayer>

      {/* USER-ADDED CUSTOM LAYERS (Floating draggable badges/stickers) */}
      {layers.filter(l => l.category === 'custom' && l.isVisible).map(cl => (
        <DraggableLayer
          key={cl.id}
          layer={cl}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === cl.id}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.(cl.id, up)}
          onSelectLayer={() => onSelectLayer?.(cl.id)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto"
        >
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-400 text-white font-montserrat font-black text-xs shadow-2xl backdrop-blur-md">
            {cl.customText}
          </div>
        </DraggableLayer>
      ))}
    </div>
  );
};
