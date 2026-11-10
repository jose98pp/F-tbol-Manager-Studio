import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Cache in memory for fast repeat proxy requests and avoid rate limits
const imageProxyCache = new Map<string, { buffer: Buffer; contentType: string }>();

// Proxy internet images to bypass CORS during canvas high-res export
app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).send('Missing url parameter');
  }

  // Check cache first
  const cached = imageProxyCache.get(imageUrl);
  if (cached) {
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(cached.buffer);
  }

  try {
    let targetUrl = imageUrl;
    const fetchHeaders = {
      'User-Agent': 'SoccerStudioGraphics/1.0 (https://ais-studio.app; contact@soccerstudio.com)'
    };

    let fetchResponse = await fetch(targetUrl, {
      headers: fetchHeaders
    });

    // If wikimedia thumb returned 403 or error, try direct original file
    if (!fetchResponse.ok && targetUrl.includes('upload.wikimedia.org/wikipedia/commons/thumb/')) {
      const directUrl = targetUrl.replace(/\/thumb(\/.*)\/[^/]+$/, '$1');
      const retryResponse = await fetch(directUrl, {
        headers: fetchHeaders
      });
      if (retryResponse.ok) {
        fetchResponse = retryResponse;
        targetUrl = directUrl;
      }
    }

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).send('Failed to fetch image');
    }

    const contentType = fetchResponse.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await fetchResponse.arrayBuffer());

    // Store in cache
    if (imageProxyCache.size > 200) {
      const firstKey = imageProxyCache.keys().next().value;
      if (firstKey) imageProxyCache.delete(firstKey);
    }
    imageProxyCache.set(imageUrl, { buffer, contentType });

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (err: any) {
    console.error('Error proxying image:', err);
    res.status(500).send('Proxy error');
  }
});

