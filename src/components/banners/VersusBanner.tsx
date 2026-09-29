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
import { Youtube, MapPin, Clock, ShieldCheck, Flame, Radio } from 'lucide-react';

interface VersusBannerProps {
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
  onSelectClubToSwap?: (side: 'home' | 'away') => void;
  onOpenCompetitionPicker?: () => void;
}

export const VersusBanner: React.FC<VersusBannerProps> = ({
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
  const homeClub = getClubById(data.singleMatch.homeClubId);
  const awayClub = getClubById(data.singleMatch.awayClubId);
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
          : competition.headerTheme === 'champions'
          ? 'bg-gradient-to-b from-[#030b20] via-[#05112e] to-black text-white'
          : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white'
      }`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${homeClub.primaryColor} 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, ${awayClub.primaryColor} 0%, transparent 50%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center shrink-0 ${isVertical ? 'pt-8' : 'pt-4'}`}>
        {/* Layer: Cabecera y Estado */}
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
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2">
              <ChannelLogoBadge branding={branding} size="sm" />
              <div className="text-left">
                <span className="block text-xs font-black text-emerald-400 font-orbitron">{branding.channelName}</span>
                <span className="block text-[10px] text-slate-400 font-bold">{branding.tagline}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-black text-xs shadow-lg animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>EN VIVO</span>
              </div>
            </div>
          </div>
        </DraggableLayer>

        {/* Layer: Tournament Badge */}
        <DraggableLayer
          layer={getLayer('layer-tournament')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-tournament'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-tournament', up)}
          onSelectLayer={() => onSelectLayer?.('layer-tournament')}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <div onClick={onOpenCompetitionPicker} title="Clic para cambiar torneo" className="h-16 flex items-center justify-center">
            <CompetitionBadge competition={competition} size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-yellow-400 mt-1">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            <span>{data.singleMatch.statusBadge || 'PARTIDO DE LA FECHA'}</span>
          </div>
        </DraggableLayer>

        {/* Layer: Title and Date */}
        <DraggableLayer
          layer={getLayer('layer-title')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-title'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-title', up)}
          onSelectLayer={() => onSelectLayer?.('layer-title')}
        >
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300 mt-1.5 font-rajdhani">
            {data.roundTitle} • {data.dateRange}
          </h2>
        </DraggableLayer>
      </div>

      {/* CENTER: VS CLASH */}
      <div className="relative z-10 flex-1 px-4 flex flex-col items-center justify-center my-2">
        <div
          className={`w-full max-w-4xl flex items-center justify-around gap-2 ${
            isVertical ? 'flex-col space-y-6 my-auto' : 'flex-row'
          }`}
        >
          {/* HOME TEAM */}
          <DraggableLayer
            layer={getLayer('layer-club-home')}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === 'layer-club-home'}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.('layer-club-home', up)}
            onSelectLayer={() => onSelectLayer?.('layer-club-home')}
          >
            <div
              onClick={() => onSelectClubToSwap && onSelectClubToSwap('home')}
              className="flex flex-col items-center group cursor-pointer text-center p-3 rounded-2xl hover:bg-white/5 transition-all"
              title="Clic para cambiar equipo local"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: homeClub.primaryColor }}
                />
                <ClubBadge club={homeClub} size={isVertical ? '2xl' : 'xl'} className="relative z-10" />
              </div>

              <h3 className="mt-3 text-xl sm:text-2xl font-black font-anton uppercase tracking-wide text-white drop-shadow-md">
                {homeClub.name}
              </h3>
              <span className="text-xs font-bold text-emerald-400 font-montserrat">
                {homeClub.city || 'LOCAL'}
              </span>
            </div>
          </DraggableLayer>

          {/* CENTER VS BADGE */}
          <DraggableLayer
            layer={getLayer('layer-vs')}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === 'layer-vs'}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.('layer-vs', up)}
            onSelectLayer={() => onSelectLayer?.('layer-vs')}
            className="flex flex-col items-center justify-center shrink-0 px-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="font-anton text-3xl italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    VS
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 px-4 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-center shadow-lg">
              <div className="flex items-center justify-center gap-1.5 text-yellow-400 text-xs font-bold font-orbitron">
                <Clock className="w-3.5 h-3.5" />
                <span>{data.singleMatch.matchTime || 'HOY 20:00'}</span>
              </div>
            </div>
          </DraggableLayer>

          {/* AWAY TEAM */}
          <DraggableLayer
            layer={getLayer('layer-club-away')}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === 'layer-club-away'}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.('layer-club-away', up)}
            onSelectLayer={() => onSelectLayer?.('layer-club-away')}
          >
            <div
              onClick={() => onSelectClubToSwap && onSelectClubToSwap('away')}
              className="flex flex-col items-center group cursor-pointer text-center p-3 rounded-2xl hover:bg-white/5 transition-all"
              title="Clic para cambiar equipo visitante"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: awayClub.primaryColor }}
                />
                <ClubBadge club={awayClub} size={isVertical ? '2xl' : 'xl'} className="relative z-10" />
              </div>

              <h3 className="mt-3 text-xl sm:text-2xl font-black font-anton uppercase tracking-wide text-white drop-shadow-md">
                {awayClub.name}
              </h3>
              <span className="text-xs font-bold text-cyan-400 font-montserrat">
                {awayClub.city || 'VISITANTE'}
              </span>
            </div>
          </DraggableLayer>
        </div>

        {/* Layer: Match Info (Stadium & Referee) */}
        <DraggableLayer
          layer={getLayer('layer-match-info')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-match-info'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-match-info', up)}
          onSelectLayer={() => onSelectLayer?.('layer-match-info')}
          className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-300 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-700/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{data.singleMatch.stadium}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Árbitro: {data.singleMatch.referee}</span>
          </div>
        </DraggableLayer>
      </div>

      {/* FOOTER BROADCAST BAR */}
      <DraggableLayer
        layer={getLayer('layer-broadcast-bar')}
        isDraggingEnabled={isDragModeActive}
        isSelected={selectedLayerId === 'layer-broadcast-bar'}
        canvasZoom={canvasZoom}
        isExporting={isExporting}
        onUpdateLayer={(up) => onUpdateLayer?.('layer-broadcast-bar', up)}
        onSelectLayer={() => onSelectLayer?.('layer-broadcast-bar')}
        className="relative z-10 w-full"
      >
        <div className="w-full px-6 py-2.5 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">EN DIRECTO POR:</span>
            {branding.showYoutube && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                <Youtube className="w-3.5 h-3.5 text-white" />
                <span>{branding.youtubeHandle}</span>
              </div>
            )}
            {branding.showKick && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-950 bg-emerald-400 px-2 py-0.5 rounded">
                <span className="font-black">K</span>
                <span>{branding.kickHandle}</span>
              </div>
            )}
          </div>

          <span className="text-[10px] text-emerald-400 font-orbitron font-bold tracking-widest hidden sm:inline">
            FULL HD BROADCAST
          </span>
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
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-400 text-white font-montserrat font-black text-xs shadow-2xl backdrop-blur-md">
            {cl.customText}
          </div>
        </DraggableLayer>
      ))}
    </div>
  );
};
