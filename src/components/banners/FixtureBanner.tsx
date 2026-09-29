import React from 'react';
import { TemplateData, FixtureMatch } from '../../data/templates';
import { ChannelBranding, BannerFormat } from '../../data/branding';
import { getCompetitionById } from '../../data/competitions';
import { ClubBadge } from '../ClubBadge';
import { ChannelLogoBadge } from '../ChannelLogoBadge';
import { CompetitionBadge } from '../CompetitionBadge';
import { Youtube, Calendar, Sparkles } from 'lucide-react';

interface FixtureBannerProps {
  data: TemplateData;
  branding: ChannelBranding;
  format: BannerFormat;
  onEditMatch?: (match: FixtureMatch) => void;
  onSelectClubToSwap?: (matchId: string, side: 'home' | 'away') => void;
  onOpenCompetitionPicker?: () => void;
}

export const FixtureBanner: React.FC<FixtureBannerProps> = ({
  data,
  branding,
  format,
  onEditMatch,
  onSelectClubToSwap,
  onOpenCompetitionPicker
}) => {
  const competition = getCompetitionById(data.competitionId);

  // Group matches by day
  const groupedMatches: { [day: string]: FixtureMatch[] } = {};
  data.fixtureMatches.forEach(m => {
    const dayKey = m.day || 'PARTIDOS';
    if (!groupedMatches[dayKey]) groupedMatches[dayKey] = [];
    groupedMatches[dayKey].push(m);
  });

  const days = Object.keys(groupedMatches);

  const isVertical = format.id === 'tiktok-story';
  const isLandscape = format.id === 'horizontal-16-9';
  const isCyber = branding.theme === 'neon-gaming';

  return (
    <div
      id="soccer-banner-capture"
      className={`relative w-full h-full overflow-hidden flex flex-col justify-between select-none ${
        isCyber
          ? 'bg-[#060a12] text-white'
          : competition.headerTheme === 'libertadores'
          ? 'bg-gradient-to-b from-stone-950 via-zinc-950 to-black text-slate-100'
          : competition.headerTheme === 'champions'
          ? 'bg-gradient-to-b from-[#030b20] via-[#05112e] to-black text-slate-100'
          : 'bg-gradient-to-b from-zinc-900 via-neutral-900 to-black text-slate-100'
      }`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Background Graphic: Stadium Crowd + Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stadium Floodlights & Vignette */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-luminosity filter blur-[0.5px]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 15%, ${competition.primaryColor} 0%, transparent 65%),
              radial-gradient(circle at 10% 90%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 90% 90%, ${competition.accentColor} 0%, transparent 50%),
              linear-gradient(to bottom, rgba(5,8,16,0.94) 0%, rgba(10,15,26,0.85) 50%, rgba(2,4,8,0.98) 100%)`
          }}
        />

        {/* Cyber Grid for Gaming Theme */}
        {isCyber && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        )}

        {/* Elegant Corner Framing */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-slate-500/50 pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-slate-500/50 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-slate-500/50 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-slate-500/50 pointer-events-none" />
      </div>

      {/* TOP HEADER SECTION */}
      <div className={`relative z-10 px-6 pt-3 pb-1 text-center flex flex-col items-center shrink-0 ${isVertical ? 'pt-8' : 'pt-4'}`}>
        {/* Top Channel Sponsor Bar */}
        <div className="flex items-center justify-between w-full max-w-5xl mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 font-orbitron uppercase">
              {branding.channelName}
            </span>
            <span className="text-[9px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700">
              {competition.sponsorText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {branding.showYoutube && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-red-600/90 px-2 py-0.5 rounded shadow">
                <Youtube className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">YOUTUBE:</span> {branding.youtubeHandle}
              </div>
            )}
            {branding.showKick && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-950 bg-emerald-400 px-2 py-0.5 rounded shadow">
                <span className="font-black text-xs">K</span>
                <span className="hidden sm:inline">{branding.kickHandle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tournament Crest Badge - Clickable to change competition */}
        <div
          onClick={onOpenCompetitionPicker}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
          title="Clic para cambiar competencia o torneo"
        >
          {/* Real Competition Badge */}
          <div className="h-16 flex items-center justify-center drop-shadow-lg">
            <CompetitionBadge competition={competition} size="md" />
          </div>

          {/* Main FIXTURE title with bold outlined sports typography */}
          <h1
            className={`font-black tracking-wider uppercase font-anton drop-shadow-md mt-0.5 ${
              isVertical ? 'text-4xl' : 'text-3xl sm:text-4xl'
            } text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300`}
          >
            {data.roundTitle || 'FIXTURE'}
          </h1>

          {/* Date Range Subtitle */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-0.5 w-6 bg-emerald-500/60" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-400 font-rajdhani">
              {data.dateRange || 'FECHA 6 • 29 SEP / 01 OCT'}
            </span>
            <div className="h-0.5 w-6 bg-emerald-500/60" />
          </div>
        </div>
      </div>

      {/* MATCHES CONTAINER SECTION */}
      <div className="relative z-10 flex-1 px-4 sm:px-6 py-1.5 overflow-hidden flex flex-col justify-center">
        <div
          className={`w-full max-w-5xl mx-auto gap-3 ${
            isVertical
              ? 'flex flex-col space-y-2'
              : isLandscape
              ? 'grid grid-cols-3'
              : 'grid grid-cols-1 md:grid-cols-2'
          }`}
        >
          {days.map(dayKey => {
            const matches = groupedMatches[dayKey];
            return (
              <div
                key={dayKey}
                className={`rounded-2xl p-2.5 sm:p-3 backdrop-blur-md transition-all ${
                  isCyber
                    ? 'bg-slate-900/85 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                    : 'bg-white/95 text-slate-900 border border-slate-200/90 shadow-xl'
                }`}
              >
                {/* Day Header */}
                <div
                  className={`text-center font-black uppercase tracking-wider text-xs sm:text-sm pb-1 mb-2 border-b flex items-center justify-center gap-1.5 ${
                    isCyber
                      ? 'text-emerald-400 border-emerald-500/30'
                      : 'text-slate-800 border-slate-300'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 opacity-80" />
                  <span className="font-montserrat">{dayKey}</span>
                </div>

                {/* Match rows list */}
                <div className="space-y-2">
                  {matches.map(match => (
                    <div
                      key={match.id}
                      onClick={() => onEditMatch && onEditMatch(match)}
                      className={`group relative flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer ${
                        isCyber
                          ? 'bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60'
                          : 'bg-slate-100/90 hover:bg-slate-200 border border-slate-200/90'
                      }`}
                    >
                      {/* Left: Home Club badge & name */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClubToSwap && onSelectClubToSwap(match.id, 'home');
                        }}
                        className="flex items-center gap-2 flex-1 min-w-0 pr-1 hover:opacity-85"
                        title="Clic para cambiar escudo local"
                      >
                        <ClubBadge clubId={match.homeClubId} size={isVertical ? 'sm' : 'md'} />
                        <span
                          className={`text-xs font-black truncate font-montserrat ${
                            isCyber ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {match.homeClubId.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Center: VS Badge */}
                      <div className="shrink-0 px-1.5 flex flex-col items-center">
                        <span
                          className={`text-[10px] font-black italic px-1.5 py-0.5 rounded ${
                            isCyber
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          VS
                        </span>
                      </div>

                      {/* Right: Away Club badge & Date/Time */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClubToSwap && onSelectClubToSwap(match.id, 'away');
                        }}
                        className="flex items-center gap-2 flex-1 min-w-0 justify-end pl-1 hover:opacity-85"
                        title="Clic para cambiar escudo visitante"
                      >
                        <span
                          className={`text-xs font-black truncate font-montserrat text-right ${
                            isCyber ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {match.awayClubId.replace(/-/g, ' ').toUpperCase()}
                        </span>
                        <ClubBadge clubId={match.awayClubId} size={isVertical ? 'sm' : 'md'} />
                      </div>

                      {/* Date & Kickoff Time Tag */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.2 rounded-full border border-slate-700 shadow-sm whitespace-nowrap">
                        {match.dateStr}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER BROADCAST BAR */}
      <div className="relative z-10 shrink-0 w-full px-4 sm:px-6 py-2.5 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Left: Chevrons & Call to Action */}
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-black tracking-tighter text-sm hidden sm:inline">&gt;&gt;&gt;&gt;</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-300">Vívelo por el canal:</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                <Youtube className="w-3 h-3 text-red-500" />
                <span>{branding.channelName}</span>
              </div>
            </div>
          </div>

          {/* Center: Channel Logo Badge */}
          <div className="flex items-center gap-2">
            <ChannelLogoBadge branding={branding} size="sm" />
            <div className="text-left hidden md:block">
              <span className="block text-xs font-black text-white font-orbitron">{branding.channelName}</span>
              <span className="block text-[9px] text-emerald-400 font-bold">{branding.tagline}</span>
            </div>
          </div>

          {/* Right: Kick & Social Chevrons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-emerald-400">KICK:</span>
              <span className="text-xs truncate max-w-[120px]">{branding.kickHandle}</span>
            </div>
            <span className="text-emerald-400 font-black tracking-tighter text-sm hidden sm:inline">&lt;&lt;&lt;&lt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
