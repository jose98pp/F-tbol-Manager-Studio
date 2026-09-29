import React, { useState } from 'react';
import { TemplateData, GoalScorer } from '../data/templates';
import { ChannelBranding } from '../data/branding';
import { getClubById } from '../data/clubs';
import { Sparkles, RefreshCw, Plus, Trash2, Sliders, Trophy, Flame, Copy, Check } from 'lucide-react';

interface LiveSimulationPanelProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  branding: ChannelBranding;
}

export const LiveSimulationPanel: React.FC<LiveSimulationPanelProps> = ({
  data,
  onUpdateData,
  branding
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGeneratingHype, setIsGeneratingHype] = useState(false);
  const [socialCopyResult, setSocialCopyResult] = useState<{
    headline?: string;
    subheadline?: string;
    tiktokCaption?: string;
    facebookText?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [newScorerPlayer, setNewScorerPlayer] = useState('');
  const [newScorerMinute, setNewScorerMinute] = useState("35'");
  const [newScorerTeam, setNewScorerTeam] = useState<'home' | 'away'>('home');

  const homeClub = getClubById(data.singleMatch.homeClubId);
  const awayClub = getClubById(data.singleMatch.awayClubId);

  // Trigger AI match result simulation
  const handleSimulateMatch = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/ai/simulate-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeClubName: homeClub.name,
          awayClubName: awayClub.name,
          tournament: data.tournament
        })
      });

      const result = await res.json();
      if (result) {
        onUpdateData({
          ...data,
          singleMatch: {
            ...data.singleMatch,
            homeScore: result.homeScore ?? data.singleMatch.homeScore,
            awayScore: result.awayScore ?? data.singleMatch.awayScore,
            scorers: result.scorers?.map((s: any, idx: number) => ({
              id: `sc-${Date.now()}-${idx}`,
              team: s.team === 'away' ? 'away' : 'home',
              player: s.player || 'Goleador',
              minute: s.minute || "45'"
            })) || data.singleMatch.scorers,
            stats: {
              ...data.singleMatch.stats,
              ...(result.stats || {})
            }
          }
        });
      }
    } catch (err) {
      console.error('Error during simulation:', err);
      // Client-side quick randomizer fallback
      const randomHome = Math.floor(Math.random() * 4);
      const randomAway = Math.floor(Math.random() * 3);
      onUpdateData({
        ...data,
        singleMatch: {
          ...data.singleMatch,
          homeScore: randomHome,
          awayScore: randomAway,
          stats: {
            ...data.singleMatch.stats,
            possessionHome: 53,
            possessionAway: 47,
            shotsHome: 12,
            shotsAway: 9
          }
        }
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Generate Social Hype Copy
  const handleGenerateSocialHype = async () => {
    setIsGeneratingHype(true);
    try {
      const res = await fetch('/api/ai/social-hype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament: data.tournament,
          matchOrFixture: `${homeClub.name} vs ${awayClub.name}`,
          channelName: branding.channelName
        })
      });
      const json = await res.json();
      setSocialCopyResult(json);
      if (json.headline) {
        onUpdateData({
          ...data,
          highlightHeadline: json.headline,
          highlightSub: json.subheadline || data.highlightSub
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingHype(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScoreChange = (side: 'home' | 'away', delta: number) => {
    if (side === 'home') {
      const newScore = Math.max(0, data.singleMatch.homeScore + delta);
      onUpdateData({
        ...data,
        singleMatch: { ...data.singleMatch, homeScore: newScore }
      });
    } else {
      const newScore = Math.max(0, data.singleMatch.awayScore + delta);
      onUpdateData({
        ...data,
        singleMatch: { ...data.singleMatch, awayScore: newScore }
      });
    }
  };

  const handleAddScorer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScorerPlayer.trim()) return;

    const newScorer: GoalScorer = {
      id: `scorer-${Date.now()}`,
      team: newScorerTeam,
      player: newScorerPlayer.trim(),
      minute: newScorerMinute.trim()
    };

    onUpdateData({
      ...data,
      singleMatch: {
        ...data.singleMatch,
        scorers: [...data.singleMatch.scorers, newScorer]
      }
    });

    setNewScorerPlayer('');
  };

  const handleRemoveScorer = (id: string) => {
    onUpdateData({
      ...data,
      singleMatch: {
        ...data.singleMatch,
        scorers: data.singleMatch.scorers.filter(s => s.id !== id)
      }
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* AI Automation Action Box */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/40 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-montserrat">Resultados & Estadísticas Automáticas</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            Gemini 3.8
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3">
          Simula al instante un resultado realista, goleadores y estadísticas para {homeClub.shortName} vs {awayClub.shortName}.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSimulateMatch}
            disabled={isSimulating}
            className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulando...' : '⚡ Simular Resultado & Stats'}</span>
          </button>

          <button
            onClick={handleGenerateSocialHype}
            disabled={isGeneratingHype}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{isGeneratingHype ? 'Generando...' : 'Textos TikTok/FB'}</span>
          </button>
        </div>
      </div>

      {/* Social Media Hype Box if generated */}
      {socialCopyResult && (
        <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
            <span>Copy para Redes Sociales</span>
            <button
              onClick={() => setSocialCopyResult(null)}
              className="text-slate-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          {socialCopyResult.tiktokCaption && (
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">TikTok / Reels Caption:</span>
                <p className="text-[11px] text-white select-all">{socialCopyResult.tiktokCaption}</p>
              </div>
              <button
                onClick={() => copyToClipboard(socialCopyResult.tiktokCaption || '', 'tiktok')}
                className="p-1.5 bg-slate-800 rounded text-slate-300 hover:text-emerald-400"
              >
                {copiedKey === 'tiktok' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {socialCopyResult.facebookText && (
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Facebook Post:</span>
                <p className="text-[11px] text-white select-all">{socialCopyResult.facebookText}</p>
              </div>
              <button
                onClick={() => copyToClipboard(socialCopyResult.facebookText || '', 'fb')}
                className="p-1.5 bg-slate-800 rounded text-slate-300 hover:text-emerald-400"
              >
                {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual Quick Score Stepper */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
        <span className="font-bold text-white block">Marcador del Partido</span>
        <div className="grid grid-cols-2 gap-3">
          {/* Home team score */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white truncate max-w-[80px]">{homeClub.shortName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('home', -1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-anton text-lg text-emerald-400 w-4 text-center">
                {data.singleMatch.homeScore}
              </span>
              <button
                onClick={() => handleScoreChange('home', 1)}
                className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Away team score */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white truncate max-w-[80px]">{awayClub.shortName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('away', -1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="font-anton text-lg text-cyan-400 w-4 text-center">
                {data.singleMatch.awayScore}
              </span>
              <button
                onClick={() => handleScoreChange('away', 1)}
                className="w-6 h-6 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-slate-400 block mb-1">Estado / Horario</label>
            <input
              type="text"
              value={data.singleMatch.matchTime}
              onChange={(e) => onUpdateData({
                ...data,
                singleMatch: { ...data.singleMatch, matchTime: e.target.value }
              })}
              placeholder="HOY 20:00 o FINAL"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Etiqueta</label>
            <input
              type="text"
              value={data.singleMatch.statusBadge}
              onChange={(e) => onUpdateData({
                ...data,
                singleMatch: { ...data.singleMatch, statusBadge: e.target.value }
              })}
              placeholder="FINALIZADO, CLÁSICO..."
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium"
            />
          </div>
        </div>
      </div>

      {/* Scorers Manager */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <span className="font-bold text-white block">Autores de Goles</span>

        <form onSubmit={handleAddScorer} className="flex gap-1.5">
          <select
            value={newScorerTeam}
            onChange={(e) => setNewScorerTeam(e.target.value as 'home' | 'away')}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 text-slate-300 text-xs"
          >
            <option value="home">{homeClub.shortName}</option>
            <option value="away">{awayClub.shortName}</option>
          </select>
          <input
            type="text"
            placeholder="Nombre jugador (Ramiro Vaca...)"
            value={newScorerPlayer}
            onChange={(e) => setNewScorerPlayer(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
          />
          <input
            type="text"
            placeholder="Minuto (42')"
            value={newScorerMinute}
            onChange={(e) => setNewScorerMinute(e.target.value)}
            className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-1.5 text-center text-white text-xs"
          />
          <button
            type="submit"
            className="px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
          {data.singleMatch.scorers.map(s => (
            <div
              key={s.id}
              className="flex items-center justify-between p-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-1.5">
                <span className={s.team === 'home' ? 'text-emerald-400' : 'text-cyan-400'}>⚽</span>
                <span className="font-bold">{s.minute}</span>
                <span className="text-white truncate">{s.player}</span>
                <span className="text-[10px] text-slate-500 uppercase">
                  ({s.team === 'home' ? homeClub.shortName : awayClub.shortName})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveScorer(s.id)}
                className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time stats sliders */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estadísticas en Tiempo Real</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {data.singleMatch.stats.possessionHome}% / {data.singleMatch.stats.possessionAway}%
          </span>
        </div>

        {/* Possession Slider */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Posesión {homeClub.shortName}</span>
            <span>{awayClub.shortName}</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            value={data.singleMatch.stats.possessionHome}
            onChange={(e) => {
              const val = Number(e.target.value);
              onUpdateData({
                ...data,
                singleMatch: {
                  ...data.singleMatch,
                  stats: {
                    ...data.singleMatch.stats,
                    possessionHome: val,
                    possessionAway: 100 - val
                  }
                }
              });
            }}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Shots and Cards Inputs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 block">Tiros al Arco (L / V)</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={data.singleMatch.stats.shotsOnTargetHome}
                onChange={(e) => onUpdateData({
                  ...data,
                  singleMatch: {
                    ...data.singleMatch,
                    stats: { ...data.singleMatch.stats, shotsOnTargetHome: Number(e.target.value) }
                  }
                })}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
              />
              <input
                type="number"
                value={data.singleMatch.stats.shotsOnTargetAway}
                onChange={(e) => onUpdateData({
                  ...data,
                  singleMatch: {
                    ...data.singleMatch,
                    stats: { ...data.singleMatch.stats, shotsOnTargetAway: Number(e.target.value) }
                  }
                })}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block">Faltas (L / V)</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={data.singleMatch.stats.foulsHome}
                onChange={(e) => onUpdateData({
                  ...data,
                  singleMatch: {
                    ...data.singleMatch,
                    stats: { ...data.singleMatch.stats, foulsHome: Number(e.target.value) }
                  }
                })}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
              />
              <input
                type="number"
                value={data.singleMatch.stats.foulsAway}
                onChange={(e) => onUpdateData({
                  ...data,
                  singleMatch: {
                    ...data.singleMatch,
                    stats: { ...data.singleMatch.stats, foulsAway: Number(e.target.value) }
                  }
                })}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
