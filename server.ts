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

// API: Simulated Multi-Channel Publishing & Scheduling
app.post('/api/social/publish', (req, res) => {
  const { channels = [], caption = '', scheduledFor, title = 'Publicación de Fútbol' } = req.body;
  const isScheduled = !!scheduledFor;
  const postId = `pub-${Date.now()}`;

  const results = channels.map((channel: string) => {
    // Generate realistic live URL per network
    let postUrl = '';
    const cleanChan = channel.toLowerCase();
    if (cleanChan.includes('facebook')) {
      postUrl = `https://www.facebook.com/posts/${Date.now().toString().slice(-8)}`;
    } else if (cleanChan.includes('tiktok')) {
      postUrl = `https://www.tiktok.com/@sports/video/${Date.now()}`;
    } else if (cleanChan.includes('instagram')) {
      postUrl = `https://www.instagram.com/p/C${Date.now().toString(36).toUpperCase()}/`;
    } else if (cleanChan.includes('youtube')) {
      postUrl = `https://www.youtube.com/post/Ugk${Date.now().toString(36)}`;
    } else {
      postUrl = `https://x.com/sports_bo/status/${Date.now()}`;
    }

    return {
      channel,
      status: isScheduled ? 'scheduled' : 'published',
      publishedAt: isScheduled ? scheduledFor : new Date().toISOString(),
      postUrl,
      id: `${postId}-${cleanChan}`
    };
  });

  return res.json({
    success: true,
    postId,
    status: isScheduled ? 'scheduled' : 'published',
    results
  });
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
