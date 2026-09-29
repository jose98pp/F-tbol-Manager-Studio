import React, { useState } from 'react';
import { TemplateData } from '../data/templates';
import { ChannelBranding } from '../data/branding';
import { getClubById } from '../data/clubs';
import { getCompetitionById } from '../data/competitions';
import { Sparkles, Copy, Check, RefreshCw, Send, Hash, MessageSquare, Flame, Newspaper, AlertTriangle, Zap } from 'lucide-react';

interface AiSocialCaptionsPanelProps {
  data: TemplateData;
  branding: ChannelBranding;
  onOpenPublisherWithText?: (network: string, captionText: string) => void;
}

interface GeneratedCaptions {
  tiktok: { caption: string; hashtags: string[] };
  facebook: { postText: string; callToAction: string; hashtags: string[] };
  instagram: { caption: string; hashtags: string[] };
  twitter: { tweet: string; hashtags: string[] };
  youtube: { title: string; description: string; tags: string[] };
}

export const AiSocialCaptionsPanel: React.FC<AiSocialCaptionsPanelProps> = ({
  data,
  branding,
  onOpenPublisherWithText
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<'tiktok' | 'facebook' | 'instagram' | 'twitter' | 'youtube'>('tiktok');
  const [tone, setTone] = useState<'emocionante' | 'periodistico' | 'polemico' | 'urgente'>('emocionante');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const competition = getCompetitionById(data.competitionId);
  const homeClub = getClubById(data.singleMatch.homeClubId);
  const awayClub = getClubById(data.singleMatch.awayClubId);

  // Initial smart defaults
  const [captions, setCaptions] = useState<GeneratedCaptions>({
    tiktok: {
      caption: `🔥 ¡Se juega un partidazo inolvidable! ${homeClub.name} vs ${awayClub.name} por ${competition.name}. ¿Quién se queda con la victoria hoy? ¡Déjalo en los comentarios y síguenos en directo por ${branding.channelName}! ⚽🏆`,
      hashtags: ['#FutbolBoliviano', '#CopaPaceña', '#LigaTecno', '#Clasico', '#ParaTi', '#FutbolEnVivo']
    },
    facebook: {
      postText: `🚨 ¡ATENCIÓN HINCHADA! Se viene una jornada electrizante de ${competition.name}.\n\n⚔️ ${homeClub.name} vs ${awayClub.name}\n📌 Estadio: ${data.singleMatch.stadium || 'Por confirmar'} | Horario: ${data.singleMatch.matchTime || '20:00 BOT'}\n\n🎙️ Transmisión completa, análisis táctico y reacciones en tiempo real a través de ${branding.channelName}.\n\n¿Cuál es tu pronóstico para este encuentro? ¿Gana el local o la visita? ¡Los leemos en los comentarios! 👇🔥`,
      callToAction: '¡Sigue nuestra página y activa las notificaciones para no perderte el pitazo inicial!',
      hashtags: ['#FutbolBoliviano', '#EnVivo', '#DivisionProfesional', '#PasionFutbolera']
    },
    instagram: {
      caption: `⚡ DÍA DE PARTIDO | ${homeClub.name} vs ${awayClub.name} ⚡\n\nTodo listo para una fecha decisiva de ${competition.name}. La emoción no se detiene y podrás vivir cada minuto con relatos y análisis de primera.\n\n🔗 Link en nuestra bio para seguir la previa y transmisión completa.\n\n#${branding.channelName.replace(/\s+/g, '')} #FutbolBolivia #Matchday`,
      hashtags: ['#Matchday', '#FutbolSudamericano', '#PasionFutbolera', '#InstaFutbol', '#Bolivia']
    },
    twitter: {
      tweet: `⚽ ¡HOY SE JUEGA! ${homeClub.name} vs ${awayClub.name} por la fecha de ${competition.name}.\n\n🕒 ${data.singleMatch.matchTime || '20:00 BOT'} | 📍 ${data.singleMatch.stadium || 'Estadio'}\n🔴 En vivo con relatos y estadísticas al instante por @${branding.channelName.replace(/\s+/g, '')}.\n\n¿Quién gana? RT o FAV 🔥`,
      hashtags: ['#FutbolBoliviano', '#EnVivo', '#Clasico']
    },
    youtube: {
      title: `🔴 EN VIVO: ${homeClub.name} vs ${awayClub.name} | ${competition.name} | Relatos y Reacciones`,
      description: `Transmisión en directo del choque entre ${homeClub.name} y ${awayClub.name} por ${competition.name}.\n\n📅 Fecha: ${data.dateRange} | Hora: ${data.singleMatch.matchTime || '20:00 BOT'}\n🏟️ Sede: ${data.singleMatch.stadium}\n\n⚽ Disfruta de la mejor cobertura con estadísticas, análisis jugada a jugada y relatos con ${branding.channelName}.\n\n🔔 ¡Suscríbete y activa la campana para apoyar nuestras transmisiones!`,
      tags: [homeClub.name, awayClub.name, competition.name, 'Futbol Boliviano en vivo', branding.channelName, 'Goles y resumen']
    }
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      let details = '';
      if (data.type === 'versus') {
        details = `${data.singleMatch.matchTime || '20:00 BOT'} en ${data.singleMatch.stadium || 'Estadio'}. Árbitro: ${data.singleMatch.referee}`;
      } else if (data.type === 'goal') {
        details = `Goleador: ${data.goal.playerName} al minuto ${data.goal.minute}. Marcador: ${data.goal.homeScore}-${data.goal.awayScore}`;
      } else if (data.type === 'result') {
        details = `Marcador final: ${data.singleMatch.homeScore} - ${data.singleMatch.awayScore}`;
      } else if (data.type === 'lineup') {
        details = `Alineación de ${getClubById(data.lineup.clubId).name} con DT ${data.lineup.coach} y formación ${data.lineup.formation}`;
      } else if (data.type === 'fixture') {
        details = `Cartelera completa de la fecha: ${data.roundTitle} - ${data.dateRange}`;
      }

      const res = await fetch('/api/ai/generate-social-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: data.type,
          tournament: competition.name,
          homeClub: homeClub.name,
          awayClub: awayClub.name,
          details,
          channelName: branding.channelName,
          tone
        })
      });

      if (res.ok) {
        const result = await res.json();
        setCaptions(result);
      }
    } catch (e) {
      console.error('Error generating AI captions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Get current active network data
  const currentNetworkData = captions[selectedNetwork];
  let formattedFullText = '';

  if (selectedNetwork === 'tiktok') {
    formattedFullText = `${captions.tiktok.caption}\n\n${captions.tiktok.hashtags.join(' ')}`;
  } else if (selectedNetwork === 'facebook') {
    formattedFullText = `${captions.facebook.postText}\n\n${captions.facebook.callToAction}\n\n${captions.facebook.hashtags.join(' ')}`;
  } else if (selectedNetwork === 'instagram') {
    formattedFullText = `${captions.instagram.caption}\n\n${captions.instagram.hashtags.join(' ')}`;
  } else if (selectedNetwork === 'twitter') {
    formattedFullText = `${captions.twitter.tweet} ${captions.twitter.hashtags.join(' ')}`;
  } else if (selectedNetwork === 'youtube') {
    formattedFullText = `${captions.youtube.title}\n\n${captions.youtube.description}\n\nEtiquetas: ${captions.youtube.tags.join(', ')}`;
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner / Generator Action Bar */}
      <div className="p-3.5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/40 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block font-montserrat">
                Descripciones con IA para Redes
              </span>
              <span className="text-[10px] text-slate-400">
                Textos y hashtags diferentes adaptados a cada plataforma
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Redactando...' : 'Generar Todo'}</span>
          </button>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Tono:</span>
          {(['emocionante', 'periodistico', 'polemico', 'urgente'] as const).map(t => {
            const isSel = tone === t;
            return (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] capitalize transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  isSel
                    ? 'bg-purple-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'emocionante' && <Flame className="w-3 h-3 text-amber-400" />}
                {t === 'periodistico' && <Newspaper className="w-3 h-3 text-cyan-400" />}
                {t === 'polemico' && <AlertTriangle className="w-3 h-3 text-yellow-400" />}
                {t === 'urgente' && <Zap className="w-3 h-3 text-red-400" />}
                <span>{t}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network Switcher Pills */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
        {(['tiktok', 'facebook', 'instagram', 'twitter', 'youtube'] as const).map(net => {
          const isAct = selectedNetwork === net;
          return (
            <button
              key={net}
              onClick={() => setSelectedNetwork(net)}
              className={`py-1.5 px-1 rounded-lg font-bold text-[11px] capitalize transition-all cursor-pointer text-center ${
                isAct
                  ? net === 'tiktok'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : net === 'facebook'
                    ? 'bg-blue-600 text-white font-black'
                    : net === 'instagram'
                    ? 'bg-pink-600 text-white font-black'
                    : net === 'twitter'
                    ? 'bg-slate-700 text-white font-black'
                    : 'bg-red-600 text-white font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {net === 'twitter' ? 'X / Twitter' : net}
            </button>
          );
        })}
      </div>

      {/* Selected Network Editor Card */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white capitalize font-montserrat">
              Texto para {selectedNetwork === 'twitter' ? 'X (Twitter)' : selectedNetwork}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ({formattedFullText.length} caracteres)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCopy(formattedFullText, selectedNetwork)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
            >
              {copiedKey === selectedNetwork ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {onOpenPublisherWithText && (
              <button
                onClick={() => onOpenPublisherWithText(selectedNetwork, formattedFullText)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
                title="Llevar este texto al panel de publicación directa"
              >
                <Send className="w-3 h-3" />
                <span>Publicar</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area for Direct Editing */}
        {selectedNetwork === 'tiktok' && (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={captions.tiktok.caption}
              onChange={(e) => setCaptions(prev => ({
                ...prev,
                tiktok: { ...prev.tiktok, caption: e.target.value }
              }))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-cyan-400 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1">
              {captions.tiktok.hashtags.map(h => (
                <span key={h} className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedNetwork === 'facebook' && (
          <div className="space-y-2">
            <textarea
              rows={6}
              value={captions.facebook.postText}
              onChange={(e) => setCaptions(prev => ({
                ...prev,
                facebook: { ...prev.facebook, postText: e.target.value }
              }))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-blue-400 focus:outline-none"
            />
            <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300 text-[11px]">
              <strong>Llamado a la acción:</strong> {captions.facebook.callToAction}
            </div>
            <div className="flex flex-wrap gap-1">
              {captions.facebook.hashtags.map(h => (
                <span key={h} className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedNetwork === 'instagram' && (
          <div className="space-y-2">
            <textarea
              rows={5}
              value={captions.instagram.caption}
              onChange={(e) => setCaptions(prev => ({
                ...prev,
                instagram: { ...prev.instagram, caption: e.target.value }
              }))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-pink-400 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1">
              {captions.instagram.hashtags.map(h => (
                <span key={h} className="px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 text-[10px] font-mono">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedNetwork === 'twitter' && (
          <div className="space-y-2">
            <textarea
              rows={4}
              maxLength={280}
              value={captions.twitter.tweet}
              onChange={(e) => setCaptions(prev => ({
                ...prev,
                twitter: { ...prev.twitter, tweet: e.target.value }
              }))}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-slate-400 focus:outline-none"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Límite Twitter (280 chars)</span>
              <span className={captions.twitter.tweet.length > 260 ? 'text-yellow-400 font-bold' : ''}>
                {captions.twitter.tweet.length} / 280
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {captions.twitter.hashtags.map(h => (
                <span key={h} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedNetwork === 'youtube' && (
          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Título de la transmisión / video:</span>
              <input
                type="text"
                value={captions.youtube.title}
                onChange={(e) => setCaptions(prev => ({
                  ...prev,
                  youtube: { ...prev.youtube, title: e.target.value }
                }))}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Descripción de YouTube:</span>
              <textarea
                rows={5}
                value={captions.youtube.description}
                onChange={(e) => setCaptions(prev => ({
                  ...prev,
                  youtube: { ...prev.youtube, description: e.target.value }
                }))}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium text-xs focus:border-red-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {captions.youtube.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
