import React, { useState } from 'react';
import { Competition, COMPETITIONS } from '../data/competitions';
import { CompetitionBadge } from './CompetitionBadge';
import { Trophy, X, Check, Plus, Upload, Globe2 } from 'lucide-react';

interface CompetitionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompetition: (competition: Competition) => void;
  currentCompetitionId?: string;
}

export const CompetitionPickerModal: React.FC<CompetitionPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectCompetition,
  currentCompetitionId = 'copa-pacena'
}) => {
  const [category, setCategory] = useState<'all' | 'bolivia' | 'conmebol' | 'uefa' | 'fifa'>('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBadgeUrl, setCustomBadgeUrl] = useState('');

  if (!isOpen) return null;

  const filteredCompetitions = COMPETITIONS.filter(c => {
    if (category === 'all') return true;
    return c.category === category;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomBadgeUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCustomCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newComp: Competition = {
      id: `custom-comp-${Date.now()}`,
      name: customName.trim(),
      shortName: customName.trim().toUpperCase(),
      category: 'bolivia',
      primaryColor: '#0284c7',
      accentColor: '#facc15',
      sponsorText: 'Transmisión Oficial',
      headerTheme: 'default',
      badgeUrl: customBadgeUrl || undefined,
      badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="60" r="45" fill="#0f172a" stroke="#facc15" stroke-width="3"/>
        <text x="80" y="66" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="10">${customName.slice(0, 8).toUpperCase()}</text>
      </svg>`
    };

    onSelectCompetition(newComp);
    setShowCustomForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-montserrat">Seleccionar Competencia o Torneo</h3>
              <p className="text-xs text-slate-400">Elige el logo oficial del torneo para personalizar el banner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === 'all'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategory('bolivia')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === 'bolivia'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🇧🇴 Bolivia (Copa Paceña / Liga)
            </button>
            <button
              onClick={() => setCategory('conmebol')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === 'conmebol'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏆 Libertadores & Sudamericana
            </button>
            <button
              onClick={() => setCategory('uefa')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === 'uefa'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⭐ UEFA / Premier / LaLiga
            </button>
            <button
              onClick={() => setCategory('fifa')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === 'fifa'
                  ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌍 Eliminatorias / Mundial
            </button>
          </div>

          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-yellow-400" />
            <span>Crear Torneo</span>
          </button>
        </div>

        {/* Custom Form Drawer */}
        {showCustomForm && (
          <form onSubmit={handleCreateCustomCompetition} className="p-4 bg-slate-950 border-b border-yellow-500/30 space-y-3">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">Crear Torneo Personalizado</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nombre del Torneo / Copa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Torneo Clausura, Copa de Campeones"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Logo del Torneo (PNG Transparente)</label>
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-slate-900 border border-dashed border-slate-700 rounded-lg text-slate-300 cursor-pointer hover:border-yellow-500">
                  <Upload className="w-4 h-4 text-yellow-400" />
                  <span>{customBadgeUrl ? '✓ Logo Cargado' : 'Subir imagen de la copa/logo'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Guardar y Aplicar
              </button>
            </div>
          </form>
        )}

        {/* Competitions Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredCompetitions.map(comp => {
            const isSelected = comp.id === currentCompetitionId;
            return (
              <button
                key={comp.id}
                onClick={() => {
                  onSelectCompetition(comp);
                  onClose();
                }}
                className={`group relative p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/20 ring-1 ring-yellow-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-slate-950">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="h-20 flex items-center justify-center group-hover:scale-105 transition-transform my-1">
                  <CompetitionBadge competition={comp} size="md" />
                </div>

                <div className="mt-2 w-full">
                  <span className="block text-xs font-bold text-white group-hover:text-yellow-400 font-montserrat truncate">
                    {comp.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                    {comp.sponsorText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Elige el torneo y el banner adoptará el logo oficial y sus colores correspondientes</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
