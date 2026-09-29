import React from 'react';
import { TemplateData } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { Youtube, Activity, CheckCircle2 } from 'lucide-react';

interface ResultBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  onSelectClubToSwap?: (side: 'home' | 'away') => void;
  onOpenCompetitionPicker?: () => void;
}

export const ResultBanner: React.FC<ResultBannerProps> = ({
  data,
  branding,
  format,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const homeClub = getClubById(data.singleMatch.homeClubId);
  const awayClub = getClubById(data.singleMatch.awayClubId);
  const competition = getCompetitionById(data.competitionId);
  const { stats, scorers, homeScore, awayScore } = data.singleMatch;

  const isVertical = format.id === 'tiktok-story';
  const isCyber = branding.theme === 'neon-gaming';

  const homeScorers = scorers.filter(s => s.team === 'home');
  const awayScorers = scorers.filter(s => s.team === 'away');

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
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 10% 20%, ${homeClub.primaryColor} 0%, transparent 50%),
                         radial-gradient(circle at 90% 20%, ${awayClub.primaryColor} 0%, transparent 50%),
                         linear-gradient(to bottom, #050811 0%, #0c1222 50%, #03060c 100%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.25) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(34, 197, 94, 0.25) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center ${isVertical ? 'pt-8' : 'pt-4'}`}>
        <div className="flex items-center justify-between w-full max-w-4xl mb-1">
          <div className="flex items-center gap-2">
            <ChannelLogoBadge branding={branding} size="sm" />
            <div className="text-left">
              <span className="block text-xs font-black text-emerald-400 font-orbitron">{branding.channelName}</span>
              <span className="block text-[9px] text-slate-400 font-bold">{branding.tagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RESULTADO FINAL</span>
          </div>
        </div>

        {/* Real Tournament Badge */}
        <div
          onClick={onOpenCompetitionPicker}
          className="cursor-pointer hover:scale-105 transition-transform flex flex-col items-center"
          title="Clic para cambiar torneo"
        >
          <div className="h-14 flex items-center justify-center">
            <CompetitionBadge competition={competition} size="md" />
          </div>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-rajdhani mt-0.5">
            {data.roundTitle} • {data.dateRange}
          </span>
        </div>
      </div>

      {/* SCOREBOARD SECTION */}
      <div className="relative z-10 flex-1 px-4 sm:px-8 py-2 flex flex-col justify-center max-w-4xl mx-auto w-full">
        {/* Teams and Big Scores */}
        <div className="grid grid-cols-3 items-center bg-slate-900/80 rounded-2xl p-4 border border-emerald-500/30 backdrop-blur-md shadow-2xl">
          {/* Home Team */}
          <div
            onClick={() => onSelectClubToSwap && onSelectClubToSwap('home')}
            className="flex flex-col items-center cursor-pointer hover:opacity-85 transition-opacity"
            title="Clic para cambiar equipo"
          >
            <ClubBadge club={homeClub} size={isVertical ? 'lg' : 'xl'} glow />
            <h3 className="mt-2 text-base sm:text-lg font-black font-anton uppercase tracking-wide text-center">
              {homeClub.name}
            </h3>
            {homeScore > awayScore && (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 mt-1">
                GANADOR
              </span>
            )}
          </div>

          {/* Center Score Digits */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-14 sm:w-18 h-16 sm:h-20 bg-slate-950 rounded-xl border-2 border-emerald-500/60 flex items-center justify-center shadow-lg">
                <span className="font-anton text-4xl sm:text-5xl text-emerald-400">
                  {homeScore}
                </span>
              </div>
              <span className="font-anton text-3xl text-slate-500">-</span>
              <div className="w-14 sm:w-18 h-16 sm:h-20 bg-slate-950 rounded-xl border-2 border-cyan-500/60 flex items-center justify-center shadow-lg">
                <span className="font-anton text-4xl sm:text-5xl text-cyan-400">
                  {awayScore}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-2">TIEMPO COMPLETO</span>
          </div>

          {/* Away Team */}
          <div
            onClick={() => onSelectClubToSwap && onSelectClubToSwap('away')}
            className="flex flex-col items-center cursor-pointer hover:opacity-85 transition-opacity"
            title="Clic para cambiar equipo"
          >
            <ClubBadge club={awayClub} size={isVertical ? 'lg' : 'xl'} glow />
            <h3 className="mt-2 text-base sm:text-lg font-black font-anton uppercase tracking-wide text-center">
              {awayClub.name}
            </h3>
            {awayScore > homeScore && (
              <span className="text-[10px] font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 mt-1">
                GANADOR
              </span>
            )}
          </div>
        </div>

        {/* Goalscorers List */}
        <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="space-y-1">
            {homeScorers.length === 0 ? (
              <span className="text-slate-500 italic text-[11px]">Sin anotaciones</span>
            ) : (
              homeScorers.map(s => (
                <div key={s.id} className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-emerald-400">⚽</span>
                  <span className="font-bold">{s.minute}</span>
                  <span className="font-montserrat truncate">{s.player}</span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-1 text-right">
            {awayScorers.length === 0 ? (
              <span className="text-slate-500 italic text-[11px]">Sin anotaciones</span>
            ) : (
              awayScorers.map(s => (
                <div key={s.id} className="flex items-center justify-end gap-1.5 text-slate-200">
                  <span className="font-montserrat truncate">{s.player}</span>
                  <span className="font-bold">{s.minute}</span>
                  <span className="text-cyan-400">⚽</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* REAL-TIME STATS COMPARISON BARS */}
        <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-center gap-1 text-[11px] font-black text-emerald-400 uppercase tracking-wider mb-1 font-montserrat">
            <Activity className="w-3.5 h-3.5" />
            <span>Estadísticas del Encuentro</span>
          </div>

          {/* Possession Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>{stats.possessionHome}%</span>
              <span className="text-slate-400 uppercase text-[10px]">Posesión de Balón</span>
              <span>{stats.possessionAway}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${stats.possessionHome}%` }} />
              <div className="bg-cyan-500 h-full" style={{ width: `${stats.possessionAway}%` }} />
            </div>
          </div>

          {/* Key Metric Numbers Row */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Tiros al Arco</span>
              <span className="font-black text-emerald-400">{stats.shotsOnTargetHome}</span>
              <span className="text-slate-500 mx-1">-</span>
              <span className="font-black text-cyan-400">{stats.shotsOnTargetAway}</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Tiros Totales</span>
              <span className="font-black text-emerald-400">{stats.shotsHome}</span>
              <span className="text-slate-500 mx-1">-</span>
              <span className="font-black text-cyan-400">{stats.shotsAway}</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Faltas</span>
              <span className="font-black text-slate-300">{stats.foulsHome}</span>
              <span className="text-slate-500 mx-1">-</span>
              <span className="font-black text-slate-300">{stats.foulsAway}</span>
            </div>
            <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">T. Amarillas</span>
              <span className="font-black text-yellow-400">{stats.yellowCardsHome}</span>
              <span className="text-slate-500 mx-1">-</span>
              <span className="font-black text-yellow-400">{stats.yellowCardsAway}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`relative z-10 shrink-0 w-full px-6 py-2.5 border-t border-slate-800 bg-slate-950/95 ${isVertical ? 'pb-8' : ''}`}>
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
      </div>
    </div>
  );
};