// Search real club shields on the internet via Wikimedia Commons
app.get('/api/search-escudos', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  try {
    const searchQuery = `${query} football club logo escudo filetype:bitmap|drawing`;
    const wikimediaUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      searchQuery
    )}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|mime&iiurlwidth=320&format=json`;

    const response = await fetch(wikimediaUrl, {
      headers: {
        'User-Agent': 'FutbolBannerStudio/1.0 (https://ais-build; contact@sports.app)'
      }
    });

    if (!response.ok) {
      return res.json({ results: [] });
    }

    const data = await response.json();
    const pages = data?.query?.pages || {};

    const results = Object.values(pages)
      .map((p: any) => {
        const info = p.imageinfo?.[0];
        if (!info || !info.url) return null;

        const title = p.title.replace(/^File:/i, '').replace(/\.(png|svg|jpg|jpeg|webp)$/i, '');
        // Clean title for display
        const cleanName = title.replace(/_/g, ' ');

        return {
          id: `wiki-${p.pageid}`,
          title: cleanName,
          name: cleanName,
          url: info.thumburl || info.url,
          fullUrl: info.url,
          mime: info.mime,
          source: 'Wikimedia Commons'
        };
      })
      .filter(Boolean);

    res.json({ results });
  } catch (error: any) {
    console.error('Error searching escudos:', error);
    res.status(500).json({ error: 'Search failed', results: [] });
  }
});

// API: Simulate match result & real-time statistics
app.post('/api/ai/simulate-match', async (req, res) => {
  try {
    const { homeClubName, awayClubName, tournament } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        homeScore: Math.floor(Math.random() * 4),
        awayScore: Math.floor(Math.random() * 3),
        scorers: [
          { team: 'home', player: 'Delantero Estrella', minute: '28\'' },
          { team: 'away', player: 'Goleador Rival', minute: '64\'' }
        ],
        stats: {
          possessionHome: 54,
          possessionAway: 46,
          shotsHome: 13,
          shotsAway: 8,
          shotsOnTargetHome: 6,
          shotsOnTargetAway: 4,
          cornersHome: 5,
          cornersAway: 3,
          foulsHome: 14,
          foulsAway: 15,
          yellowCardsHome: 2,
          yellowCardsAway: 3,
          redCardsHome: 0,
          redCardsAway: 0
        },
        summary: `Gran encuentro entre ${homeClubName} y ${awayClubName}.`
      });
    }

    const prompt = `Simula un resultado deportivo realista y emocionante de fútbol para el partido entre ${homeClubName || 'Equipo Local'} vs ${awayClubName || 'Equipo Visitante'} en el torneo ${tournament || 'Liga'}.
    Genera el marcador final, lista de autores de goles (jugadores reales o representativos con minuto), y estadísticas detalladas del partido (posesión que sume 100, tiros totales, tiros al arco, corners, faltas y tarjetas).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            homeScore: { type: Type.INTEGER },
            awayScore: { type: Type.INTEGER },
            scorers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  team: { type: Type.STRING, description: "'home' or 'away'" },
                  player: { type: Type.STRING },
                  minute: { type: Type.STRING, description: "e.g. 34'" }
                },
                required: ['team', 'player', 'minute']
              }
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                possessionHome: { type: Type.INTEGER },
                possessionAway: { type: Type.INTEGER },
                shotsHome: { type: Type.INTEGER },
                shotsAway: { type: Type.INTEGER },
                shotsOnTargetHome: { type: Type.INTEGER },
                shotsOnTargetAway: { type: Type.INTEGER },
                cornersHome: { type: Type.INTEGER },
                cornersAway: { type: Type.INTEGER },
                foulsHome: { type: Type.INTEGER },
                foulsAway: { type: Type.INTEGER },
                yellowCardsHome: { type: Type.INTEGER },
                yellowCardsAway: { type: Type.INTEGER },
                redCardsHome: { type: Type.INTEGER },
                redCardsAway: { type: Type.INTEGER }
              },
              required: ['possessionHome', 'possessionAway', 'shotsHome', 'shotsAway', 'shotsOnTargetHome', 'shotsOnTargetAway']
            },
            summary: { type: Type.STRING }
          },
          required: ['homeScore', 'awayScore', 'scorers', 'stats', 'summary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error simulating match:', error);
    return res.status(200).json({
      fallback: true,
      homeScore: 2,
      awayScore: 1,
      scorers: [
        { team: 'home', player: 'Jugador 10', minute: '19\'' },
        { team: 'away', player: 'Delantero', minute: '52\'' },
        { team: 'home', player: 'Capitán', minute: '83\'' }
      ],
      stats: {
        possessionHome: 52,
        possessionAway: 48,
        shotsHome: 12,
        shotsAway: 10,
        shotsOnTargetHome: 5,
        shotsOnTargetAway: 4,
        cornersHome: 6,
        cornersAway: 4,
        foulsHome: 11,
        foulsAway: 14,
        yellowCardsHome: 2,
        yellowCardsAway: 3,
        redCardsHome: 0,
        redCardsAway: 0
      },
      summary: 'Partido parejo con intensidad hasta el último minuto.'
    });
  }
});

