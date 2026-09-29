import React, { useState } from 'react';
import { TemplateData } from '../data/templates';
import { Club, Player, getClubById } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { Users, Shuffle, Plus, Trash2, Award, Shield } from 'lucide-react';

interface LineupEditorPanelProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  onOpenClubPicker: () => void;
  onOpenClubInfo: (club: Club) => void;
}

export const LineupEditorPanel: React.FC<LineupEditorPanelProps> = ({
  data,
  onUpdateData,
  onOpenClubPicker,
  onOpenClubInfo
}) => {
  const currentClub = getClubById(data.lineup.clubId);
  const { starters, substitutes, formation, coach } = data.lineup;

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPos, setNewPlayerPos] = useState<'POR' | 'DEF' | 'MED' | 'DEL'>('MED');

  const handleFormationChange = (form: '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2') => {
    onUpdateData({
      ...data,
      lineup: { ...data.lineup, formation: form }
    });
  };

  const handleCoachChange = (val: string) => {
    onUpdateData({
      ...data,
      lineup: { ...data.lineup, coach: val }
    });
  };

  const handleUpdateStarter = (index: number, field: keyof Player, value: any) => {
    const updated = [...starters];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateData({
      ...data,
      lineup: { ...data.lineup, starters: updated }
    });
  };

  const handleToggleCaptain = (index: number) => {
    const updated = starters.map((p, i) => ({
      ...p,
      isCaptain: i === index ? !p.isCaptain : false
    }));
    onUpdateData({
      ...data,
      lineup: { ...data.lineup, starters: updated }
    });
  };

  const handleReloadOfficialSquad = () => {
    if (currentClub.squad && currentClub.squad.length > 0) {
      onUpdateData({
        ...data,
        lineup: {
          ...data.lineup,
          coach: currentClub.coach || data.lineup.coach,
          starters: currentClub.squad.slice(0, 11),
          substitutes: currentClub.squad.slice(11, 16)
        }
      });
    }
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newP: Player = {
      id: `p-${Date.now()}`,
      name: newPlayerName.trim(),
      number: Number(newPlayerNumber) || starters.length + 1,
      position: newPlayerPos
    };

    onUpdateData({
      ...data,
      lineup: {
        ...data.lineup,
        starters: [...data.lineup.starters, newP]
      }
    });

    setNewPlayerName('');
    setNewPlayerNumber('');
  };

  const handleRemovePlayer = (id: string) => {
    onUpdateData({
      ...data,
      lineup: {
        ...data.lineup,
        starters: data.lineup.starters.filter(p => p.id !== id)
      }
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Team selection card */}
      <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ClubBadge club={currentClub} size="md" glow />
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Equipo de la Alineación</span>
            <span className="text-sm font-black text-white font-montserrat">{currentClub.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenClubInfo(currentClub)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
            title="Ver plantilla y ficha del club"
          >
            Ver Ficha
          </button>
          <button
            onClick={onOpenClubPicker}
            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Cambiar
          </button>
        </div>
      </div>

      {/* Formation & Coach */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
        <div>
          <label className="text-slate-400 block mb-1.5 font-bold">Formación Táctica</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => handleFormationChange(fmt)}
                className={`py-1.5 rounded-lg font-black font-orbitron text-xs transition-all ${
                  formation === fmt
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex-1">
            <label className="text-slate-400 block mb-1">Director Técnico (DT)</label>
            <input
              type="text"
              value={coach}
              onChange={(e) => handleCoachChange(e.target.value)}
              placeholder="Flavio Robatto"
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-medium"
            />
          </div>
          <button
            onClick={handleReloadOfficialSquad}
            className="mt-4 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
            title="Recargar los 11 titulares reales del club"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Plantilla Real</span>
          </button>
        </div>
      </div>

      {/* Starting 11 Manager */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Los 11 Titulares ({starters.length})</span>
          </span>
          <span className="text-[10px] text-slate-400">Clic en (C) para designar Capitán</span>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {starters.map((p, idx) => (
            <div
              key={p.id || idx}
              className="flex items-center justify-between p-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs gap-1.5"
            >
              <input
                type="number"
                value={p.number}
                onChange={(e) => handleUpdateStarter(idx, 'number', Number(e.target.value))}
                className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-emerald-400 font-bold"
              />
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleUpdateStarter(idx, 'name', e.target.value)}
                className="flex-1 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-white"
              />
              <select
                value={p.position}
                onChange={(e) => handleUpdateStarter(idx, 'position', e.target.value)}
                className="w-16 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 text-[10px]"
              >
                <option value="POR">POR</option>
                <option value="DEF">DEF</option>
                <option value="MED">MED</option>
                <option value="DEL">DEL</option>
              </select>

              <button
                type="button"
                onClick={() => handleToggleCaptain(idx)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                  p.isCaptain ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
                title="Capitán"
              >
                C
              </button>

              <button
                type="button"
                onClick={() => handleRemovePlayer(p.id)}
                className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add player row */}
        <form onSubmit={handleAddPlayer} className="flex gap-1.5 pt-2 border-t border-slate-800">
          <input
            type="number"
            placeholder="#"
            value={newPlayerNumber}
            onChange={(e) => setNewPlayerNumber(e.target.value)}
            className="w-10 px-1 py-1 bg-slate-950 border border-slate-700 rounded text-center text-white"
          />
          <input
            type="text"
            placeholder="Nuevo jugador..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="flex-1 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white"
          />
          <select
            value={newPlayerPos}
            onChange={(e) => setNewPlayerPos(e.target.value as any)}
            className="w-16 px-1 py-1 bg-slate-950 border border-slate-700 rounded text-slate-300 text-xs"
          >
            <option value="POR">POR</option>
            <option value="DEF">DEF</option>
            <option value="MED">MED</option>
            <option value="DEL">DEL</option>
          </select>
          <button
            type="submit"
            className="px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
