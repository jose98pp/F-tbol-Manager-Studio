import React, { useState, useEffect } from 'react';
import {
  SavedTemplatePreset,
  DEFAULT_SAVED_PRESETS,
  getCustomPresets,
  saveCustomPreset,
  deleteCustomPreset
} from '../data/savedTemplates';
import { TemplateData } from '../data/templates';
import { X, Bookmark, Plus, Check, Trash2, Calendar, Swords, Users, Flame, CheckCircle, Trophy, Sparkles } from 'lucide-react';

interface SavedTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: TemplateData;
  onApplyTemplate: (data: TemplateData) => void;
}

export const SavedTemplatesModal: React.FC<SavedTemplatesModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onApplyTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'previa' | 'alineacion' | 'gol' | 'resultado' | 'resumen'>('all');
  const [customPresets, setCustomPresets] = useState<SavedTemplatePreset[]>([]);
  const [isSavingCurrent, setIsSavingCurrent] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<'previa' | 'alineacion' | 'gol' | 'resultado' | 'resumen'>('previa');

  useEffect(() => {
    setCustomPresets(getCustomPresets());
  }, [isOpen]);

  if (!isOpen) return null;

  const allPresets = [...customPresets, ...DEFAULT_SAVED_PRESETS];
  const filteredPresets = selectedCategory === 'all'
    ? allPresets
    : allPresets.filter(p => p.category === selectedCategory);

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    const saved = saveCustomPreset({
      name: newTemplateName.trim(),
      description: `Plantilla personalizada basada en ${currentData.tournament || 'Fútbol'}`,
      category: newTemplateCategory,
      type: currentData.type,
      badgeTag: 'MI PLANTILLA',
      previewColor: 'from-cyan-500 to-blue-600',
      data: currentData
    });

    setCustomPresets(prev => [saved, ...prev]);
    setNewTemplateName('');
    setIsSavingCurrent(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomPreset(id);
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'previa': return <Swords className="w-3.5 h-3.5" />;
      case 'alineacion': return <Users className="w-3.5 h-3.5" />;
      case 'gol': return <Flame className="w-3.5 h-3.5" />;
      case 'resultado': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'resumen': return <Calendar className="w-3.5 h-3.5" />;
      default: return <Bookmark className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat flex items-center gap-2">
                <span>Plantillas Deportivas Guardadas</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-yellow-400 font-mono">
                  {allPresets.length} disponibles
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Reutiliza al instante diseños de previa, alineación, gol, resultado y resumen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSavingCurrent(!isSavingCurrent)}
              className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Diseño Actual</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer to Save Current Template */}
        {isSavingCurrent && (
          <form onSubmit={handleSaveCurrent} className="p-4 bg-slate-950 border-b border-yellow-500/40 space-y-3">
            <span className="font-bold text-white text-xs block font-montserrat">
              Guardar diseño activo como nueva plantilla
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400 block mb-1">Nombre de la plantilla:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Previa Clásico Fecha 7 / Mi estilo oscuro..."
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Categoría:</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs capitalize cursor-pointer"
                >
                  <option value="previa">Previa (Versus)</option>
                  <option value="alineacion">Alineación (11 Titular)</option>
                  <option value="gol">¡Gol!</option>
                  <option value="resultado">Resultado Final</option>
                  <option value="resumen">Resumen / Fixture</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSavingCurrent(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 shadow"
              >
                Guardar Plantilla
              </button>
            </div>
          </form>
        )}

        {/* Category Filters */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'Todas las Plantillas' },
            { id: 'previa', label: 'Previas (Versus)' },
            { id: 'alineacion', label: 'Alineación (11)' },
            { id: 'gol', label: 'Goles' },
            { id: 'resultado', label: 'Resultados' },
            { id: 'resumen', label: 'Resumen (Fixture)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-yellow-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map(preset => (
              <div
                key={preset.id}
                onClick={() => {
                  onApplyTemplate(preset.data);
                  onClose();
                }}
                className="group p-4 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-yellow-500/60 rounded-2xl cursor-pointer transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-yellow-400 border border-slate-700 text-[10px] font-bold flex items-center gap-1">
                      {getCategoryIcon(preset.category)}
                      <span className="uppercase">{preset.badgeTag}</span>
                    </span>

                    {preset.isCustom && (
                      <button
                        onClick={(e) => handleDelete(preset.id, e)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                        title="Eliminar plantilla personalizada"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="font-anton uppercase tracking-wide text-base text-white group-hover:text-yellow-400 transition-colors mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 capitalize">Tipo: {preset.type}</span>
                  <span className="text-yellow-400 font-bold group-hover:underline flex items-center gap-1">
                    <span>Aplicar</span>
                    <Sparkles className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
