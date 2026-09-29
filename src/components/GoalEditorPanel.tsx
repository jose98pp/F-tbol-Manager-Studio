import React from 'react';
import confetti from 'canvas-confetti';
import { TemplateData } from '../data/templates';
import { Club, getClubById } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { Flame, Clock, Award, Trophy, Sparkles } from 'lucide-react';

interface GoalEditorPanelProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  onOpenClubPickerForScorer?: () => void;
}

export const GoalEditorPanel: React.FC<GoalEditorPanelProps> = ({
  data,
  onUpdateData,
  onOpenClubPickerForScorer
}) => {
  const { scoringClubId, opponentClubId, playerName, playerNumber, minute, goalType, homeScore, awayScore, assistBy } = data.goal;
  const scoringClub = getClubById(scoringClubId);
  const opponentClub = getClubById(opponentClubId);

  const handleUpdate = (field: string, value: any) => {
    onUpdateData({
      ...data,
      goal: { ...data.goal, [field]: value }
    });
  };

  const handleScoreDelta = (side: 'home' | 'away', delta: number) => {
    if (side === 'home') {
      const newScore = Math.max(0, homeScore + delta);
      onUpdateData({
        ...data,
        goal: { ...data.goal, homeScore: newScore }
      });
    } else {
      const newScore = Math.max(0, awayScore + delta);
      onUpdateData({
        ...data,
        goal: { ...data.goal, awayScore: newScore }
      });
    }
  };

  const handleCelebrateGoal = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#facc15', '#ef4444', '#22c55e']
    });
  };

  // Players from scoring club squad
  const squad = scoringClub.squad || [];

  return (
    <div className="space-y-4 text-xs">
      {/* Scoring Club Header */}
      <div className="p-3 bg-gradient-to-r from-yellow-500/10 via-slate-900 to-slate-900 rounded-2xl border border-yellow-500/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ClubBadge club={scoringClub} size="md" glow />
          <div>
            <span className="text-[10px] text-yellow-400 font-bold block uppercase">Equipo que Anota</span>
            <span className="text-sm font-black text-white font-montserrat">{scoringClub.name}</span>
          </div>
        </div>
        <button
          onClick={onOpenClubPickerForScorer}
          className="px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg font-bold transition-colors cursor-pointer"
        >
          Cambiar Club
        </button>
      </div>

      {/* Goal details: Player, Number, Minute */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-yellow-400" />
          <span>Datos de la Anotación</span>
        </span>

        {/* Quick select from roster if squad exists */}
        {squad.length > 0 && (
          <div>
            <label className="text-slate-400 block mb-1">Elegir Jugador de la Plantilla:</label>
            <select
              value={playerName}
              onChange={(e) => {
                const selectedP = squad.find(p => p.name === e.target.value);
                if (selectedP) {
                  onUpdateData({
                    ...data,
                    goal: {
                      ...data.goal,
                      playerName: selectedP.name.toUpperCase(),
                      playerNumber: selectedP.number
                    }
                  });
                }
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
            >
              <option value="">-- Seleccionar jugador --</option>
              {squad.map(p => (
                <option key={p.id} value={p.name}>
                  #{p.number} - {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Manual inputs for player & minute */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-slate-400 block mb-1">Nombre del Goleador</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => handleUpdate('playerName', e.target.value.toUpperCase())}
              placeholder="RAMIRO VACA"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-black"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Dorsal (#)</label>
            <input
              type="number"
              value={playerNumber}
              onChange={(e) => handleUpdate('playerNumber', Number(e.target.value))}
              placeholder="10"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-center text-yellow-400"
            />
          </div>
        </div>

        {/* Minute of Play & Quick buttons */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-slate-400 font-bold">Minuto de Juego</label>
            <div className="flex gap-1 text-[10px]">
              {["15'", "24'", "45+2'", "67'", "89'"].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleUpdate('minute', m)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-400 hover:bg-slate-700"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={minute}
              onChange={(e) => handleUpdate('minute', e.target.value)}
              placeholder="24' o 78'"
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
            />
          </div>
        </div>

        {/* Goal Type & Assist */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Tipo de Gol</label>
            <select
              value={goalType}
              onChange={(e) => handleUpdate('goalType', e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs"
            >
              <option value="¡GOLAZO!">¡GOLAZO!</option>
              <option value="GOL DE PENAL">GOL DE PENAL</option>
              <option value="TIRO LIBRE">TIRO LIBRE</option>
              <option value="CABEZAZO">CABEZAZO</option>
              <option value="GOL">GOL</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Asistencia (Opcional)</label>
            <input
              type="text"
              value={assistBy || ''}
              onChange={(e) => handleUpdate('assistBy', e.target.value)}
              placeholder="Ej. Bruno Sávio"
              className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Match Scoreboard Counters */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <span className="font-bold text-white block">Marcador del Partido con este Gol</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white truncate max-w-[80px]">{scoringClub.shortName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreDelta('home', -1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                -
              </button>
              <span className="font-anton text-lg text-yellow-400 w-4 text-center">{homeScore}</span>
              <button
                onClick={() => handleScoreDelta('home', 1)}
                className="w-6 h-6 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white truncate max-w-[80px]">{opponentClub.shortName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreDelta('away', -1)}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                -
              </button>
              <span className="font-anton text-lg text-slate-300 w-4 text-center">{awayScore}</span>
              <button
                onClick={() => handleScoreDelta('away', 1)}
                className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Celebrate button */}
      <button
        onClick={handleCelebrateGoal}
        className="w-full py-2.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 text-xs transition-all cursor-pointer"
      >
        <Flame className="w-4 h-4" />
        <span>¡Celebrar Gol con Confeti!</span>
      </button>
    </div>
  );
};
