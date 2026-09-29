import React, { useState, useEffect } from 'react';
import { Club, CLUBS, getClubById } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { Search, X, Upload, Shield, Check, Plus, Globe2, Loader2, History, Star, Info } from 'lucide-react';

interface ClubPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClub: (club: Club) => void;
  currentClubId?: string;
  title?: string;
  onOpenClubInfo?: (club: Club) => void;
}

export const ClubPickerModal: React.FC<ClubPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectClub,
  currentClubId,
  title = 'Seleccionar Escudo del Equipo',
  onOpenClubInfo
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'web-search'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'all' | 'bolivia' | 'conmebol' | 'international'>('all');
  const [customClubs, setCustomClubs] = useState<Club[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamShort, setNewTeamShort] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#22c55e');
  const [newTeamBadgeUrl, setNewTeamBadgeUrl] = useState('');

  // History & Favorites
  const [recentClubIds, setRecentClubIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('futbol_recent_clubs');
      return saved ? JSON.parse(saved) : ['bolivar', 'the-strongest', 'wilstermann', 'blooming', 'always-ready'];
    } catch {
      return ['bolivar', 'the-strongest', 'wilstermann', 'blooming', 'always-ready'];
    }
  });

  const [favoriteClubIds, setFavoriteClubIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('futbol_favorite_clubs');
      return saved ? JSON.parse(saved) : ['bolivar', 'the-strongest'];
    } catch {
      return ['bolivar', 'the-strongest'];
    }
  });

  // Web search state
  const [webQuery, setWebQuery] = useState('');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState<Array<{ id: string; title: string; url: string; mime?: string }>>([]);

  useEffect(() => {
    try {
      localStorage.setItem('futbol_recent_clubs', JSON.stringify(recentClubIds));
    } catch {}
  }, [recentClubIds]);

  useEffect(() => {
    try {
      localStorage.setItem('futbol_favorite_clubs', JSON.stringify(favoriteClubIds));
    } catch {}
  }, [favoriteClubIds]);

  if (!isOpen) return null;

  const allAvailableClubs = [...customClubs, ...CLUBS];

  const filteredClubs = allAvailableClubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.city && club.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = category === 'all' || club.category === category;
    return matchesSearch && matchesCategory;
  });

  const handlePickClub = (club: Club) => {
    // Add to recent history
    setRecentClubIds(prev => [club.id, ...prev.filter(id => id !== club.id)].slice(0, 10));
    onSelectClub(club);
    onClose();
  };

  const handleToggleFavorite = (e: React.MouseEvent, clubId: string) => {
    e.stopPropagation();
    setFavoriteClubIds(prev =>
      prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewTeamBadgeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCustomClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newClub: Club = {
      id: `custom-${Date.now()}`,
      name: newTeamName.trim(),
      shortName: (newTeamShort || newTeamName).trim().toUpperCase(),
      category: 'bolivia',
      primaryColor: newTeamColor,
      secondaryColor: '#ffffff',
      accentColor: '#000000',
      badgeUrl: newTeamBadgeUrl || undefined,
      badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="${newTeamColor}" stroke="#ffffff" stroke-width="4"/>
        <text x="50" y="65" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="14">${(newTeamShort || newTeamName).slice(0, 3).toUpperCase()}</text>
      </svg>`
    };

    setCustomClubs(prev => [newClub, ...prev]);
    handlePickClub(newClub);
    setShowUploadForm(false);
  };

  // Perform internet escudo search
  const handleSearchWeb = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!webQuery.trim()) return;

    setIsSearchingWeb(true);
    try {
      const res = await fetch(`/api/search-escudos?q=${encodeURIComponent(webQuery.trim())}`);
      const data = await res.json();
      setWebResults(data.results || []);
    } catch (err) {
      console.error('Web search error:', err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // Select an escudo found on the web
  const handleSelectWebEscudo = (result: { title: string; url: string }) => {
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(result.url)}`;

    const newClub: Club = {
      id: `web-${Date.now()}`,
      name: result.title,
      shortName: result.title.slice(0, 12).toUpperCase(),
      category: 'international',
      primaryColor: '#0284c7',
      secondaryColor: '#ffffff',
      accentColor: '#facc15',
      badgeUrl: proxiedUrl,
      badgeSvg: `<svg viewBox="0 0 100 120" fill="none"><circle cx="50" cy="60" r="45" fill="#0284c7"/></svg>`
    };

    setCustomClubs(prev => [newClub, ...prev]);
    handlePickClub(newClub);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-montserrat">{title}</h3>
              <p className="text-xs text-slate-400">Historial de equipos, escudos oficiales y búsqueda en internet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Escudos Oficiales vs Buscar en Internet */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Escudos Oficiales ({allAvailableClubs.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('web-search');
              if (webResults.length === 0 && !webQuery) {
                setWebQuery(searchTerm || 'Bolivar');
              }
            }}
            className={`flex-1 py-2.5 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'web-search'
                ? 'border-cyan-500 text-cyan-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>🌐 Buscar en Internet (Cualquier Club)</span>
          </button>
        </div>

        {/* RECENTLY USED & FAVORITES QUICK STRIP */}
        {recentClubIds.length > 0 && activeTab === 'catalog' && (
          <div className="p-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 mr-1">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Historial:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {recentClubIds.map(clubId => {
                const club = getClubById(clubId);
                return (
                  <button
                    key={`recent-${clubId}`}
                    onClick={() => handlePickClub(club)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white shrink-0 cursor-pointer transition-colors"
                    title={`Seleccionar ${club.name}`}
                  >
                    <ClubBadge club={club} size="xs" />
                    <span className="font-bold text-[11px] truncate max-w-[80px]">{club.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <>
            {/* Search and Categories */}
            <div className="p-3 border-b border-slate-800/80 space-y-2 bg-slate-900/90">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar club por nombre o ciudad (Bolívar, Strongest, Real Potosí...)"
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Subir Archivo</span>
                </button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    category === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setCategory('bolivia')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    category === 'bolivia'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🇧🇴 Liga Boliviana / Copa Paceña
                </button>
                <button
                  onClick={() => setCategory('conmebol')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    category === 'conmebol'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🏆 Libertadores / CONMEBOL
                </button>
                <button
                  onClick={() => setCategory('international')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    category === 'international'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🌍 Internacional
                </button>
              </div>
            </div>

            {/* Custom Club Upload Form */}
            {showUploadForm && (
              <form onSubmit={handleCreateCustomClub} className="p-4 bg-slate-950 border-b border-emerald-500/30 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Subir Escudo Personalizado</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Nombre del Club</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Real Potosí, Mi Club FC"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Sigla / Corto</label>
                    <input
                      type="text"
                      placeholder="Ej. POTOSÍ"
                      value={newTeamShort}
                      onChange={(e) => setNewTeamShort(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-300 block mb-1">Archivo de Escudo (PNG Transparente / SVG)</label>
                    <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-slate-900 border border-dashed border-slate-700 rounded-lg text-slate-300 cursor-pointer hover:border-emerald-500">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>{newTeamBadgeUrl ? '✓ Imagen Cargada' : 'Elegir archivo PNG / JPG de tu equipo'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Guardar y Seleccionar
                  </button>
                </div>
              </form>
            )}

            {/* Club Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredClubs.map(club => {
                const isSelected = club.id === currentClubId;
                const isFav = favoriteClubIds.includes(club.id);

                return (
                  <button
                    key={club.id}
                    onClick={() => handlePickClub(club)}
                    className={`group relative p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Top action icons */}
                    <div className="w-full flex items-center justify-between text-slate-400">
                      <div
                        onClick={(e) => handleToggleFavorite(e, club.id)}
                        className={`p-1 rounded hover:text-yellow-400 transition-colors ${
                          isFav ? 'text-yellow-400' : 'text-slate-600'
                        }`}
                        title="Favorito"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-yellow-400' : ''}`} />
                      </div>

                      {onOpenClubInfo && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenClubInfo(club);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-800"
                          title="Ver ficha y jugadores del club"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="h-16 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                      <ClubBadge club={club} size="md" glow={isSelected} />
                    </div>

                    <div className="mt-2 w-full">
                      <span className="block text-xs font-bold text-white group-hover:text-emerald-400 truncate font-montserrat">
                        {club.name}
                      </span>
                      {club.city && (
                        <span className="text-[10px] text-slate-400 block truncate">
                          {club.city}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: WEB SEARCH */}
        {activeTab === 'web-search' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <form onSubmit={handleSearchWeb} className="p-3 bg-slate-900 border-b border-slate-800 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  value={webQuery}
                  onChange={(e) => setWebQuery(e.target.value)}
                  placeholder="Escribe el nombre de cualquier club (ej. San José de Oruro, Flamengo, River...)"
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingWeb}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isSearchingWeb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe2 className="w-3.5 h-3.5" />}
                <span>{isSearchingWeb ? 'Buscando...' : 'Buscar Escudo'}</span>
              </button>
            </form>

            <div className="flex-1 overflow-y-auto p-4">
              {isSearchingWeb ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                  <p className="text-xs">Buscando escudos oficiales en alta resolución...</p>
                </div>
              ) : webResults.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Globe2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-white">Busca cualquier club del mundo</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Conéctate a la base de datos de Wikimedia Commons para obtener escudos transparentes reales.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {webResults.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      onClick={() => handleSelectWebEscudo(item)}
                      className="group p-3 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-cyan-500 hover:bg-slate-800/40 flex flex-col items-center text-center transition-all cursor-pointer"
                    >
                      <div className="h-16 w-16 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain drop-shadow"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-400 truncate w-full mt-2 font-montserrat">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        ✓ Seleccionar Escudo
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Haz clic en cualquier escudo para colocarlo tal cual en tu banner</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
