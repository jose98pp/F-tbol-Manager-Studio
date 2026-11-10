import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe2,
  Calendar,
  Search,
  X,
  RefreshCw,
  Clock,
  MapPin,
  ChevronRight,
  Shield,
  Zap,
  Check,
  Plus,
  Cloud,
  ExternalLink,
  Flame,
  Trophy,
  Upload,
  AlertCircle,
  Users
} from 'lucide-react';
import { Club } from '../data/clubs';
import { TemplateData, FixtureMatch } from '../data/templates';
import { useFirebase } from '../context/FirebaseContext';

interface EspnTeam {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  score?: number;
  color?: string;
  alternateColor?: string;
}

interface EspnMatchEvent {
  id: string;
  name: string;
  shortName: string;
  date: string;
  dateBolivia: string;
  timeBolivia: string;
  venue?: {
    name?: string;
    city?: string;
  };
  status: {
    state: 'pre' | 'in' | 'post';
    detail: string;
    shortDetail: string;
  };
  homeTeam: EspnTeam;
  awayTeam: EspnTeam;
}

interface EspnScoreboardResponse {
  league: {
    id: string;
    name: string;
    slug: string;
    season?: number;
  };
  events: EspnMatchEvent[];
}

interface EspnRosterPlayer {
  id: string;
  name: string;
  number: number;
  position: 'POR' | 'DEF' | 'MED' | 'DEL';
  photoUrl?: string;
}

interface EspnRosterTeam {
  teamId: string;
  teamName: string;
  logo?: string;
  formation?: string | null;
  coach?: string;
  starters: EspnRosterPlayer[];
  substitutes: EspnRosterPlayer[];
  rosterCount: number;
}

interface EspnMatchSummary {
  eventId: string;
  available: boolean;
  teams: EspnRosterTeam[];
  source: string;
  updatedAt: string;
}

interface EspnMatchExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateData: TemplateData;
  onApplyMatchToBanner: (params: {
    match: EspnMatchEvent;
    leagueName: string;
    targetType?: 'auto' | 'versus' | 'result' | 'goal' | 'fixture';
  }) => void;
  onApplyLineupFromEspn: (params: { match: EspnMatchEvent; leagueName: string; team: EspnRosterTeam }) => void;
}

