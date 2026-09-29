import React from 'react';
import { TemplateData, FixtureMatch } from '../data/templates';
import { Club, getClubById, CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import {
  Shield,
  ArrowLeftRight,
  Info,
  Plus,
  Trash2,
  Calendar,
  Users,
  Flame,
  Trophy,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface ActiveBannerTeamsBarProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  onOpenClubPicker: (context: {
    target: 'fixture' | 'versus-home' | 'versus-away' | 'standings' | 'lineup' | 'goal-scorer' | 'goal-opponent';
    matchId?: string;
    side?: 'home' | 'away';
    standingsIndex?: number;
  }) => void;
  onOpenClubInfo: (club: Club) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ActiveBannerTeamsBar: React.FC<ActiveBannerTeamsBarProps> = ({
  data,
  onUpdateData,
  onOpenClubPicker,
  onOpenClubInfo,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Invert home and away teams for a single match or whole fixture
  const handleInvertVersus = () => {
    onUpdateData({
      ...data,
      singleMatch: {
        ...data.singleMatch,
        homeClubId: data.singleMatch.awayClubId,
        awayClubId: data.singleMatch.homeClubId,
        homeScore: data.singleMatch.awayScore,
        awayScore: data.singleMatch.homeScore
      }
    });
  };

  const handleInvertFixtureMatch = (matchId: string) => {
    const updated = data.fixtureMatches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          homeClubId: m.awayClubId,
          awayClubId: m.homeClubId
        };
      }
      return m;
    });
    onUpdateData({ ...data, fixtureMatches: updated });
  };

  // Load exact photo preset (Copa Paceña Fecha 6)
  const handleLoadPhotoPreset = () => {
    onUpdateData({
      ...data,
      competitionId: 'copa-pacena',
      tournament: 'COPA PACEÑA',
      roundTitle: 'FECHA 6',
      dateRange: '29 SEP/ 01 OCT',
      fixtureMatches: [
        { id: 'f1', day: 'MARTES', homeClubId: 'universitario-vinto', awayClubId: 'guabira', dateStr: 'MAR 29 / 15:00', stadium: 'Hipólito Lazarte' },
        { id: 'f2', day: 'MARTES', homeClubId: 'real-potosi', awayClubId: 'abb', dateStr: 'MAR 29 / 18:00', stadium: 'Víctor Agustín Ugarte' },
        { id: 'f3', day: 'MARTES', homeClubId: 'aurora', awayClubId: 'san-antonio', dateStr: 'SAB 19 / 20:00', stadium: 'Félix Capriles' },
        { id: 'f4', day: 'MIÉRCOLES', homeClubId: 'real-oruro', awayClubId: 'always-ready', dateStr: 'MIÉ 30 / 15:00', stadium: 'Jesús Bermúdez' },
        { id: 'f5', day: 'MIÉRCOLES', homeClubId: 'real-tomayapo', awayClubId: 'nacional-potosi', dateStr: 'MIÉ 30 / 18:30', stadium: 'IV Centenario' },
        { id: 'f6', day: 'MIÉRCOLES', homeClubId: 'oriente-petrolero', awayClubId: 'the-strongest', dateStr: 'MIÉ 30 / 20:30', stadium: 'Tahuichi Aguilera' },
        { id: 'f7', day: 'JUEVES', homeClubId: 'bolivar', awayClubId: 'gv-san-jose', dateStr: 'JUE 01 / 18:30', stadium: 'Hernando Siles' },
        { id: 'f8', day: 'JUEVES', homeClubId: 'blooming', awayClubId: 'independiente-petrolero', dateStr: 'JUE 01 / 20:30', stadium: 'Tahuichi Aguilera' }
      ]
    });
  };

  const handleAddFixtureMatch = () => {
    // Pick two random clubs not already in first match
    const unusedClubs = CLUBS.filter(
      c => !data.fixtureMatches.some(m => m.homeClubId === c.id || m.awayClubId === c.id)
    );
    const home = unusedClubs[0] || CLUBS[0];
    const away = unusedClubs[1] || CLUBS[1];

    const newMatch: FixtureMatch = {
      id: `match-${Date.now()}`,
      day: 'JUEVES',
      homeClubId: home.id,
      awayClubId: away.id,
      dateStr: '01 OCT • 20:30',
      stadium: home.stadium || 'Estadio Principal'
    };

    onUpdateData({
      ...data,
      fixtureMatches: [...data.fixtureMatches, newMatch]
    });
  };

  const handleDeleteFixtureMatch = (matchId: string) => {
    if (data.fixtureMatches.length <= 1) return;
    onUpdateData({
      ...data,
      fixtureMatches: data.fixtureMatches.filter(m => m.id !== matchId)
    });
  };

  // Quick randomizer for all teams in active template
  const handleRandomizeClubs = () => {
    const shuffled = [...CLUBS].sort(() => 0.5 - Math.random());
    if (data.type === 'versus' || data.type === 'result') {
      onUpdateData({
        ...data,
        singleMatch: {
          ...data.singleMatch,
          homeClubId: shuffled[0].id,
          awayClubId: shuffled[1].id
        }
      });
    } else if (data.type === 'fixture') {
      const updated = data.fixtureMatches.map((m, idx) => ({
        ...m,
        homeClubId: shuffled[(idx * 2) % shuffled.length].id,
        awayClubId: shuffled[(idx * 2 + 1) % shuffled.length].id
      }));
      onUpdateData({ ...data, fixtureMatches: updated });
    }
  };

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 shrink-0 text-xs">
      {/* Title & Quick Actions Header */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px] sm:text-xs font-montserrat truncate">
            Equipos en este Banner
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-emerald-400 font-bold font-mono shrink-0">
            {data.type === 'fixture'
              ? `${data.fixtureMatches.length * 2} clubes (${data.fixtureMatches.length} partidos)`
              : data.type === 'versus' || data.type === 'result'
              ? '2 clubes (Duelo Directo)'
              : data.type === 'lineup'
              ? '1 club + 11 titulares'
              : data.type === 'goal'
              ? '2 clubes (Goleador vs Rival)'
              : `${data.standings.length} clubes en tabla`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(data.type === 'versus' || data.type === 'result' || data.type === 'fixture') && (
            <button
              onClick={handleRandomizeClubs}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
              title="Aleatorizar equipos con clubes del catálogo"
            >
              <Shuffle className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Aleatorizar</span>
            </button>
          )}

          {data.type === 'fixture' && (
            <>
              <button
                onClick={handleLoadPhotoPreset}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                title="Cargar los 8 partidos oficiales de la Fecha 6 (Copa Paceña) como en la foto"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="hidden sm:inline">Plantilla Fecha 6</span>
                <span className="sm:hidden">Fecha 6</span>
              </button>
              <button
                onClick={handleAddFixtureMatch}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors cursor-pointer"
                title="Agregar otro partido al fixture"
              >
                <Plus className="w-3 h-3" />
                <span>+ Partido</span>
              </button>
            </>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title={isCollapsed ? 'Mostrar equipos' : 'Ocultar barra de equipos'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Team Badges & Match Rows */}
      {!isCollapsed && (
        <div className="p-2 sm:p-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* FIXTURE TEMPLATE: All matches with clubs */}
          {data.type === 'fixture' && (
            <div className="flex items-center gap-2.5 min-w-max">
              {data.fixtureMatches.map((match, idx) => {
                const homeClub = getClubById(match.homeClubId);
                const awayClub = getClubById(match.awayClubId);

                return (
                  <div
                    key={match.id}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center gap-2 shadow-sm transition-all shrink-0"
                  >
                    <span className="text-[10px] font-mono text-slate-500 font-bold px-1 py-0.5 rounded bg-slate-900 border border-slate-800">
                      #{idx + 1}
                    </span>

                    {/* Home Club */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenClubPicker({ target: 'fixture', matchId: match.id, side: 'home' })}
                        className="group flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/80 transition-all cursor-pointer"
                        title={`Cambiar escudo local (${homeClub.name})`}
                      >
                        <ClubBadge club={homeClub} size="sm" />
                        <div className="text-left">
                          <span className="text-[11px] font-black text-white block max-w-[85px] truncate font-montserrat">
                            {homeClub.shortName}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-semibold">Local</span>
                        </div>
                      </button>

                      <button
                        onClick={() => onOpenClubInfo(homeClub)}
                        className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer"
                        title="Ver detalles y jugadores"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Swap Home/Away button */}
                    <button
                      onClick={() => handleInvertFixtureMatch(match.id)}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors cursor-pointer"
                      title="Invertir local y visitante"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                    </button>

                    {/* Away Club */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenClubPicker({ target: 'fixture', matchId: match.id, side: 'away' })}
                        className="group flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/80 transition-all cursor-pointer"
                        title={`Cambiar escudo visitante (${awayClub.name})`}
                      >
                        <ClubBadge club={awayClub} size="sm" />
                        <div className="text-left">
                          <span className="text-[11px] font-black text-white block max-w-[85px] truncate font-montserrat">
                            {awayClub.shortName}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-semibold">Visita</span>
                        </div>
                      </button>

                      <button
                        onClick={() => onOpenClubInfo(awayClub)}
                        className="p-1 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer"
                        title="Ver detalles y jugadores"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>

                    {data.fixtureMatches.length > 1 && (
                      <button
                        onClick={() => handleDeleteFixtureMatch(match.id)}
                        className="p-1 text-slate-600 hover:text-red-400 cursor-pointer ml-1"
                        title="Eliminar este partido"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* VERSUS & RESULT TEMPLATES: Home vs Away */}
          {(data.type === 'versus' || data.type === 'result') && (
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Home Card */}
              {(() => {
                const homeClub = getClubById(data.singleMatch.homeClubId);
                return (
                  <div className="flex-1 sm:flex-initial flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <button
                      onClick={() => onOpenClubPicker({ target: 'versus-home', side: 'home' })}
                      className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left"
                      title="Clic para cambiar club local"
                    >
                      <ClubBadge club={homeClub} size="md" glow />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white font-montserrat">{homeClub.name}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            LOCAL
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {homeClub.stadium || homeClub.city || 'Estadio Principal'}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => onOpenClubInfo(homeClub)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer ml-1"
                      title="Ver jugadores de este club"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })()}

              {/* Invert Button */}
              <button
                onClick={handleInvertVersus}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs transition-colors cursor-pointer shrink-0 shadow"
                title="Invertir local y visitante"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invertir</span>
              </button>

              {/* Away Card */}
              {(() => {
                const awayClub = getClubById(data.singleMatch.awayClubId);
                return (
                  <div className="flex-1 sm:flex-initial flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <button
                      onClick={() => onOpenClubPicker({ target: 'versus-away', side: 'away' })}
                      className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left"
                      title="Clic para cambiar club visitante"
                    >
                      <ClubBadge club={awayClub} size="md" glow />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white font-montserrat">{awayClub.name}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            VISITA
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          DT: {awayClub.coach || 'Director Técnico'}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => onOpenClubInfo(awayClub)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 cursor-pointer ml-1"
                      title="Ver jugadores de este club"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* LINEUP TEMPLATE: Team + 11 Starters overview */}
          {data.type === 'lineup' && (
            (() => {
              const currentClub = getClubById(data.lineup.clubId);
              return (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-950/90 border border-slate-800 shrink-0">
                    <ClubBadge club={currentClub} size="sm" />
                    <div>
                      <span className="text-xs font-black text-white block">{currentClub.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        Formación {data.lineup.formation} • DT {data.lineup.coach}
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenClubPicker({ target: 'lineup' })}
                      className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold ml-1 cursor-pointer"
                    >
                      Cambiar Club
                    </button>
                  </div>

                  {/* Starters quick chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                    {data.lineup.starters.map((p, idx) => (
                      <span
                        key={p.id || idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 whitespace-nowrap flex items-center gap-1 font-mono"
                      >
                        <span className="text-emerald-400 font-bold">{p.number}</span>
                        <span>{p.name.split(' ').pop()}</span>
                        {p.isCaptain && <span className="text-yellow-400 font-black">©</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()
          )}

          {/* GOAL TEMPLATE */}
          {data.type === 'goal' && (
            (() => {
              const scoringClub = getClubById(data.goal.scoringClubId);
              const opponentClub = getClubById(data.goal.opponentClubId);
              return (
                <div className="flex items-center gap-3">
                  {/* Scorer team */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                    <ClubBadge club={scoringClub} size="sm" />
                    <div>
                      <span className="text-xs font-black text-white block font-montserrat">{scoringClub.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        ⚽ {data.goal.playerName} (#{data.goal.playerNumber}) • Minuto {data.goal.minute}
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenClubPicker({ target: 'goal-scorer' })}
                      className="text-[10px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold ml-1 cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>

                  <span className="text-xs font-black text-slate-500">VS</span>

                  {/* Opponent team */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
                    <ClubBadge club={opponentClub} size="sm" />
                    <div>
                      <span className="text-xs font-black text-white block font-montserrat">{opponentClub.name}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Rival</span>
                    </div>
                    <button
                      onClick={() => onOpenClubPicker({ target: 'goal-opponent' })}
                      className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold ml-1 cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              );
            })()
          )}

          {/* STANDINGS TEMPLATE */}
          {data.type === 'standings' && (
            <div className="flex items-center gap-1.5 overflow-x-auto min-w-max">
              {data.standings.map((row, idx) => {
                const club = getClubById(row.clubId);
                return (
                  <button
                    key={`${row.clubId}-${idx}`}
                    onClick={() => onOpenClubPicker({ target: 'standings', standingsIndex: idx })}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shrink-0"
                    title={`Posición #${row.position}: ${club.name}. Clic para cambiar club.`}
                  >
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">#{row.position}</span>
                    <ClubBadge club={club} size="xs" />
                    <span className="text-[11px] font-bold text-white max-w-[80px] truncate">{club.shortName}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-black">{row.points}pts</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
