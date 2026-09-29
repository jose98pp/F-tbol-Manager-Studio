import React from 'react';
import { TemplateData } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getClubById } from '../../data/clubs';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { Youtube, Users, UserCheck } from 'lucide-react';

interface LineupBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  onSelectClubToSwap?: () => void;
  onOpenCompetitionPicker?: () => void;
}

export const LineupBanner: React.FC<LineupBannerProps> = ({
  data,
  branding,
  format,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const club = getClubById(data.lineup.clubId);
  const competition = getCompetitionById(data.competitionId);
  const { starters, substitutes, formation, coach } = data.lineup;

  const isVertical = format.id === 'tiktok-story';
  const isCyber = branding.theme === 'neon-gaming';

  // Group starters by position
  const gks = starters.filter(p => p.position === 'POR');
  const defs = starters.filter(p => p.position === 'DEF');
  const mids = starters.filter(p => p.position === 'MED');
  const fwds = starters.filter(p => p.position === 'DEL');

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
      {/* Background Graphic: Stadium pitch aura with team colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 25%, ${club.primaryColor} 0%, transparent 65%),
                         linear-gradient(to bottom, #050811 0%, #0d1527 60%, #03060c 100%)`
          }}
        />

        {/* Tactical pitch chalk lines in the background */}
        <div className="absolute inset-4 rounded-2xl border-2 border-white/10 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-24 border-b-2 border-l-2 border-r-2 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-24 border-t-2 border-l-2 border-r-2 border-white/10" />
        </div>

        {isCyber && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.25) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(34, 197, 94, 0.25) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        )}
      </div>

      {/* TOP HEADER */}
      <div className={`relative z-10 px-6 text-center flex flex-col items-center ${isVertical ? 'pt-8' : 'pt-4'}`}>
        <div className="flex items-center justify-between w-full max-w-4xl mb-2">
          <div className="flex items-center gap-2">
            <ChannelLogoBadge branding={branding} size="sm" />
            <div className="text-left">
              <span className="block text-xs font-black text-emerald-400 font-orbitron">{branding.channelName}</span>
              <span className="block text-[9px] text-slate-400 font-bold">{branding.tagline}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
            <Users className="w-3.5 h-3.5" />
            <span>ALINEACIÓN CONFIRMADA</span>
          </div>
        </div>

        {/* Club Badge + Title */}
        <div className="flex items-center justify-center gap-3">
          <div
            onClick={onSelectClubToSwap}
            className="cursor-pointer hover:scale-105 transition-transform"
            title="Clic para cambiar de equipo"
          >
            <ClubBadge club={club} size="lg" glow />
          </div>

          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black font-anton uppercase text-white tracking-wide">
              {club.name}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black font-orbitron text-[11px]">
                {formation}
              </span>
              <span className="text-slate-300 font-medium">DT: {coach}</span>
            </div>
          </div>

          <div
            onClick={onOpenCompetitionPicker}
            className="cursor-pointer hover:scale-105 transition-transform ml-2 hidden sm:block"
            title="Clic para cambiar torneo"
          >
            <CompetitionBadge competition={competition} size="sm" />
          </div>
        </div>
      </div>

      {/* CENTER: STARTING 11 LIST / TACTICAL BOARD */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 py-2 overflow-hidden flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3 sm:p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-md shadow-2xl">
          {/* Column 1: Starters 1-6 (Goalkeeper & Defense) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block font-montserrat mb-1">
              Arquero & Defensas
            </span>
            {[...gks, ...defs].map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-anton flex items-center justify-center text-sm shadow">
                    {p.number}
                  </span>
                  <span className="font-bold text-white font-montserrat text-xs sm:text-sm">
                    {p.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.isCaptain && (
                    <span className="px-1.5 py-0.2 bg-yellow-400 text-slate-950 font-black text-[10px] rounded shadow">
                      C
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {p.position}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Starters 7-11 (Midfield & Attack) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block font-montserrat mb-1">
              Mediocampo & Delanteros
            </span>
            {[...mids, ...fwds].map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-cyan-400 font-anton flex items-center justify-center text-sm shadow">
                    {p.number}
                  </span>
                  <span className="font-bold text-white font-montserrat text-xs sm:text-sm">
                    {p.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.isCaptain && (
                    <span className="px-1.5 py-0.2 bg-yellow-400 text-slate-950 font-black text-[10px] rounded shadow">
                      C
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {p.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Substitutes Bar */}
        {substitutes && substitutes.length > 0 && (
          <div className="mt-2.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
            <span className="font-bold text-yellow-400 mr-1.5 uppercase text-[10px]">Banca de Suplentes:</span>
            <span>{substitutes.map(s => `${s.number}. ${s.name}`).join(' • ')}</span>
          </div>
        )}
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
