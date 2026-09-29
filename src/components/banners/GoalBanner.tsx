import React from 'react';
import { TemplateData } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { Youtube, Flame, Clock, Radio } from 'lucide-react';

interface GoalBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  onSelectScoringClub?: () => void;
  onOpenCompetitionPicker?: () => void;
}

export const GoalBanner: React.FC<GoalBannerProps> = ({
  data,
  branding,
  format,
  onSelectScoringClub,
  onOpenCompetitionPicker
}) => {
  const { scoringClubId, opponentClubId, playerName, playerNumber, minute, goalType, homeScore, awayScore, assistBy } = data.goal;
  const scoringClub = getClubById(scoringClubId);
  const opponentClub = getClubById(opponentClubId);
  const competition = getCompetitionById(data.competitionId);

  const isVertical = format.id === 'tiktok-story';
  const isCyber = branding.theme === 'neon-gaming';

  return (
    <div
      id="soccer-banner-capture"
      className={`relative w-full h-full overflow-hidden flex flex-col justify-between select-none ${
        isCyber
          ? 'bg-[#050811] text-white'
          : 'bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-white'
      }`}
    >
      {/* Background Graphic: Blazing energy explosion & team colors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Giant color burst behind goalscorer */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${scoringClub.primaryColor} 0%, transparent 65%),
                         radial-gradient(circle at 15% 15%, #eab308 0%, transparent 40%),
                         linear-gradient(to bottom, #050811 0%, #0f172a 50%, #03060c 100%)`
          }}
        />

        {/* Diagonal Ray Beam Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-emerald-500/10 transform rotate-12 pointer-events-none" />

        {/* Sparkles / Carbon Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(234, 179, 8, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Corner Neon Framing */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-yellow-400" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-400" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-yellow-400" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-400" />
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center ${isVertical ? 'pt-10' : 'pt-4'}`}>
        <div className="flex items-center justify-between w-full max-w-4xl mb-2">
          <div className="flex items-center gap-2">
            <ChannelLogoBadge branding={branding} size="sm" />
            <div className="text-left">
              <span className="block text-xs font-black text-emerald-400 font-orbitron">{branding.channelName}</span>
              <span className="block text-[9px] text-slate-400 font-bold">{branding.tagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-lg animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>EN VIVO</span>
            </div>
          </div>
        </div>

        {/* Competition Badge */}
        <div
          onClick={onOpenCompetitionPicker}
          className="cursor-pointer hover:scale-105 transition-transform flex items-center gap-2"
          title="Clic para cambiar torneo"
        >
          <CompetitionBadge competition={competition} size="sm" />
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest font-montserrat">
            {data.tournament}
          </span>
        </div>
      </div>

      {/* CENTER: MASSIVE ¡¡¡GOOOOL!!! EXPLOSION */}
      <div className="relative z-10 flex-1 px-4 sm:px-8 py-2 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center">
        {/* Blazing GOOOOL Title */}
        <div className="relative mb-2">
          <span className="font-anton text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase italic drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600">
            ¡¡¡GOOOOL!!!
          </span>
          <div className="absolute -top-3 right-0 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-red-400 animate-bounce">
            <Flame className="w-3.5 h-3.5 inline mr-1" />
            {goalType}
          </div>
        </div>

        {/* Scoring Club Crest & Player Details */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-2 bg-slate-950/70 p-4 sm:p-6 rounded-3xl border border-yellow-500/40 backdrop-blur-md shadow-2xl">
          {/* Club Crest with Golden Halo */}
          <div
            onClick={onSelectScoringClub}
            className="cursor-pointer hover:scale-105 transition-transform relative"
            title="Clic para cambiar club que anota"
          >
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-80"
              style={{ backgroundColor: scoringClub.primaryColor }}
            />
            <ClubBadge club={scoringClub} size={isVertical ? '2xl' : 'xl'} className="relative z-10" glow />
          </div>

          {/* Player Name and Jersey Number */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 font-anton text-xl flex items-center justify-center shadow-lg">
                {playerNumber || 10}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest font-rajdhani">
                {scoringClub.name}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-anton uppercase text-white tracking-wide drop-shadow-md">
              {playerName || 'RAMIRO VACA'}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
              {/* Minute badge */}
              <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full text-xs font-black font-orbitron">
                <Clock className="w-3.5 h-3.5" />
                <span>MINUTO {minute || "24'"}</span>
              </div>

              {assistBy && (
                <span className="text-xs text-slate-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  Pase de: <strong className="text-white">{assistBy}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Scoreboard snapshot */}
        <div className="mt-3 flex items-center justify-center gap-4 bg-slate-900/90 px-6 py-2 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-white font-montserrat">{scoringClub.shortName}</span>
            <span className="font-anton text-2xl text-yellow-400">{homeScore}</span>
          </div>
          <span className="text-slate-500 font-bold">-</span>
          <div className="flex items-center gap-2">
            <span className="font-anton text-2xl text-slate-400">{awayScore}</span>
            <span className="font-black text-sm text-slate-300 font-montserrat">{opponentClub.shortName}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`relative z-10 shrink-0 w-full px-6 py-3 border-t border-yellow-500/30 bg-slate-950/95 ${isVertical ? 'pb-8' : ''}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">Vívelo en vivo con:</span>
            <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded text-white font-black text-xs shadow-md">
              <Youtube className="w-3.5 h-3.5" />
              <span>{branding.youtubeHandle}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1 rounded font-black text-xs shadow-md">
              <span>{branding.kickHandle}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-xs font-black text-yellow-400 font-orbitron">{branding.channelName}</span>
            <span className="block text-[9px] text-slate-400">{branding.tagline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
