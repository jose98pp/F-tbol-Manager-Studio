import React, { useState } from 'react';
import { TemplateData, FixtureMatch } from '../data/templates';
import { ClubBadge } from './ClubBadge';
import { getClubById, CLUBS } from '../data/clubs';
import { Plus, Trash2, Calendar, Trophy, Shuffle } from 'lucide-react';

interface FixtureEditorPanelProps {
  data: TemplateData;
  onUpdateData: (newData: TemplateData) => void;
  onOpenClubPicker: (matchId: string, side: 'home' | 'away') => void;
}

export const FixtureEditorPanel: React.FC<FixtureEditorPanelProps> = ({
  data,
  onUpdateData,
  onOpenClubPicker
}) => {
  const [selectedDay, setSelectedDay] = useState('MARTES');

  const handleAddMatch = () => {
    const newMatch: FixtureMatch = {
      id: `match-${Date.now()}`,
      day: selectedDay,
      homeClubId: 'bolivar',
      awayClubId: 'the-strongest',
      dateStr: `${selectedDay.slice(0, 3)} / 20:00`,
      stadium: 'Estadio Principal'
    };

    onUpdateData({
      ...data,
      fixtureMatches: [...data.fixtureMatches, newMatch]
    });
  };

  const handleRemoveMatch = (id: string) => {
    onUpdateData({
      ...data,
      fixtureMatches: data.fixtureMatches.filter(m => m.id !== id)
    });
  };

  const handleUpdateMatchField = (id: string, field: keyof FixtureMatch, value: any) => {
    onUpdateData({
      ...data,
      fixtureMatches: data.fixtureMatches.map(m => (m.id === id ? { ...m, [field]: value } : m))
    });
  };

  // Load the exact preset from Photo 3 (Copa Paceña Fecha 6)
  const handleLoadOfficialPhotoPreset = () => {
    onUpdateData({
      ...data,
      tournament: 'COPA PACEÑA',
      roundTitle: 'FIXTURE',
      dateRange: 'FECHA 6 • 29 SEP / 01 OCT',
      fixtureMatches: [
        {
          id: 'f1',
          day: 'MARTES',
          homeClubId: 'universitario-vinto',
          awayClubId: 'guabira',
          dateStr: 'MAR 29 / 15:00',
          stadium: 'Hipólito Lazarte'
        },
        {
          id: 'f2',
          day: 'MARTES',
          homeClubId: 'real-potosi',
          awayClubId: 'abb',
          dateStr: 'MAR 29 / 18:00',
          stadium: 'Víctor Agustín Ugarte'
        },
        {
          id: 'f3',
          day: 'MARTES',
          homeClubId: 'aurora',
          awayClubId: 'san-antonio',
          dateStr: 'SAB 19 / 20:00',
          stadium: 'Félix Capriles'
        },
        {
          id: 'f4',
          day: 'MIÉRCOLES',
          homeClubId: 'real-oruro',
          awayClubId: 'always-ready',
          dateStr: 'MIÉ 30 / 15:00',
          stadium: 'Jesús Bermúdez'
        },
        {
          id: 'f5',
          day: 'MIÉRCOLES',
          homeClubId: 'real-tomayapo',
          awayClubId: 'river-plate',
          dateStr: 'MIÉ 30 / 18:30',
          stadium: 'IV Centenario'
        },
        {
          id: 'f6',
          day: 'MIÉRCOLES',
          homeClubId: 'oriente-petrolero',
          awayClubId: 'the-strongest',
          dateStr: 'MIÉ 30 / 20:30',
          stadium: 'Tahuichi Aguilera'
        },
        {
          id: 'f7',
          day: 'JUEVES',
          homeClubId: 'bolivar',
          awayClubId: 'gv-san-jose',
          dateStr: 'JUE 01 / 18:30',
          stadium: 'Hernando Siles'
        },
        {
          id: 'f8',
          day: 'JUEVES',
          homeClubId: 'blooming',
          awayClubId: 'independiente-petrolero',
          dateStr: 'JUE 01 / 20:30',
          stadium: 'Tahuichi Aguilera'
        }
      ]
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Preset Action */}
      <div className="flex items-center justify-between p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <div>
          <span className="font-bold text-white block">Plantilla Foto Copa Paceña</span>
          <span className="text-[10px] text-slate-400">Escudos y horarios exactos de la foto</span>
        </div>
        <button
          onClick={handleLoadOfficialPhotoPreset}
          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Cargar Plantilla Foto</span>
        </button>
      </div>

      {/* Header text inputs */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Encabezado del Torneo</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Torneo</label>
            <input
              type="text"
              value={data.tournament}
              onChange={(e) => onUpdateData({ ...data, tournament: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Título</label>
            <input
              type="text"
              value={data.roundTitle}
              onChange={(e) => onUpdateData({ ...data, roundTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Fecha / Días</label>
            <input
              type="text"
              value={data.dateRange}
              onChange={(e) => onUpdateData({ ...data, dateRange: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Fixture Matches Manager */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Partidos del Fixture ({data.fixtureMatches.length})</span>
          </span>

          <div className="flex items-center gap-1.5">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-xs"
            >
              <option value="MARTES">MARTES</option>
              <option value="MIÉRCOLES">MIÉRCOLES</option>
              <option value="JUEVES">JUEVES</option>
              <option value="VIERNES">VIERNES</option>
              <option value="SÁBADO">SÁBADO</option>
              <option value="DOMINGO">DOMINGO</option>
            </select>
            <button
              onClick={handleAddMatch}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        {/* Match List */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {data.fixtureMatches.map((match, idx) => {
            const homeClub = getClubById(match.homeClubId);
            const awayClub = getClubById(match.awayClubId);

            return (
              <div
                key={match.id}
                className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2"
              >
                {/* Day Tag & Actions */}
                <div className="flex items-center justify-between text-[11px]">
                  <input
                    type="text"
                    value={match.day}
                    onChange={(e) => handleUpdateMatchField(match.id, 'day', e.target.value)}
                    className="w-24 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-emerald-400 font-bold uppercase"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={match.dateStr}
                      onChange={(e) => handleUpdateMatchField(match.id, 'dateStr', e.target.value)}
                      placeholder="MAR 29 / 15:00"
                      className="w-28 px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-200 text-center font-medium"
                    />
                    <button
                      onClick={() => handleRemoveMatch(match.id)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                      title="Eliminar partido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Clubs Selector row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Home Club Button */}
                  <button
                    type="button"
                    onClick={() => onOpenClubPicker(match.id, 'home')}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer"
                  >
                    <ClubBadge club={homeClub} size="xs" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400">Local</span>
                      <span className="block text-xs font-bold text-white truncate font-montserrat">
                        {homeClub.shortName}
                      </span>
                    </div>
                  </button>

                  {/* Away Club Button */}
                  <button
                    type="button"
                    onClick={() => onOpenClubPicker(match.id, 'away')}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors cursor-pointer"
                  >
                    <ClubBadge club={awayClub} size="xs" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400">Visitante</span>
                      <span className="block text-xs font-bold text-white truncate font-montserrat">
                        {awayClub.shortName}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
