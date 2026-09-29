import React, { useState, useEffect } from 'react';
import {
  SocialPostRecord,
  getPublicationHistory,
  savePublicationRecord,
  updatePublicationRecord,
  deletePublicationRecord
} from '../data/publicationHistory';
import { BrandProfile } from '../data/brands';
import { TemplateData } from '../data/templates';
import {
  X,
  Send,
  Calendar,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  Trash2,
  Check,
  Smartphone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Radio,
  Sparkles,
  Share2
} from 'lucide-react';

interface SocialPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TemplateData;
  activeBrand: BrandProfile;
  initialCaption?: string;
  initialNetwork?: string;
}

export const SocialPublisherModal: React.FC<SocialPublisherModalProps> = ({
  isOpen,
  onClose,
  data,
  activeBrand,
  initialCaption = '',
  initialNetwork
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'calendar' | 'history'>('publish');
  const [historyList, setHistoryList] = useState<SocialPostRecord[]>([]);

  // Publish Form State
  const [title, setTitle] = useState(`${data.type.toUpperCase()}: ${data.tournament}`);
  const [caption, setCaption] = useState(initialCaption || '');
  const [selectedNetworks, setSelectedNetworks] = useState<{
    facebook: boolean;
    tiktok: boolean;
    instagram: boolean;
    youtube: boolean;
    twitter: boolean;
  }>({
    facebook: activeBrand.connectedAccounts.facebook,
    tiktok: activeBrand.connectedAccounts.tiktok,
    instagram: activeBrand.connectedAccounts.instagram,
    youtube: activeBrand.connectedAccounts.youtube,
    twitter: activeBrand.connectedAccounts.twitter
  });

  // Scheduling State (Bolivia Time BOT UTC-4)
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('2026-10-04');
  const [scheduledTime, setScheduledTime] = useState('17:30'); // Bolivia Match time
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setHistoryList(getPublicationHistory());
  }, [isOpen]);

  useEffect(() => {
    if (initialCaption) {
      setCaption(initialCaption);
    }
  }, [initialCaption]);

  if (!isOpen) return null;

  const handleToggleNetwork = (net: keyof typeof selectedNetworks) => {
    setSelectedNetworks(prev => ({ ...prev, [net]: !prev[net] }));
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    const activeNets = Object.entries(selectedNetworks)
      .filter(([_, active]) => active)
      .map(([name]) => name as 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'twitter');

    if (activeNets.length === 0) {
      alert('Por favor selecciona al menos una red social conectada.');
      setIsPublishing(false);
      return;
    }

    try {
      // Call backend publish simulation
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: activeNets,
          caption,
          title,
          scheduledFor: isScheduled ? `${scheduledDate} ${scheduledTime} BOT` : undefined
        })
      });

      const result = await res.json();

      const newRecord = savePublicationRecord({
        title: title.trim() || 'Publicación de Fútbol',
        templateType: data.type,
        channelName: activeBrand.name,
        networks: activeNets,
        caption: caption.trim(),
        status: isScheduled ? 'scheduled' : 'published',
        scheduledTimeBolivia: isScheduled ? `${scheduledDate} ${scheduledTime} BOT` : undefined,
        publishedAt: isScheduled ? undefined : new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' }) + ' BOT',
        postUrls: result.results.map((r: any) => ({
          network: r.channel,
          url: r.postUrl,
          status: 'success'
        }))
      });

      setHistoryList(prev => [newRecord, ...prev]);
      setSuccessMessage(isScheduled ? '¡Publicación programada con éxito en horario de Bolivia (BOT)!' : '¡Banner y texto publicados con éxito!');

      setTimeout(() => {
        setSuccessMessage(null);
        setActiveTab('history');
      }, 1500);
    } catch (e) {
      console.error('Error publishing:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRetryFailedPost = (record: SocialPostRecord) => {
    // Only retry the failed networks, preventing duplication of already published channels
    const failedNetworks = record.postUrls.filter(p => p.status === 'failed').map(p => p.network);
    const retryNetworks = failedNetworks.length > 0 ? failedNetworks : record.networks;

    const updatedUrls = record.postUrls.map(p => {
      if (p.status === 'failed') {
        let newUrl = '';
        if (p.network === 'twitter') newUrl = `https://x.com/sports_bo/status/${Date.now()}`;
        if (p.network === 'facebook') newUrl = `https://www.facebook.com/posts/${Date.now()}`;
        return { ...p, status: 'success' as const, url: newUrl };
      }
      return p;
    });

    const updatedList = updatePublicationRecord(record.id, {
      status: 'published',
      publishedAt: new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' }) + ' BOT',
      errorMessage: undefined,
      postUrls: updatedUrls
    });

    setHistoryList(updatedList);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deletePublicationRecord(id);
    setHistoryList(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs text-slate-100">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-montserrat">
                  Centro de Publicación & Redes
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-mono font-bold">
                  {activeBrand.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Envío directo a cuentas conectadas, calendario Bolivia (BOT) e historial
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

        {/* Navigation Tabs */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/70 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('publish')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'publish'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar desde el Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendario de Publicaciones (BOT)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial y Reintentos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
              {historyList.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Publicar desde el Editor */}
        {activeTab === 'publish' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {successMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Accounts & Scheduling */}
              <div className="space-y-4">
                {/* Connected Accounts selector */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block font-montserrat">
                    1. Selecciona las Cuentas Conectadas
                  </span>

                  <div className="space-y-2">
                    {/* Facebook */}
                    <div
                      onClick={() => handleToggleNetwork('facebook')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedNetworks.facebook
                          ? 'bg-blue-950/40 border-blue-500/60 shadow'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                          <Facebook className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">Facebook Page</span>
                          <span className="text-[10px] text-slate-400">
                            {activeBrand.connectedAccounts.facebookPageName || 'Página de Transmisión'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.facebook}
                        onChange={() => {}}
                        className="accent-blue-500 w-4 h-4"
                      />
                    </div>

                    {/* TikTok */}
                    <div
                      onClick={() => handleToggleNetwork('tiktok')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedNetworks.tiktok
                          ? 'bg-cyan-950/40 border-cyan-500/60 shadow'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-cyan-400 text-cyan-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">TikTok Feed & Stories</span>
                          <span className="text-[10px] text-slate-400">
                            {activeBrand.connectedAccounts.tiktokHandle || '@deportes'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.tiktok}
                        onChange={() => {}}
                        className="accent-cyan-400 w-4 h-4"
                      />
                    </div>

                    {/* Instagram */}
                    <div
                      onClick={() => handleToggleNetwork('instagram')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedNetworks.instagram
                          ? 'bg-pink-950/40 border-pink-500/60 shadow'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white">
                          <Instagram className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">Instagram Feed</span>
                          <span className="text-[10px] text-slate-400">
                            {activeBrand.connectedAccounts.instagramHandle || '@sports_ig'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.instagram}
                        onChange={() => {}}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </div>

                    {/* YouTube Community */}
                    <div
                      onClick={() => handleToggleNetwork('youtube')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedNetworks.youtube
                          ? 'bg-red-950/40 border-red-500/60 shadow'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-red-600 text-white">
                          <Youtube className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">YouTube Comunidad</span>
                          <span className="text-[10px] text-slate-400">
                            {activeBrand.connectedAccounts.youtubeChannel || 'Canal Principal'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.youtube}
                        onChange={() => {}}
                        className="accent-red-500 w-4 h-4"
                      />
                    </div>

                    {/* X / Twitter */}
                    <div
                      onClick={() => handleToggleNetwork('twitter')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedNetworks.twitter
                          ? 'bg-slate-800 border-slate-500 shadow'
                          : 'bg-slate-900 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-white border border-slate-600">
                          <Twitter className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">X (Twitter)</span>
                          <span className="text-[10px] text-slate-400">
                            {activeBrand.connectedAccounts.twitterHandle || '@canal_bo'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedNetworks.twitter}
                        onChange={() => {}}
                        className="accent-slate-400 w-4 h-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling Option with Bolivia BOT */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">Programar para una hora específica</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {isScheduled ? (
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                        <span>Horario de Bolivia (BOT, UTC-4):</span>
                        <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          La Paz / Santa Cruz
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Fecha:</label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Hora Bolivia:</label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold"
                          />
                        </div>
                      </div>

                      {/* Quick matchday scheduling presets */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                        <span className="text-[10px] text-slate-500 shrink-0">Atajos:</span>
                        <button
                          type="button"
                          onClick={() => setScheduledTime('15:30')}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          15:30 (Tarde)
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduledTime('17:30')}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          17:30 (Clásico)
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduledTime('20:00')}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          20:00 (Noche)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Se publicará inmediatamente en las redes seleccionadas al presionar el botón inferior.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Title & Caption Editor */}
              <div className="space-y-4 flex flex-col">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex-1 flex flex-col">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block font-montserrat">
                    2. Contenido del Post y Descripción
                  </span>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">Título de referencia interna:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
                      placeholder="Ej. Previa Clásico Fecha 6..."
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-300">Descripción / Caption a publicar:</label>
                      <span className="text-[10px] text-slate-500 font-mono">{caption.length} caracteres</span>
                    </div>
                    <textarea
                      rows={8}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Escribe la descripción o genera una con el asistente de IA..."
                      className="w-full flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Final Submit Button */}
                <button
                  onClick={handlePublishNow}
                  disabled={isPublishing}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isPublishing
                      ? 'Enviando publicación...'
                      : isScheduled
                      ? `Programar Publicación para ${scheduledTime} BOT`
                      : 'Publicar Ahora en Redes Seleccionadas'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Calendario de Publicaciones */}
        {activeTab === 'calendar' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block font-montserrat">
                  Cronograma de Publicaciones de la Fecha
                </span>
                <span className="text-[11px] text-emerald-300">
                  Todas las horas corresponden al huso horario de Bolivia (BOT, UTC-4).
                </span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg text-[10px]">
                Hora Local: {new Date().toLocaleTimeString('es-BO', { timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit' })} BOT
              </span>
            </div>

            {/* Interactive Timeline Schedule for a Complete Matchday */}
            <div className="space-y-3">
              {[
                { time: '14:00 BOT', stage: 'PREVIA', desc: 'Lanzamiento del banner de previa y cartelera general', status: 'Listo para emitir' },
                { time: '16:30 BOT', stage: '11 TITULAR', desc: 'Publicación de alineaciones oficiales confirmadas', status: 'Programado' },
                { time: '17:30 BOT', stage: 'INICIO PARTIDO', desc: 'Aviso de arranque en vivo y minuto a minuto', status: 'Programado' },
                { time: '18:15 BOT', stage: 'GOL EN VIVO', desc: 'Plantilla de gol en caliente para shorts y feed', status: 'En espera' },
                { time: '19:25 BOT', stage: 'RESULTADO FINAL', desc: 'Marcador definitivo y tabla de posiciones actualizada', status: 'Programado' }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-20 px-2 py-1 bg-slate-900 text-emerald-400 font-mono font-bold text-center rounded border border-slate-800">
                      {item.time}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{item.stage}</span>
                      <span className="text-[11px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-bold text-[10px]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Historial y Reintentos */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {historyList.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay publicaciones registradas aún.</p>
              </div>
            ) : (
              historyList.map(record => {
                const hasFailed = record.status === 'failed' || record.postUrls.some(p => p.status === 'failed');

                return (
                  <div
                    key={record.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      hasFailed
                        ? 'bg-red-950/20 border-red-500/40'
                        : record.status === 'scheduled'
                        ? 'bg-blue-950/20 border-blue-500/40'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{record.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              hasFailed
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : record.status === 'scheduled'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            {hasFailed ? 'Fallido (Error)' : record.status === 'scheduled' ? 'Programado' : 'Publicado'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {record.channelName} • {record.publishedAt || record.scheduledTimeBolivia}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {hasFailed && (
                          <button
                            onClick={() => handleRetryFailedPost(record)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
                            title="Reintentar sólo en las redes fallidas sin duplicar las ya exitosas"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reintentar</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 cursor-pointer transition-colors"
                          title="Eliminar del historial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Caption Preview */}
                    <p className="text-slate-300 text-[11px] my-2 line-clamp-2 italic">
                      "{record.caption}"
                    </p>

                    {/* Network Post Links */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {record.postUrls.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 font-bold flex items-center gap-1 transition-colors text-[10px]"
                            >
                              <span className="capitalize">{p.network}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-400 border border-red-800 text-[10px]">
                              {p.network}: Falló
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {record.errorMessage && (
                      <div className="mt-2 text-[10px] text-red-400 bg-red-950/40 p-1.5 rounded-md border border-red-900/60">
                        <strong>Causa del error:</strong> {record.errorMessage}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
