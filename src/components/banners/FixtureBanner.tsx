import React from 'react';
import { TemplateData, FixtureMatch } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { DraggableLayer } from '../DraggableLayer';
import { CanvasLayer } from '../../data/layers';

interface FixtureBannerProps {
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
  onEditMatch?: (match: FixtureMatch) => void;
  onSelectClubToSwap?: (matchId: string, side: 'home' | 'away') => void;
  onOpenCompetitionPicker?: () => void;
}

export const FixtureBanner: React.FC<FixtureBannerProps> = ({
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
  onEditMatch,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const competition = getCompetitionById(data.competitionId);

  // Helper to get layer by ID
  const getLayer = (id: string) => layers.find(l => l.id === id);

  // Group matches by day (e.g. MARTES, MIÉRCOLES, JUEVES)
  const groupedMatches: { [day: string]: FixtureMatch[] } = {};
  data.fixtureMatches.forEach(m => {
    const dayKey = m.day?.trim().toUpperCase() || 'PARTIDOS';
    if (!groupedMatches[dayKey]) groupedMatches[dayKey] = [];
    groupedMatches[dayKey].push(m);
  });

  const days = Object.keys(groupedMatches);

  // Group into Top Card (e.g. MARTES & MIÉRCOLES) and Bottom Card (e.g. JUEVES)
  let topCardDays: string[] = [];
  let bottomCardDays: string[] = [];

  if (days.length === 1) {
    topCardDays = days;
  } else if (days.length === 2) {
    topCardDays = days;
  } else if (days.length === 3) {
    topCardDays = [days[0], days[1]];
    bottomCardDays = [days[2]];
  } else {
    const half = Math.ceil(days.length / 2);
    topCardDays = days.slice(0, half);
    bottomCardDays = days.slice(half);
  }

  const isVertical = format.id === 'tiktok-story';

  // Custom user-added layers
  const customLayers = layers.filter(l => l.category === 'custom' && l.isVisible);

  return (
    <div
      id="soccer-banner-capture"
      className="relative w-full h-full overflow-hidden flex flex-col justify-between select-none bg-slate-950 text-white font-sans"
      style={{ width: '100%', height: '100%' }}
    >
      {/* 1. ATMOSPHERIC BACKGROUND: Grayscale Stadium + Dark Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(2,6,23,0.95) 75%),
              linear-gradient(to bottom, rgba(2,6,23,0.6) 0%, rgba(2,6,23,0.92) 85%, rgba(2,6,23,1) 100%),
              url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80')`
          }}
        />

        <div
          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 12%, rgba(255,255,255,0.25) 0%, transparent 60%),
              radial-gradient(circle at 15% 5%, rgba(200,225,255,0.15) 0%, transparent 45%),
              radial-gradient(circle at 85% 5%, rgba(200,225,255,0.15) 0%, transparent 45%)`
          }}
        />
      </div>

      {/* 2. CLASSIC DOUBLE KEYLINE FRAME WITH NOTCHED CORNERS (Layer: layer-frame) */}
      <DraggableLayer
        layer={getLayer('layer-frame')}
        isDraggingEnabled={isDragModeActive}
        isSelected={selectedLayerId === 'layer-frame'}
        canvasZoom={canvasZoom}
        isExporting={isExporting}
        onUpdateLayer={(up) => onUpdateLayer?.('layer-frame', up)}
        onSelectLayer={() => onSelectLayer?.('layer-frame')}
        className={`absolute inset-2 sm:inset-3 z-10 ${
          isDragModeActive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="w-full h-full border border-white/60 rounded-[18px] sm:rounded-[22px] relative">
          <div className="absolute inset-1 sm:inset-1.5 border border-white/20 rounded-[14px] sm:rounded-[18px]">
            {/* Corner Notch cutouts with tiny center diamond pips */}
            <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-slate-950 border-r border-b border-white/60 flex items-center justify-center">
              <div className="w-1 h-1 bg-white/70 rotate-45" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-slate-950 border-l border-b border-white/60 flex items-center justify-center">
              <div className="w-1 h-1 bg-white/70 rotate-45" />
            </div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-slate-950 border-r border-t border-white/60 flex items-center justify-center">
              <div className="w-1 h-1 bg-white/70 rotate-45" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-slate-950 border-l border-t border-white/60 flex items-center justify-center">
              <div className="w-1 h-1 bg-white/70 rotate-45" />
            </div>
          </div>
        </div>
      </DraggableLayer>

      {/* 3. TOP SPONSOR & TOURNAMENT HEADER */}
      <div className={`relative z-20 px-6 text-center flex flex-col items-center shrink-0 ${isVertical ? 'pt-7' : 'pt-3.5 sm:pt-4'}`}>
        {/* Layer: Top Sponsor (entel) */}
        <DraggableLayer
          layer={getLayer('layer-sponsor-top')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-sponsor-top'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-sponsor-top', up)}
          onSelectLayer={() => onSelectLayer?.('layer-sponsor-top')}
          className="flex items-center justify-center"
        >
          <span className="font-montserrat font-extrabold text-2xl sm:text-3xl tracking-tighter lowercase text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">
            entel
          </span>
        </DraggableLayer>

        {/* Layer: Official Trophy Crest (Clickable) */}
        <DraggableLayer
          layer={getLayer('layer-crest')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-crest'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-crest', up)}
          onSelectLayer={() => onSelectLayer?.('layer-crest')}
          className="my-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform flex flex-col items-center drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]"
        >
          <div onClick={onOpenCompetitionPicker} title="Clic para cambiar competencia o torneo">
            <CompetitionBadge competition={competition} size="md" />
          </div>
        </DraggableLayer>

        {/* Layer: Main Title FIXTURE */}
        <DraggableLayer
          layer={getLayer('layer-title')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-title'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-title', up)}
          onSelectLayer={() => onSelectLayer?.('layer-title')}
        >
          <h1
            className={`font-anton uppercase tracking-[0.16em] leading-none text-transparent [-webkit-text-stroke:2px_#ffffff] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] select-none mt-0.5 ${
              isVertical ? 'text-4xl sm:text-5xl' : 'text-4xl sm:text-5xl lg:text-6xl'
            }`}
          >
            FIXTURE
          </h1>
        </DraggableLayer>

        {/* Layer: Subtitles (FECHA 6 & 29 SEP/ 01 OCT) */}
        <DraggableLayer
          layer={getLayer('layer-subtitles')}
          isDraggingEnabled={isDragModeActive}
          isSelected={selectedLayerId === 'layer-subtitles'}
          canvasZoom={canvasZoom}
          isExporting={isExporting}
          onUpdateLayer={(up) => onUpdateLayer?.('layer-subtitles', up)}
          onSelectLayer={() => onSelectLayer?.('layer-subtitles')}
          className="flex flex-col items-center"
        >
          <span className="text-white font-montserrat font-black text-xs sm:text-sm tracking-[0.22em] uppercase mt-1 drop-shadow-md">
            {data.roundTitle || 'FECHA 6'}
          </span>
          <span className="text-slate-100 font-montserrat font-bold text-[11px] sm:text-xs tracking-wider uppercase mt-0.5 drop-shadow">
            {data.dateRange || '29 SEP/ 01 OCT'}
          </span>
        </DraggableLayer>
      </div>

      {/* 4. FROSTED MATCH CARDS SECTION */}
      <div className="relative z-20 flex-1 px-4 sm:px-8 py-2 overflow-hidden flex flex-col justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto w-full">
        {/* CARD 1: TOP 2-COLUMN GROUP (Layer: layer-card-top) */}
        {topCardDays.length > 0 && (
          <DraggableLayer
            layer={getLayer('layer-card-top')}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === 'layer-card-top'}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.('layer-card-top', up)}
            onSelectLayer={() => onSelectLayer?.('layer-card-top')}
            className="w-full"
          >
            <div className="bg-gradient-to-b from-[#e5e7eb]/95 to-[#cbd5e1]/95 text-slate-900 rounded-[24px] sm:rounded-[32px] p-2.5 sm:p-4 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className={`grid gap-2 sm:gap-4 ${topCardDays.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {topCardDays.map((dayKey, idx) => {
                  const matches = groupedMatches[dayKey] || [];
                  return (
                    <div
                      key={dayKey}
                      className={`flex flex-col ${
                        idx > 0 && topCardDays.length > 1
                          ? 'sm:border-l sm:border-slate-400/40 sm:pl-3 sm:pt-0 pt-2 border-t sm:border-t-0 border-slate-300'
                          : ''
                      }`}
                    >
                      {/* Day Header */}
                      <h3 className="text-center font-montserrat font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider mb-1 sm:mb-1.5">
                        {dayKey}
                      </h3>

                      {/* Match Rows */}
                      <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-center">
                        {matches.map(match => {
                          const homeClub = getClubById(match.homeClubId);
                          const awayClub = getClubById(match.awayClubId);

                          return (
                            <div
                              key={match.id}
                              onClick={() => onEditMatch && onEditMatch(match)}
                              className="group flex items-center justify-between py-0.5 sm:py-1 px-1.5 rounded-xl hover:bg-slate-300/60 transition-colors cursor-pointer"
                              title={`Clic para editar fecha/hora (${match.dateStr})`}
                            >
                              {/* Home Shield */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectClubToSwap && onSelectClubToSwap(match.id, 'home');
                                }}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
                                title={`Cambiar escudo local: ${homeClub.name}`}
                              >
                                <ClubBadge club={homeClub} size="sm" />
                              </div>

                              {/* VS Badge */}
                              <span className="text-white font-black text-[11px] sm:text-xs italic tracking-tighter drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] px-1 shrink-0 select-none">
                                VS
                              </span>

                              {/* Away Shield */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectClubToSwap && onSelectClubToSwap(match.id, 'away');
                                }}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
                                title={`Cambiar escudo visitante: ${awayClub.name}`}
                              >
                                <ClubBadge club={awayClub} size="sm" />
                              </div>

                              {/* Date / Time */}
                              <span className="text-[11px] sm:text-xs font-montserrat font-extrabold text-slate-900 tracking-tight text-right flex-1 min-w-0 pl-1 sm:pl-2 truncate">
                                {match.dateStr}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DraggableLayer>
        )}

        {/* CARD 2: BOTTOM CENTERED GROUP (Layer: layer-card-bottom) */}
        {bottomCardDays.length > 0 && (
          <DraggableLayer
            layer={getLayer('layer-card-bottom')}
            isDraggingEnabled={isDragModeActive}
            isSelected={selectedLayerId === 'layer-card-bottom'}
            canvasZoom={canvasZoom}
            isExporting={isExporting}
            onUpdateLayer={(up) => onUpdateLayer?.('layer-card-bottom', up)}
            onSelectLayer={() => onSelectLayer?.('layer-card-bottom')}
            className="w-full flex justify-center"
          >
            <div className="bg-gradient-to-b from-[#e5e7eb]/95 to-[#cbd5e1]/95 text-slate-900 rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-3.5 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md max-w-sm sm:max-w-md w-full">
              {bottomCardDays.map(dayKey => {
                const matches = groupedMatches[dayKey] || [];
                return (
                  <div key={dayKey} className="flex flex-col">
                    {/* Day Header */}
                    <h3 className="text-center font-montserrat font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider mb-1 sm:mb-1.5">
                      {dayKey}
                    </h3>

                    {/* Match Rows */}
                    <div className="space-y-1 sm:space-y-1.5">
                      {matches.map(match => {
                        const homeClub = getClubById(match.homeClubId);
                        const awayClub = getClubById(match.awayClubId);

                        return (
                          <div
                            key={match.id}
                            onClick={() => onEditMatch && onEditMatch(match)}
                            className="group flex items-center justify-between py-0.5 sm:py-1 px-1.5 rounded-xl hover:bg-slate-300/60 transition-colors cursor-pointer"
                            title={`Clic para editar fecha/hora (${match.dateStr})`}
                          >
                            {/* Home Shield */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectClubToSwap && onSelectClubToSwap(match.id, 'home');
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
                              title={`Cambiar escudo local: ${homeClub.name}`}
                            >
                              <ClubBadge club={homeClub} size="sm" />
                            </div>

                            {/* VS Badge */}
                            <span className="text-white font-black text-[11px] sm:text-xs italic tracking-tighter drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] px-1 shrink-0 select-none">
                              VS
                            </span>

                            {/* Away Shield */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectClubToSwap && onSelectClubToSwap(match.id, 'away');
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform"
                              title={`Cambiar escudo visitante: ${awayClub.name}`}
                            >
                              <ClubBadge club={awayClub} size="sm" />
                            </div>

                            {/* Date / Time */}
                            <span className="text-[11px] sm:text-xs font-montserrat font-extrabold text-slate-900 tracking-tight text-right flex-1 min-w-0 pl-1 sm:pl-2 truncate">
                              {match.dateStr}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </DraggableLayer>
        )}
      </div>

      {/* 5. FOOTER BROADCAST BAR (Layer: layer-broadcast-bar) */}
      <DraggableLayer
        layer={getLayer('layer-broadcast-bar')}
        isDraggingEnabled={isDragModeActive}
        isSelected={selectedLayerId === 'layer-broadcast-bar'}
        canvasZoom={canvasZoom}
        isExporting={isExporting}
        onUpdateLayer={(up) => onUpdateLayer?.('layer-broadcast-bar', up)}
        onSelectLayer={() => onSelectLayer?.('layer-broadcast-bar')}
        className="relative z-20 w-full"
      >
        <div className={`w-full px-4 sm:px-8 py-2 flex items-center justify-between text-white text-[11px] sm:text-xs font-bold tracking-tight ${isVertical ? 'pb-5' : 'pb-2.5'}`}>
          {/* Left Chevrons */}
          <span className="font-black tracking-tighter text-sm text-slate-300">
            &gt;&gt;&gt;&gt;
          </span>

          {/* Broadcast Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 text-slate-100">
              <span className="text-xs">⚽</span>
              <span className="font-semibold text-[10px] sm:text-xs leading-none">
                Vívelo por la app
              </span>
            </div>

            {/* entel TV Logo */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-3.5 border border-white/80 rounded flex items-center justify-center">
                <div className="w-2 h-1.5 bg-emerald-400 rounded-sm" />
              </div>
              <span className="font-montserrat font-bold text-xs lowercase">entel</span>
              <span className="text-[9px] font-black uppercase text-slate-300">TV</span>
            </div>

            <div className="h-3 w-[1px] bg-white/40 hidden sm:block" />

            {/* entel gol Red Pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] sm:text-[11px] font-black shadow-sm">
              <span className="font-montserrat font-bold lowercase text-white">entel</span>
              <span className="italic font-anton uppercase text-white tracking-wide">gol</span>
            </div>

            {/* Channel Numbers */}
            <span className="text-slate-200 text-[10px] sm:text-xs font-bold">
              Canal 56 | 57
            </span>
          </div>

          {/* Right Chevrons */}
          <span className="font-black tracking-tighter text-sm text-slate-300">
            &lt;&lt;&lt;&lt;
          </span>
        </div>
      </DraggableLayer>

      {/* 6. USER-ADDED CUSTOM LAYERS (Floating draggable badges/stickers) */}
      {customLayers.map(cl => (
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