const POPULAR_LEAGUES = [
  { slug: 'bol.1', name: 'Liga Boliviana (Copa Paceña)', country: 'Bolivia', flag: '🇧🇴', region: 'Bolivia' },
  { slug: 'conmebol.libertadores', name: 'Copa Libertadores', country: 'CONMEBOL', flag: '🏆', region: 'Sudamérica' },
  { slug: 'conmebol.sudamericana', name: 'Copa Sudamericana', country: 'CONMEBOL', flag: '🥈', region: 'Sudamérica' },
  { slug: 'fifa.worldq.conmebol', name: 'Eliminatorias Sudamericanas', country: 'FIFA', flag: '🌎', region: 'Sudamérica' },
  { slug: 'arg.1', name: 'Liga Profesional Argentina', country: 'Argentina', flag: '🇦🇷', region: 'Sudamérica' },
  { slug: 'bra.1', name: 'Brasileirão Serie A', country: 'Brasil', flag: '🇧🇷', region: 'Sudamérica' },
  { slug: 'col.1', name: 'Liga BetPlay Colombia', country: 'Colombia', flag: '🇨🇴', region: 'Sudamérica' },
  { slug: 'chi.1', name: 'Campeonato Chileno', country: 'Chile', flag: '🇨🇱', region: 'Sudamérica' },
  { slug: 'per.1', name: 'Liga 1 Perú', country: 'Perú', flag: '🇵🇪', region: 'Sudamérica' },
  { slug: 'uefa.champions', name: 'UEFA Champions League', country: 'Europa', flag: '⭐', region: 'Europa' },
  { slug: 'uefa.europa', name: 'UEFA Europa League', country: 'Europa', flag: '🌍', region: 'Europa' },
  { slug: 'esp.1', name: 'LaLiga EA Sports', country: 'España', flag: '🇪🇸', region: 'Europa' },
  { slug: 'eng.1', name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', region: 'Europa' },
  { slug: 'ita.1', name: 'Serie A Italiana', country: 'Italia', flag: '🇮🇹', region: 'Europa' },
  { slug: 'ger.1', name: 'Bundesliga', country: 'Alemania', flag: '🇩🇪', region: 'Europa' },
  { slug: 'fra.1', name: 'Ligue 1', country: 'Francia', flag: '🇫🇷', region: 'Europa' },
  { slug: 'mex.1', name: 'Liga MX', country: 'México', flag: '🇲🇽', region: 'Concacaf' },
  { slug: 'usa.1', name: 'MLS', country: 'EE.UU.', flag: '🇺🇸', region: 'Concacaf' },
  { slug: 'fifa.friendly', name: 'Amistosos Internacionales', country: 'FIFA', flag: '🌐', region: 'Selecciones' }
];

export const EspnMatchExplorerModal: React.FC<EspnMatchExplorerModalProps> = ({
  isOpen,
  onClose,
  currentTemplateData,
  onApplyMatchToBanner,
  onApplyLineupFromEspn
}) => {
  const { customClubs, addCustomClub } = useFirebase();

  // Selected filters
  const [selectedLeague, setSelectedLeague] = useState<string>('bol.1');
  const [dateInput, setDateInput] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchFilter, setSearchFilter] = useState('');

  // Data fetching state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreboardData, setScoreboardData] = useState<EspnScoreboardResponse | null>(null);

  // Success / Action feedback state
  const [appliedMatchId, setAppliedMatchId] = useState<string | null>(null);
  const [savedTeamId, setSavedTeamId] = useState<string | null>(null);
  const [lineupSummaryByMatch, setLineupSummaryByMatch] = useState<Record<string, EspnMatchSummary>>({});
  const [lineupLoadingMatchId, setLineupLoadingMatchId] = useState<string | null>(null);
  const [lineupErrorByMatch, setLineupErrorByMatch] = useState<Record<string, string>>({});

  // Missing Club Modal / Form state
  const [showCustomClubModal, setShowCustomClubModal] = useState(false);
  const [customClubName, setCustomClubName] = useState('');
  const [customClubShort, setCustomClubShort] = useState('');
  const [customClubCity, setCustomClubCity] = useState('');
  const [customClubCountry, setCustomClubCountry] = useState('Bolivia');
  const [customClubColor, setCustomClubColor] = useState('#0284c7');
  const [customClubBadgeUrl, setCustomClubBadgeUrl] = useState('');
  const [isSavingCustomClub, setIsSavingCustomClub] = useState(false);
  const [customClubSavedSuccess, setCustomClubSavedSuccess] = useState(false);

  // Format date for ESPN API (YYYYMMDD)
  const formattedEspnDate = useMemo(() => {
    if (!dateInput) return '';
    return dateInput.replace(/-/g, '');
  }, [dateInput]);

  // Quick date pickers
  const setRelativeDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDateInput(d.toISOString().split('T')[0]);
  };

  const fetchScoreboard = async (leagueSlug: string, dateStr: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/espn/scoreboard?league=${encodeURIComponent(leagueSlug)}${dateStr ? `&date=${dateStr}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error en API ESPN (${res.status})`);
      }
      const data: EspnScoreboardResponse = await res.json();
      setScoreboardData(data);
    } catch (err: any) {
      console.error('ESPN fetch error:', err);
      setError(err.message || 'No se pudo conectar a la API de ESPN.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScoreboard(selectedLeague, formattedEspnDate);
    }
  }, [isOpen, selectedLeague, formattedEspnDate]);

  if (!isOpen) return null;

  // Filter matches based on search box
  const filteredEvents = (scoreboardData?.events || []).filter((event) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      event.name?.toLowerCase().includes(q) ||
      event.homeTeam?.displayName?.toLowerCase().includes(q) ||
      event.homeTeam?.name?.toLowerCase().includes(q) ||
      event.awayTeam?.displayName?.toLowerCase().includes(q) ||
      event.awayTeam?.name?.toLowerCase().includes(q) ||
      event.venue?.name?.toLowerCase().includes(q) ||
      event.venue?.city?.toLowerCase().includes(q)
    );
  });

  const activeLeagueInfo = POPULAR_LEAGUES.find((l) => l.slug === selectedLeague) || {
    slug: selectedLeague,
    name: scoreboardData?.league?.name || 'Liga de Fútbol',
    country: 'Mundo',
    flag: '⚽',
    region: 'Internacional'
  };

  // Convert an ESPN team to a persisted or usable Club object
  const handleSaveTeamToFirestore = async (team: EspnTeam, venueCity?: string) => {
    const primaryColor = team.color ? `#${team.color}` : '#0284c7';
    const secondaryColor = team.alternateColor ? `#${team.alternateColor}` : '#ffffff';

    const newClub: Club = {
      id: `espn-${team.id}`,
      name: team.displayName || team.name,
      shortName: (team.abbreviation || team.name).slice(0, 14).toUpperCase(),
      category: 'international',
      primaryColor,
      secondaryColor,
      accentColor: '#facc15',
      city: venueCity || '',
      badgeUrl: team.logo,
      badgeSvg: `<svg viewBox="0 0 100 120" fill="none"><circle cx="50" cy="60" r="45" fill="${primaryColor}"/><text x="50" y="65" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">${(team.abbreviation || team.name).slice(0, 3).toUpperCase()}</text></svg>`,
      isCustom: true
    };

    try {
      await addCustomClub(newClub);
      setSavedTeamId(team.id);
      setTimeout(() => setSavedTeamId(null), 3000);
    } catch (e) {
      console.error('Error saving team to Firestore:', e);
    }
  };

  const handleToggleLineups = async (match: EspnMatchEvent) => {
    if (lineupSummaryByMatch[match.id]) {
      setLineupSummaryByMatch(current => {
        const next = { ...current };
        delete next[match.id];
        return next;
      });
      return;
    }

    setLineupLoadingMatchId(match.id);
    setLineupErrorByMatch(current => ({ ...current, [match.id]: '' }));
    try {
      const response = await fetch(`/api/espn/summary?league=${encodeURIComponent(selectedLeague)}&event=${encodeURIComponent(match.id)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `ESPN respondió ${response.status}`);
      setLineupSummaryByMatch(current => ({ ...current, [match.id]: payload as EspnMatchSummary }));
      if (!payload.available) {
        setLineupErrorByMatch(current => ({ ...current, [match.id]: 'ESPN todavía no publica las alineaciones de este partido o esta competición no las ofrece.' }));
      }
    } catch (error: any) {
      setLineupErrorByMatch(current => ({ ...current, [match.id]: error.message || 'No se pudieron cargar las alineaciones.' }));
    } finally {
      setLineupLoadingMatchId(null);
    }
  };

  const handleApplyMatch = (match: EspnMatchEvent, targetType: 'auto' | 'versus' | 'result' | 'goal' | 'fixture' = 'auto') => {
    onApplyMatchToBanner({
      match,
      leagueName: activeLeagueInfo.name,
      targetType
    });
    setAppliedMatchId(match.id);
    setTimeout(() => setAppliedMatchId(null), 2500);
  };

  // Custom Club File Upload handler
  const handleCustomClubImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomClubBadgeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save manual custom club to Firestore
  const handleSaveCustomClubForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClubName.trim()) return;

    setIsSavingCustomClub(true);
    try {
      const newClub: Club = {
        id: `custom-${Date.now()}`,
        name: customClubName.trim(),
        shortName: (customClubShort || customClubName).trim().toUpperCase(),
        category: 'bolivia',
        primaryColor: customClubColor,
        secondaryColor: '#ffffff',
        accentColor: '#000000',
        city: customClubCity.trim(),
        badgeUrl: customClubBadgeUrl.trim() || undefined,
        badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="${customClubColor}" stroke="#ffffff" stroke-width="4"/>
          <text x="50" y="65" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="14">${(customClubShort || customClubName).slice(0, 3).toUpperCase()}</text>
        </svg>`,
        isCustom: true
      };

      await addCustomClub(newClub);
      setCustomClubSavedSuccess(true);
      setTimeout(() => {
        setCustomClubSavedSuccess(false);
        setShowCustomClubModal(false);
        // Reset form
        setCustomClubName('');
        setCustomClubShort('');
        setCustomClubCity('');
        setCustomClubBadgeUrl('');
      }, 1500);
    } catch (err) {
      console.error('Error saving custom club:', err);
    } finally {
      setIsSavingCustomClub(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white font-montserrat">
                  Explorador de Partidos ESPN & Escudos Oficiales
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] tracking-wider uppercase border border-red-500/30">
                  API ESPN LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Horarios oficiales convertidos a hora de Bolivia (BOT), escudos oficiales de alta resolución y carga en 1 clic.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomClubModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Guardar equipo que no esté en ESPN en tu base de datos Firebase"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Club en Firestore</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            {/* League Selector */}
            <div className="md:col-span-5">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                🏆 Liga o Torneo del Mundo
              </label>
              <div className="relative">
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer appearance-none font-medium"
                >
                  <optgroup label="🇧🇴 Bolivia">
                    {POPULAR_LEAGUES.filter((l) => l.region === 'Bolivia').map((league) => (
                      <option key={league.slug} value={league.slug}>
                        {league.flag} {league.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏆 Sudamérica & CONMEBOL">
                    {POPULAR_LEAGUES.filter((l) => l.region === 'Sudamérica').map((league) => (
                      <option key={league.slug} value={league.slug}>
                        {league.flag} {league.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="⭐ Europa & UEFA">
                    {POPULAR_LEAGUES.filter((l) => l.region === 'Europa').map((league) => (
                      <option key={league.slug} value={league.slug}>
                        {league.flag} {league.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌎 Concacaf & Norteamérica">
                    {POPULAR_LEAGUES.filter((l) => l.region === 'Concacaf').map((league) => (
                      <option key={league.slug} value={league.slug}>
                        {league.flag} {league.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌐 Selecciones">
                    {POPULAR_LEAGUES.filter((l) => l.region === 'Selecciones').map((league) => (
                      <option key={league.slug} value={league.slug}>
                        {league.flag} {league.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Date Selector + Quick Pills */}
            <div className="md:col-span-4">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                📅 Fecha de los Partidos
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setRelativeDate(-1)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold cursor-pointer"
                >
                  Ayer
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className="px-2 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-[11px] text-white font-bold cursor-pointer"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(1)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold cursor-pointer"
                >
                  Mañana
                </button>
              </div>
            </div>

            {/* Search within Matches */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                🔍 Buscar por Club
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Bolívar, Real Madrid..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Quick info strip */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white flex items-center gap-1">
                <span>{activeLeagueInfo.flag}</span>
                <span>{activeLeagueInfo.name}</span>
              </span>
              <span>•</span>
              <span>{filteredEvents.length} partidos encontrados</span>
              {filteredEvents.some((e) => e.status.state === 'in') && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] flex items-center gap-1 border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  EN JUEGO
                </span>
              )}
            </div>

            <button
              onClick={() => fetchScoreboard(selectedLeague, formattedEspnDate)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-400' : ''}`} />
              <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </div>

        {/* Matches Body Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {loading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-3" />
              <p className="text-sm font-semibold text-white">Consultando partidos en ESPN...</p>
              <p className="text-xs text-slate-400 mt-1">
                Obteniendo escudos oficiales y horarios en tiempo real
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-red-400">No se pudieron cargar los datos de ESPN</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
              <button
                onClick={() => fetchScoreboard(selectedLeague, formattedEspnDate)}
                className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-base font-bold text-white">No hay partidos programados para esta fecha</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No se encontraron eventos en ESPN para {activeLeagueInfo.name} en el día seleccionado. Intenta cambiar de fecha o seleccionar otra liga.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setRelativeDate(0)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Ver Partidos de Hoy
                </button>
                <button
                  onClick={() => setSelectedLeague('esp.1')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Ver LaLiga España
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            filteredEvents.map((event) => {
              const isLive = event.status.state === 'in';
              const isPost = event.status.state === 'post';
              const isPre = event.status.state === 'pre';
              const isApplied = appliedMatchId === event.id;

              return (
                <div
                  key={event.id}
                  className={`border rounded-2xl p-4 transition-all ${
                    isApplied
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                      : isLive
                      ? 'border-red-500/40 bg-gradient-to-r from-red-950/20 via-slate-900/90 to-red-950/20'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {/* Match Top Tag & Venue */}
                  <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">
                        {scoreboardData?.league?.name || activeLeagueInfo.name}
                      </span>
                      {event.venue?.name && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-400 text-[11px] truncate max-w-[220px]">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>
                              {event.venue.name}
                              {event.venue.city ? `, ${event.venue.city}` : ''}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5">
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] tracking-wider uppercase animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          <span>{event.status.shortDetail || 'EN VIVO'}</span>
                        </span>
                      )}
                      {isPost && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] uppercase border border-slate-700">
                          {event.status.shortDetail || 'FINALIZADO'}
                        </span>
                      )}
                      {isPre && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.timeBolivia ? `${event.timeBolivia} (BOT)` : event.status.shortDetail}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teams and Scores Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Home Team */}
                    <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-3 order-1">
                      <div className="text-left md:text-right">
                        <span className="font-bold text-sm text-white block font-montserrat">
                          {event.homeTeam.displayName || event.homeTeam.name}
                        </span>
                        <div className="flex items-center md:justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {event.homeTeam.abbreviation || 'LOCAL'}
                          </span>
                          <button
                            onClick={() => handleSaveTeamToFirestore(event.homeTeam, event.venue?.city)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title="Guardar escudo y club en Firebase Firestore"
                          >
                            <Cloud className="w-3 h-3" />
                            <span>
                              {savedTeamId === event.homeTeam.id ? '✓ Guardado' : 'Guardar Escudo'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-slate-800/80 p-1 flex items-center justify-center shrink-0 border border-slate-700/60 shadow-inner">
                        {event.homeTeam.logo ? (
                          <img
                            src={event.homeTeam.logo}
                            alt={event.homeTeam.name}
                            className="max-h-full max-w-full object-contain drop-shadow"
                            crossOrigin="anonymous"
                            loading="lazy"
                          />
                        ) : (
                          <Shield className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Middle: Scores or VS */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center order-2 py-1">
                      {isPre ? (
                        <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-black text-xs text-amber-400 tracking-wider">
                          VS
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-2xl font-black font-montserrat ${
                              isLive ? 'text-red-400' : 'text-white'
                            }`}
                          >
                            {event.homeTeam.score ?? 0}
                          </span>
                          <span className="text-slate-600 font-bold">-</span>
                          <span
                            className={`text-2xl font-black font-montserrat ${
                              isLive ? 'text-red-400' : 'text-white'
                            }`}
                          >
                            {event.awayTeam.score ?? 0}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="md:col-span-5 flex items-center justify-between md:justify-start gap-3 order-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/80 p-1 flex items-center justify-center shrink-0 border border-slate-700/60 shadow-inner">
                        {event.awayTeam.logo ? (
                          <img
                            src={event.awayTeam.logo}
                            alt={event.awayTeam.name}
                            className="max-h-full max-w-full object-contain drop-shadow"
                            crossOrigin="anonymous"
                            loading="lazy"
                          />
                        ) : (
                          <Shield className="w-6 h-6 text-slate-500" />
                        )}
                      </div>

                      <div className="text-right md:text-left">
                        <span className="font-bold text-sm text-white block font-montserrat">
                          {event.awayTeam.displayName || event.awayTeam.name}
                        </span>
                        <div className="flex items-center md:justify-start gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {event.awayTeam.abbreviation || 'VISITA'}
                          </span>
                          <button
                            onClick={() => handleSaveTeamToFirestore(event.awayTeam, event.venue?.city)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title="Guardar escudo y club en Firebase Firestore"
                          >
                            <Cloud className="w-3 h-3" />
                            <span>
                              {savedTeamId === event.awayTeam.id ? '✓ Guardado' : 'Guardar Escudo'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{event.dateBolivia || event.date}</span>
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Main 1-Click Apply */}
                      <button
                        onClick={() => handleApplyMatch(event, 'auto')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                        }`}
                      >
                        {isApplied ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                        <span>{isApplied ? '¡Cargado en Banner!' : 'Cargar en Banner Activo'}</span>
                      </button>

                      {/* Dropdown / Quick targets */}
                      <button
                        onClick={() => handleApplyMatch(event, 'versus')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                        title="Cargar como diseño Previa / Versus"
                      >
                        ⚔️ Versus
                      </button>

                      {isPost || isLive ? (
                        <button
                          onClick={() => handleApplyMatch(event, 'result')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                          title="Cargar como Marcador / Resultado Final"
                        >
                          🏆 Resultado
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleApplyMatch(event, 'fixture')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                        title="Añadir a la lista de Fixture"
                      >
                        📅 + Fixture
                      </button>
                    </div>
                  </div>

                  {/* Official ESPN lineups, when the competition exposes them */}
                  <div className="mt-2">
                    <button
                      onClick={() => handleToggleLineups(event)}
                      disabled={lineupLoadingMatchId === event.id}
                      className="w-full sm:w-auto px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {lineupLoadingMatchId === event.id
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <Users className="w-3.5 h-3.5" />}
                      {lineupLoadingMatchId === event.id ? 'Consultando ESPN…' : lineupSummaryByMatch[event.id] ? 'Ocultar alineaciones' : 'Ver alineaciones oficiales'}
                    </button>

                    {lineupErrorByMatch[event.id] && (
                      <p className="mt-2 text-xs text-amber-300">{lineupErrorByMatch[event.id]}</p>
                    )}

                    {lineupSummaryByMatch[event.id]?.available && (
                      <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {lineupSummaryByMatch[event.id].teams.map((team) => (
                          <div key={team.teamId} className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate">{team.teamName}</p>
                                <p className="text-[10px] text-slate-400">
                                  {team.formation || 'Formación no indicada'} · {team.starters.length} titulares · {team.substitutes.length} suplentes
                                </p>
                              </div>
                              <button
                                onClick={() => onApplyLineupFromEspn({ match: event, leagueName: activeLeagueInfo.name, team })}
                                disabled={team.starters.length === 0}
                                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black disabled:opacity-40"
                              >
                                Usar XI
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                              {team.starters.map((player) => (
                                <div key={player.id} className="flex items-center gap-1.5 text-[10px] text-slate-300 min-w-0">
                                  <span className="w-5 text-right text-cyan-300 font-bold">{player.number || '—'}</span>
                                  <span className="truncate">{player.name}</span>
                                </div>
                              ))}
                            </div>
                            {team.starters.length === 0 && (
                              <p className="text-[10px] text-slate-500">Titulares aún no disponibles en ESPN.</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Custom Club Fallback Drawer / Modal */}
        {showCustomClubModal && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 p-4 sm:p-6 flex flex-col justify-center max-w-xl mx-auto rounded-3xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-montserrat">
                    Guardar Club Personalizado en Firebase Firestore
                  </h4>
                  <p className="text-xs text-slate-400">
                    Si tu equipo no está en ESPN, guárdalo aquí con su escudo real para reutilizarlo siempre.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomClubModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomClubForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nombre del Club *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Real Potosí, Club Deportivo..."
                    value={customClubName}
                    onChange={(e) => setCustomClubName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Sigla / Nombre Corto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. REAL POTOSÍ"
                    value={customClubShort}
                    onChange={(e) => setCustomClubShort(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Ciudad / Sede
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Potosí, La Paz, Cochabamba..."
                    value={customClubCity}
                    onChange={(e) => setCustomClubCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Color Principal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customClubColor}
                      onChange={(e) => setCustomClubColor(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">{customClubColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Escudo del Club (PNG Transparente / SVG / JPG)
                </label>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>{customClubBadgeUrl ? '✓ Archivo Cargado' : 'Subir Archivo de Imagen'}</span>
                    <input type="file" accept="image/*" onChange={handleCustomClubImageUpload} className="hidden" />
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="O pega una URL directa de la imagen del escudo..."
                    value={customClubBadgeUrl.startsWith('data:') ? '' : customClubBadgeUrl}
                    onChange={(e) => setCustomClubBadgeUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {customClubBadgeUrl && (
                <div className="p-2 bg-slate-900/80 rounded-xl flex items-center gap-3 border border-slate-800">
                  <div className="w-12 h-12 bg-slate-950 rounded-lg p-1 flex items-center justify-center">
                    <img
                      src={customClubBadgeUrl}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Vista previa del escudo lista para guardar
                  </span>
                </div>
              )}

              {customClubSavedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>¡Club guardado exitosamente en tu base de datos Firebase Firestore!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomClubModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustomClub}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{isSavingCustomClub ? 'Guardando...' : 'Guardar en Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {customClubs.length} clubes personalizados guardados en tu base de datos en la nube
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