// API: Generate social media advertising copy & hype phrases
app.post('/api/ai/social-hype', async (req, res) => {
  try {
    const { tournament, matchOrFixture, channelName } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        headline: '¡VÍVELO EN VIVO!',
        subheadline: `TRANSMISIÓN EXCLUSIVA POR ${channelName || 'NUESTRO CANAL'}`,
        tiktokCaption: '🔥 ¡No te pierdas este partidazo! Síguenos para el minuto a minuto en directo ⚽🔴',
        facebookText: '📅 ¡La pasión del fútbol se vive aquí! Horarios y programación completa.'
      });
    }

    const prompt = `Genera textos publicitarios cortos, llamativos y con gancho para redes sociales (TikTok y Facebook) para promocionar una transmisión de fútbol del canal de YouTube "${channelName || 'JoseCPP98'}" del torneo "${tournament || 'Copa Paceña'}". Información del partido/fecha: "${matchOrFixture}".
    Devuelve un titular impactante (máx 5 palabras), un subtitular (máx 8 palabras), y captions para TikTok y Facebook con emojis de fútbol y hype.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            tiktokCaption: { type: Type.STRING },
            facebookText: { type: Type.STRING }
          },
          required: ['headline', 'subheadline', 'tiktokCaption', 'facebookText']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error generating social hype:', error);
    return res.json({
      headline: '¡PARTIDO IMPERDIBLE!',
      subheadline: 'TRANSMISIÓN EN VIVO Y EN DIRECTO',
      tiktokCaption: '⚽🔥 ¿Quién gana hoy? ¡Déjalo en los comentarios y activa la campanita! #Futbol #EnVivo',
      facebookText: 'Sigue la transmisión en vivo con relatos y análisis en tiempo real.'
    });
  }
});

// API: Detailed Multi-Network AI Captions & Hashtag Generator
app.post('/api/ai/generate-social-captions', async (req, res) => {
  try {
    const {
      templateType = 'versus',
      tournament = 'Copa Paceña',
      homeClub = 'Bolívar',
      awayClub = 'The Strongest',
      details = '',
      channelName = 'JoseCPP98',
      tone = 'emocionante'
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // High-quality smart fallbacks per network
      const matchLabel = `${homeClub} vs ${awayClub}`;
      return res.json({
        tiktok: {
          caption: `🔥 ¡Se viene el choque del año! ${matchLabel} por ${tournament}. ¿Quién se lleva los 3 puntos? Déjalo en comentarios y apoya a tu equipo. ¡Transmisión en directo por ${channelName}! ⚽🏆`,
          hashtags: ['#FutbolBoliviano', '#CopaPaceña', '#Clásico', '#LigaTecno', '#ParaTi', '#Futbol']
        },
        facebook: {
          postText: `🚨 ¡ATENCIÓN HINCHADA! Se juega una nueva fecha crucial de ${tournament}.\n\n⚔️ ${matchLabel}\n${details ? `📌 ${details}\n` : ''}🎙️ Relato y comentarios exclusivos con todo el análisis en vivo a través de ${channelName}.\n\n¿Cuál es tu pronóstico para hoy? ¿Gana el local o la visita? Te leemos en la caja de comentarios 👇🔥`,
          callToAction: '¡Sigue la página y activa las notificaciones para no perderte el arranque!',
          hashtags: ['#FutbolBoliviano', '#EnVivo', '#TransmisionDeportiva', '#CopaPacena']
        },
        instagram: {
          caption: `⚡ DÍA DE PARTIDO | ${matchLabel} ⚡\n\nTodo listo para una jornada inolvidable de ${tournament}. La pasión no se detiene y tú puedes seguir cada jugada minuto a minuto con nosotros.\n\n🔗 Link en nuestra bio para la transmisión completa.\n\n#${channelName.replace(/\s+/g, '')} #FutbolBolivia #Matchday`,
          hashtags: ['#Matchday', '#FutbolSudamericano', '#PasionFutbolera', '#InstaFutbol']
        },
        twitter: {
          tweet: `⚽ ¡HOY SE JUEGA! ${matchLabel} por la fecha de ${tournament}.\n\n${details ? `🕒 ${details}\n` : ''}🔴 En vivo con relatos y estadísticas al instante por @${channelName.replace(/\s+/g, '')}.\n\n¿Quién gana? RT o FAV 🔥`,
          hashtags: ['#FutbolBoliviano', '#Clasico', '#EnVivo']
        },
        youtube: {
          title: `🔴 EN VIVO: ${matchLabel} | ${tournament} | Relatos y Reacciones`,
          description: `Transmisión en directo del encuentro entre ${matchLabel} por ${tournament}.\n\n${details ? `Información del encuentro: ${details}\n\n` : ''}⚽ Sigue todas las incidencias, análisis táctico y estadísticas en tiempo real con ${channelName}.\n\n🔔 Suscríbete y activa la campanita para todas las fechas del fútbol boliviano e internacional.`,
          tags: [homeClub, awayClub, tournament, 'Futbol Boliviano en vivo', channelName, 'Resumen y goles']
        }
      });
    }

    const prompt = `Eres el community manager y periodista deportivo jefe de "${channelName}". Genera textos de publicación y hashtags optimizados para CADA una de las siguientes redes sociales: TikTok, Facebook, Instagram, X (Twitter) y YouTube.

Contexto del contenido:
- Tipo de banner: ${templateType}
- Torneo / Competición: ${tournament}
- Equipos / Protagonistas: ${homeClub} vs ${awayClub}
- Detalles adicionales (fecha, hora, marcador o goleador): ${details}
- Tono deseado: ${tone} (ej. emocionante, periodístico, polémico, o urgente)

Reglas por red:
1. TikTok: Con gancho en las primeras palabras, dinámico, emojis deportivos, pregunta para generar comentarios y hashtags virales de TikTok.
2. Facebook: Post narrativo más extenso, llamado a la comunidad, invitación a pronosticar y dejar comentarios, llamado a la acción claro.
3. Instagram: Estética cuidada, saltos de línea limpios, llamada al "link en bio" y bloque de hashtags estéticos.
4. Twitter (X): Máximo 250 caracteres, directo, emojis, mención a interactuar con RT/FAV.
5. YouTube: Título llamativo con emojis y mayúsculas clave, descripción con timestamps o detalles, y lista de tags de búsqueda de YouTube.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tiktok: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['caption', 'hashtags']
            },
            facebook: {
              type: Type.OBJECT,
              properties: {
                postText: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['postText', 'callToAction', 'hashtags']
            },
            instagram: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['caption', 'hashtags']
            },
            twitter: {
              type: Type.OBJECT,
              properties: {
                tweet: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['tweet', 'hashtags']
            },
            youtube: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['title', 'description', 'tags']
            }
          },
          required: ['tiktok', 'facebook', 'instagram', 'twitter', 'youtube']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating social captions:', error);
    return res.status(500).json({ error: 'Failed to generate captions' });
  }
});

// API: ESPN Soccer Leagues Catalog
const ESPN_SOCCER_LEAGUES = [
  // Bolivia & CONMEBOL
  { id: 'bol.1', name: 'Liga Boliviana (División Profesional)', country: 'Bolivia', region: 'Sudamérica', priority: 1 },
  { id: 'conmebol.libertadores', name: 'CONMEBOL Copa Libertadores', country: 'Sudamérica', region: 'Sudamérica', priority: 2 },
  { id: 'conmebol.sudamericana', name: 'CONMEBOL Copa Sudamericana', country: 'Sudamérica', region: 'Sudamérica', priority: 3 },
  { id: 'fifa.worldq.conmebol', name: 'Eliminatorias Sudamericanas (CONMEBOL)', country: 'Sudamérica', region: 'Selecciones', priority: 4 },
  { id: 'arg.1', name: 'Liga Profesional Argentina', country: 'Argentina', region: 'Sudamérica', priority: 5 },
  { id: 'bra.1', name: 'Brasileirão Série A', country: 'Brasil', region: 'Sudamérica', priority: 6 },
  { id: 'col.1', name: 'Liga BetPlay Dimayor', country: 'Colombia', region: 'Sudamérica', priority: 7 },
  { id: 'chi.1', name: 'Primera División de Chile', country: 'Chile', region: 'Sudamérica', priority: 8 },
  { id: 'per.1', name: 'Liga 1 Perú', country: 'Perú', region: 'Sudamérica', priority: 9 },

  // Europa & Internacional
  { id: 'uefa.champions', name: 'UEFA Champions League', country: 'Europa', region: 'Europa', priority: 10 },
  { id: 'uefa.europa', name: 'UEFA Europa League', country: 'Europa', region: 'Europa', priority: 11 },
  { id: 'esp.1', name: 'LaLiga (España)', country: 'España', region: 'Europa', priority: 12 },
  { id: 'eng.1', name: 'Premier League (Inglaterra)', country: 'Inglaterra', region: 'Europa', priority: 13 },
  { id: 'ita.1', name: 'Serie A (Italia)', country: 'Italia', region: 'Europa', priority: 14 },
  { id: 'ger.1', name: 'Bundesliga (Alemania)', country: 'Alemania', region: 'Europa', priority: 15 },
  { id: 'fra.1', name: 'Ligue 1 (Francia)', country: 'Francia', region: 'Europa', priority: 16 },

  // Norteamérica & Otras
  { id: 'mex.1', name: 'Liga MX (México)', country: 'México', region: 'Concacaf', priority: 17 },
  { id: 'usa.1', name: 'Major League Soccer (MLS)', country: 'EE.UU.', region: 'Concacaf', priority: 18 },
  { id: 'concacaf.champions', name: 'Concacaf Champions Cup', country: 'Norteamérica', region: 'Concacaf', priority: 19 },
  { id: 'fifa.world', name: 'Copa Mundial FIFA', country: 'Mundial', region: 'Selecciones', priority: 20 },
  { id: 'conmebol.america', name: 'Copa América', country: 'América', region: 'Selecciones', priority: 21 },
  { id: 'uefa.euro', name: 'Eurocopa UEFA', country: 'Europa', region: 'Selecciones', priority: 22 }
];

app.get('/api/espn/leagues', (_req, res) => {
  return res.json(ESPN_SOCCER_LEAGUES);
});

// Cache for ESPN scoreboard responses: key -> { timestamp: number, data: any }
const espnCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 45 * 1000; // 45 seconds cache

app.get('/api/espn/scoreboard', async (req, res) => {
  try {
    const league = (req.query.league as string) || 'bol.1';
    const dateParam = (req.query.date as string) || ''; // format YYYYMMDD or YYYY-MM-DD
    const cleanDate = dateParam.replace(/-/g, '');

    const cacheKey = `${league}_${cleanDate}`;
    const cached = espnCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    let url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(league)}/scoreboard`;
    if (cleanDate) {
      url += `?dates=${encodeURIComponent(cleanDate)}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const espnRes = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);

    if (!espnRes.ok) {
      return res.status(espnRes.status).json({
        error: `ESPN API returned status ${espnRes.status}`,
        league,
        events: []
      });
    }

    const raw = await espnRes.json();
    const leagueInfo = raw.leagues?.[0] || {};
    const leagueLogo = leagueInfo.logos?.[0]?.href || '';

    const events = (raw.events || []).map((ev: any) => {
      const competition = ev.competitions?.[0] || {};
      const competitors = competition.competitors || [];
      const homeComp = competitors.find((c: any) => c.homeAway === 'home') || competitors[0] || {};
      const awayComp = competitors.find((c: any) => c.homeAway === 'away') || competitors[1] || {};

      const homeTeam = homeComp.team || {};
      const awayTeam = awayComp.team || {};

      // Convert match date to Bolivia BOT time representation
      const matchDate = new Date(ev.date || competition.date || Date.now());
      const boliviaTimeStr = matchDate.toLocaleTimeString('es-BO', {
        timeZone: 'America/La_Paz',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + ' BOT';

      const boliviaDateStr = matchDate.toLocaleDateString('es-BO', {
        timeZone: 'America/La_Paz',
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      }).toUpperCase();

      const statusType = competition.status?.type || {};
      const isLive = statusType.state === 'in';
      const isCompleted = statusType.completed === true || statusType.state === 'post';

      return {
        id: ev.id,
        name: ev.name || `${homeTeam.displayName || 'Local'} vs ${awayTeam.displayName || 'Visita'}`,
        shortName: ev.shortName || `${homeTeam.abbreviation || 'LOC'} vs ${awayTeam.abbreviation || 'VIS'}`,
        rawDate: ev.date,
        date: ev.date,
        boliviaDateStr,
        boliviaTimeStr,
        dateBolivia: `${boliviaDateStr}, ${boliviaTimeStr}`,
        timeBolivia: boliviaTimeStr,
        venue: {
          name: competition.venue?.fullName || 'Por confirmar',
          city: competition.venue?.address?.city || ''
        },
        venueCity: competition.venue?.address?.city || '',
        status: {
          state: statusType.state || 'pre', // 'pre', 'in', 'post'
          detail: statusType.detail || boliviaTimeStr,
          shortDetail: statusType.shortDetail || boliviaTimeStr,
          clock: competition.status?.displayClock || '',
          isLive,
          isCompleted
        },
        homeTeam: {
          id: homeTeam.id || `team-home-${ev.id}`,
          name: homeTeam.name || homeTeam.displayName || 'Equipo Local',
          displayName: homeTeam.displayName || homeTeam.name || 'Equipo Local',
          shortName: homeTeam.shortDisplayName || homeTeam.name || 'Local',
          abbreviation: homeTeam.abbreviation || 'LOC',
          logo: homeTeam.logo || (homeTeam.id ? `https://a.espncdn.com/i/teamlogos/soccer/500/${homeTeam.id}.png` : ''),
          score: homeComp.score !== undefined ? parseInt(homeComp.score, 10) : undefined,
          color: homeTeam.color ? `${homeTeam.color}`.replace('#', '') : undefined
        },
        awayTeam: {
          id: awayTeam.id || `team-away-${ev.id}`,
          name: awayTeam.name || awayTeam.displayName || 'Equipo Visitante',
          displayName: awayTeam.displayName || awayTeam.name || 'Equipo Visitante',
          shortName: awayTeam.shortDisplayName || awayTeam.name || 'Visita',
          abbreviation: awayTeam.abbreviation || 'VIS',
          logo: awayTeam.logo || (awayTeam.id ? `https://a.espncdn.com/i/teamlogos/soccer/500/${awayTeam.id}.png` : ''),
          score: awayComp.score !== undefined ? parseInt(awayComp.score, 10) : undefined,
          color: awayTeam.color ? `${awayTeam.color}`.replace('#', '') : undefined
        },
        league: {
          id: leagueInfo.id || league,
          name: leagueInfo.name || league,
          slug: leagueInfo.slug || league,
          logo: leagueLogo
        }
      };
    });

    const payload = {
      league: {
        id: leagueInfo.id || league,
        name: leagueInfo.name || league,
        slug: leagueInfo.slug || league,
        logo: leagueLogo,
        season: leagueInfo.season?.displayName || ''
      },
      count: events.length,
      events
    };

    espnCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    return res.json(payload);
  } catch (error: any) {
    console.error('Error fetching ESPN scoreboard:', error);
    return res.status(500).json({ error: 'Failed to fetch ESPN match data', events: [] });
  }
});


