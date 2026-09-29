import React from 'react';
import { TemplateData } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { Youtube, MapPin, Clock, ShieldCheck, Flame, Radio } from 'lucide-react';

interface VersusBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  onSelectClubToSwap?: (side: 'home' | 'away') => void;
  onOpenCompetitionPicker?: () => void;
}

export const VersusBanner: React.FC<VersusBannerProps> = ({
  data,
  branding,
  format,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const homeClub = getClubById(data.singleMatch.homeClubId);
  const awayClub = getClubById(data.singleMatch.awayClubId);
  const competition = getCompetitionById(data.competitionId);

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
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 20% 40%, ${homeClub.primaryColor} 0%, transparent 60%),
                         radial-gradient(circle at 80% 60%, ${awayClub.primaryColor} 0%, transparent 60%)`
          }}
        />

        {isCyber && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -skew-y-12 pointer-events-none" />

        {/* Outer Corner Accents */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-emerald-400" />
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center ${isVertical ? 'pt-10' : 'pt-4'}`}>
        <div className="flex items-center justify-between w-full max-w-4xl mb-2">
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

        {/* Real Tournament Badge */}
        <div
          onClick={onOpenCompetitionPicker}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
          title="Clic para cambiar torneo"
        >
          <div className="h-16 flex items-center justify-center">
            <CompetitionBadge competition={competition} size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-yellow-400 mt-1">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            <span>{data.singleMatch.statusBadge || 'PARTIDO DE LA FECHA'}</span>
          </div>
        </div>

        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300 mt-1.5 font-rajdhani">
          {data.roundTitle} • {data.dateRange}
        </h2>
      </div>

      {/* CENTER: VS CLASH OF TITANS */}
      <div className="relative z-10 flex-1 px-4 flex flex-col items-center justify-center my-2">
        <div
          className={`w-full max-w-4xl flex items-center justify-around gap-2 ${
            isVertical ? 'flex-col space-y-6 my-auto' : 'flex-row'
          }`}
        >
          {/* HOME TEAM */}
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

          {/* CENTER VS BADGE & TIME */}
          <div className="flex flex-col items-center justify-center shrink-0 px-4">
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
          </div>

          {/* AWAY TEAM */}
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
        </div>

        {/* Stadium & Details */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 font-medium mt-4 bg-slate-950/70 px-6 py-2 rounded-full border border-slate-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{data.singleMatch.stadium}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Árbitro: {data.singleMatch.referee}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`relative z-10 shrink-0 w-full px-6 py-3 border-t border-emerald-500/30 bg-slate-950/95 backdrop-blur-md ${isVertical ? 'pb-8' : ''}`}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-xs font-extrabold text-white font-montserrat">
              {branding.sponsorText || '¡TRANSMISIÓN EN VIVO Y EN ALTA DEFINICIÓN!'}
            </div>
            <div className="text-[11px] text-emerald-400 font-bold">
              Relatos, análisis y las mejores jugadas con {branding.channelName}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 rounded-lg text-white font-black text-xs shadow-md">
              <Youtube className="w-4 h-4" />
              <span>{branding.youtubeHandle}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg font-black text-xs shadow-md">
              <span className="font-extrabold text-sm">K</span>
              <span>{branding.kickHandle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
