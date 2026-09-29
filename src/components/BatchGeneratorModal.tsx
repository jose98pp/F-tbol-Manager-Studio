import React, { useState } from 'react';
import { TemplateData, FixtureMatch } from '../data/templates';
import { ChannelBranding, BANNER_FORMATS } from '../data/branding';
import { getClubById } from '../data/clubs';
import { getCompetitionById } from '../data/competitions';
import { ClubBadge } from './ClubBadge';
import { savePublicationRecord } from '../data/publicationHistory';
import { X, Layers, Download, Calendar, CheckCircle2, Swords, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TemplateData;
  branding: ChannelBranding;
  onLoadMatchIntoCanvas: (match: FixtureMatch, mode: 'versus' | 'result') => void;
  onOpenPublisher: () => void;
}

export const BatchGeneratorModal: React.FC<BatchGeneratorModalProps> = ({
  isOpen,
  onClose,
  data,
  branding,
  onLoadMatchIntoCanvas,
  onOpenPublisher
}) => {
  const [selectedMatches, setSelectedMatches] = useState<string[]>(
    data.fixtureMatches.map(m => m.id)
  );
  const [includeResults, setIncludeResults] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  if (!isOpen) return null;

  const competition = getCompetitionById(data.competitionId);

  const handleToggleMatch = (id: string) => {
    setSelectedMatches(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedMatches(data.fixtureMatches.map(m => m.id));
  };

  const handleScheduleAllToCalendar = () => {
    setIsProcessing(true);
    try {
      // Create scheduled entries for each selected match
      selectedMatches.forEach((matchId, index) => {
        const match = data.fixtureMatches.find(m => m.id === matchId);
        if (!match) return;

        const home = getClubById(match.homeClubId);
        const away = getClubById(match.awayClubId);

        // Previa
        savePublicationRecord({
          title: `Previa Lote: ${home.name} vs ${away.name}`,
          templateType: 'versus',
          channelName: branding.channelName,
          networks: ['facebook', 'tiktok'],
          caption: `🔥 ¡Se juega por ${competition.name}! ${home.name} vs ${away.name}. ¿Quién gana? Sigue el partido en vivo con ${branding.channelName}. #FutbolBoliviano`,
          status: 'scheduled',
          scheduledTimeBolivia: `2026-10-04 ${match.time || '17:30'} BOT`,
          postUrls: []
        });

        // Resultado
        if (includeResults) {
          savePublicationRecord({
            title: `Resultado Lote: ${home.name} vs ${away.name}`,
            templateType: 'result',
            channelName: branding.channelName,
            networks: ['facebook', 'instagram'],
            caption: `⏱️ Marcador final entre ${home.name} y ${away.name} por ${competition.name}. Todos los detalles y tabla actualizada en ${branding.channelName}.`,
            status: 'scheduled',
            scheduledTimeBolivia: `2026-10-04 19:30 BOT`,
            postUrls: []
          });
        }
      });

      setBatchSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => {
        setBatchSuccess(false);
      }, 2500);
    } catch (e) {
      console.error('Error scheduling batch:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBannersCount = selectedMatches.length * (includeResults ? 2 : 1) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-montserrat flex items-center gap-2">
                <span>Generación por Lotes (Batch Generator)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  {totalBannersCount} Banners
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Genera automáticamente toda la jornada de partidos registrados de {competition.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Options */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer"
            >
              Seleccionar Todos ({data.fixtureMatches.length})
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
              <input
                type="checkbox"
                checked={includeResults}
                onChange={(e) => setIncludeResults(e.target.checked)}
                className="accent-emerald-500 w-4 h-4"
              />
              <span>Incluir Banners de Resultado Final para cada partido</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleScheduleAllToCalendar}
              disabled={isProcessing || selectedMatches.length === 0}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Programando...' : 'Programar Todo al Calendario'}</span>
            </button>
          </div>
        </div>

        {batchSuccess && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>¡Se han programado todos los partidos de la jornada en el calendario con horario de Bolivia (BOT)!</span>
          </div>
        )}

        {/* Matches List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="font-bold text-white">Banner 1: Cartelera General (Fixture de la Fecha)</span>
            </div>
            <span className="text-[10px] text-slate-400">Incluido por defecto</span>
          </div>

          {data.fixtureMatches.map((match, idx) => {
            const home = getClubById(match.homeClubId);
            const away = getClubById(match.awayClubId);
            const isSelected = selectedMatches.includes(match.id);

            return (
              <div
                key={match.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500/50 shadow'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleMatch(match.id)}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold w-4">{idx + 1}.</span>
                    <ClubBadge club={home} size="sm" />
                    <span className="font-black text-white">{home.name}</span>
                    <span className="text-slate-500 font-bold">vs</span>
                    <span className="font-black text-white">{away.name}</span>
                    <ClubBadge club={away} size="sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] self-end sm:self-auto">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-yellow-400 font-bold">
                    {match.day} • {match.time || '17:30'} BOT
                  </span>

                  <button
                    onClick={() => {
                      onLoadMatchIntoCanvas(match, 'versus');
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
                    title="Editar y previsualizar previa en el lienzo"
                  >
                    <Swords className="w-3 h-3" />
                    <span>Abrir Previa</span>
                  </button>

                  <button
                    onClick={() => {
                      onLoadMatchIntoCanvas(match, 'result');
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
                    title="Editar y previsualizar resultado en el lienzo"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resultado</span>
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