/**
 * ESPN match summary and official team rosters.
 * ESPN does not expose lineups for every competition/event; return an explicit
 * availability flag rather than inventing player data.
 */
const espnSummaryCache = new Map<string, { timestamp: number; data: any }>();

app.get('/api/espn/summary', async (req, res) => {
  try {
    const league = String(req.query.league || 'bol.1').trim();
    const eventId = String(req.query.event || '').trim();
    if (!/^[a-zA-Z0-9_-]{1,32}$/.test(eventId)) {
      return res.status(400).json({ error: 'Identificador de partido no válido.' });
    }
    if (!/^[a-zA-Z0-9._-]{1,80}$/.test(league)) {
      return res.status(400).json({ error: 'Liga ESPN no válida.' });
    }

    const cacheKey = `${league}_${eventId}`;
    const cached = espnSummaryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 60_000) return res.json(cached.data);

    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(league)}/summary?event=${encodeURIComponent(eventId)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    let espnRes: Response;
    try {
      espnRes = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    } finally {
      clearTimeout(timeout);
    }
    if (!espnRes.ok) {
      return res.status(espnRes.status).json({ error: `ESPN summary respondió ${espnRes.status}` });
    }

    const raw: any = await espnRes.json();
    const competitors = raw.header?.competitions?.[0]?.competitors || raw.boxscore?.teams || [];
    const rosterGroups: any[] = Array.isArray(raw.rosters) ? raw.rosters
      : Array.isArray(raw.boxscore?.players) ? raw.boxscore.players
      : Array.isArray(raw.roster) ? raw.roster : [];

    const positionCode = (value: any): 'POR' | 'DEF' | 'MED' | 'DEL' => {
      const p = String(value?.abbreviation || value?.displayName || value?.name || value || '').toLowerCase();
      if (/goal|keeper|gk|por/.test(p)) return 'POR';
      if (/back|defen|centre.?back|full.?back|cb|lb|rb/.test(p)) return 'DEF';
      if (/mid|wing|attacking|central|defensive.?mid|cm|dm|am/.test(p)) return 'MED';
      return 'DEL';
    };

    const teams = competitors.map((competitor: any) => {
      const team = competitor.team || competitor;
      const group = rosterGroups.find((entry: any) => String(entry.team?.id || entry.teamId || entry.id || '') === String(team.id));
      const groupedAthletes = Array.isArray(group?.statistics)
        ? group.statistics.flatMap((stat: any) => Array.isArray(stat.athletes) ? stat.athletes : [])
        : [];
      const nestedPlayers = Array.isArray(group?.players)
        ? group.players.flatMap((entry: any) => Array.isArray(entry.athletes) ? entry.athletes : [entry])
        : [];
      const rawPlayers = group?.roster || group?.athletes || competitor.roster || (nestedPlayers.length ? nestedPlayers : groupedAthletes);
      const players = (Array.isArray(rawPlayers) ? rawPlayers : []).map((entry: any, index: number) => {
        const athlete = entry.athlete || entry.player || entry;
        const position = athlete.position || entry.position;
        const starter = entry.starter === true || entry.isStarter === true || athlete.starter === true
          || entry.status?.type?.name === 'Starter' || entry.status?.name === 'Starter';
        return {
          id: String(athlete.id || `${team.id || 'team'}-${index}`),
          name: athlete.displayName || athlete.fullName || athlete.name || '',
          number: Number(athlete.jersey || athlete.uniformNumber || entry.jersey || 0),
          position: positionCode(position),
          photoUrl: athlete.headshot?.href || athlete.photo || athlete.href || undefined,
          starter
        };
      }).filter((player: any) => player.name);

      return {
        teamId: String(team.id || ''),
        teamName: team.displayName || team.name || 'Equipo',
        logo: team.logo || '',
        formation: group?.formation || competitor.formation || null,
        coach: group?.coach?.displayName || competitor.coach?.displayName || '',
        starters: players.filter((player: any) => player.starter).map(({ starter, ...player }: any) => player).slice(0, 11),
        substitutes: players.filter((player: any) => !player.starter).map(({ starter, ...player }: any) => player).slice(0, 18),
        rosterCount: players.length
      };
    });

    const payload = {
      eventId,
      available: teams.some((team: any) => team.starters.length > 0 || team.substitutes.length > 0),
      teams,
      source: 'ESPN',
      updatedAt: new Date().toISOString()
    };
    espnSummaryCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    return res.json(payload);
  } catch (error: any) {
    console.error('Error fetching ESPN match summary:', error);
    return res.status(500).json({ error: 'No se pudo consultar el resumen y las alineaciones de ESPN.' });
  }
});

// Serve frontend with Vite in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
