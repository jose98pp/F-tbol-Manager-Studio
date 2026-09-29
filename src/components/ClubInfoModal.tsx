import React, { useState } from 'react';
import { Club, Player, getClubById } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { X, Shield, MapPin, Calendar, Award, User, Flame, Users, Sparkles } from 'lucide-react';

interface ClubInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  onSelectPlayerForGoal?: (player: Player, club: Club) => void;
  onApplySquadToLineup?: (club: Club) => void;
}

export const ClubInfoModal: React.FC<ClubInfoModalProps> = ({
  isOpen,
  onClose,
  club,
  onSelectPlayerForGoal,
  onApplySquadToLineup
}) => {
  const [selectedPosition, setSelectedPosition] = useState<'ALL' | 'POR' | 'DEF' | 'MED' | 'DEL'>('ALL');

  if (!isOpen) return null;

  const squad = club.squad || [];
  const filteredSquad = squad.filter(p => selectedPosition === 'ALL' || p.position === selectedPosition);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with Club Colors */}
        <div
          className="p-5 border-b border-slate-800 flex items-center justify-between relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${club.primaryColor}22 0%, #0f172a 100%)`
          }}
        >
          <div className="flex items-center gap-4 relative z-10">
            <ClubBadge club={club} size="lg" glow />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-anton text-2xl text-white tracking-wide">{club.name}</h3>
                {club.nickname && (
                  <span className="text-[10px] text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700">
                    {club.nickname}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                {club.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {club.city}
                  </span>
                )}
                {club.stadium && (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    {club.stadium}
                  </span>
                )}
                {club.coach && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-yellow-400" />
                    DT: {club.coach}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            {(['ALL', 'POR', 'DEF', 'MED', 'DEL'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPosition === pos
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {pos === 'ALL' ? 'Todos' : pos}
              </button>
            ))}
          </div>

          {onApplySquadToLineup && (
            <button
              onClick={() => {
                onApplySquadToLineup(club);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Cargar Alineación 11</span>
            </button>
          )}
        </div>

        {/* Players List Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSquad.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <User className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Sin jugadores registrados para esta posición</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {filteredSquad.map(player => (
                <div
                  key={player.id}
                  className="p-2.5 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-anton flex items-center justify-center text-sm shadow">
                      {player.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white font-montserrat">{player.name}</span>
                        {player.isCaptain && (
                          <span className="px-1 bg-yellow-400 text-slate-950 font-black text-[9px] rounded">
                            C
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{player.position}</span>
                    </div>
                  </div>

                  {onSelectPlayerForGoal && (
                    <button
                      onClick={() => {
                        onSelectPlayerForGoal(player, club);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 rounded-lg font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Crear banner de gol con este jugador"
                    >
                      <Flame className="w-3 h-3 text-yellow-400" />
                      <span>¡Gol!</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>{squad.length} jugadores en la plantilla oficial</span>
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
