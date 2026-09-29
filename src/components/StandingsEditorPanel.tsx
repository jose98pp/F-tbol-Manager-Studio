import React from 'react';
import { TemplateData, StandingRow } from '../data/templates';
import { getClubById, CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { Trophy, ArrowUpDown } from 'lucide-react';

interface StandingsEditorPanelProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  onOpenClubPicker: (clubId: string, index: number) => void;
}

export const StandingsEditorPanel: React.FC<StandingsEditorPanelProps> = ({
  data,
  onUpdateData,
  onOpenClubPicker
}) => {
  const handleUpdateRow = (index: number, field: keyof StandingRow, value: any) => {
    const updated = [...data.standings];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    onUpdateData({ ...data, standings: updated });
  };

  const handleSortByPoints = () => {
    const sorted = [...data.standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const dgB = b.goalsFor - b.goalsAgainst;
      const dgA = a.goalsFor - a.goalsAgainst;
      return dgB - dgA;
    });
    // Re-assign positions
    const reindexed = sorted.map((row, i) => ({ ...row, position: i + 1 }));
    onUpdateData({ ...data, standings: reindexed });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Editar Tabla de Posiciones</span>
        </span>
        <button
          onClick={handleSortByPoints}
          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Ordenar por Puntos</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
        {data.standings.map((row, idx) => {
          const club = getClubById(row.clubId);
          return (
            <div
              key={row.clubId + idx}
              className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
            >
              <button
                type="button"
                onClick={() => onOpenClubPicker(row.clubId, idx)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-80 cursor-pointer"
              >
                <span className="font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                <ClubBadge club={club} size="xs" />
                <span className="font-bold text-white truncate text-xs">{club.shortName}</span>
              </button>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">PJ</span>
                  <input
                    type="number"
                    value={row.played}
                    onChange={(e) => handleUpdateRow(idx, 'played', e.target.value)}
                    className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-white"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">GF</span>
                  <input
                    type="number"
                    value={row.goalsFor}
                    onChange={(e) => handleUpdateRow(idx, 'goalsFor', e.target.value)}
                    className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-white"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">GC</span>
                  <input
                    type="number"
                    value={row.goalsAgainst}
                    onChange={(e) => handleUpdateRow(idx, 'goalsAgainst', e.target.value)}
                    className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-white"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-emerald-400 block font-bold">PTS</span>
                  <input
                    type="number"
                    value={row.points}
                    onChange={(e) => handleUpdateRow(idx, 'points', e.target.value)}
                    className="w-12 px-1 py-0.5 bg-slate-900 border border-emerald-500/60 rounded text-center text-emerald-400 font-bold"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
