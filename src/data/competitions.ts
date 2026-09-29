export interface Competition {
  id: string;
  name: string;
  shortName: string;
  category: 'bolivia' | 'conmebol' | 'uefa' | 'fifa';
  primaryColor: string;
  accentColor: string;
  sponsorText: string;
  badgeSvg: string;
  badgeUrl?: string;
  headerTheme: 'copa-pacena' | 'libertadores' | 'sudamericana' | 'champions' | 'premier' | 'fifa' | 'default';
}

export const COMPETITIONS: Competition[] = [
  {
    id: 'copa-pacena',
    name: 'Copa Paceña',
    shortName: 'COPA PACEÑA',
    category: 'bolivia',
    primaryColor: '#dc2626',
    accentColor: '#facc15',
    sponsorText: 'entel | Paceña',
    headerTheme: 'copa-pacena',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Silver Trophy Handles and Cup -->
      <path d="M50 25 C45 35 45 65 60 75 L70 82 L70 95 L60 98 L60 102 L100 102 L100 98 L90 95 L90 82 L100 75 C115 65 115 35 110 25 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <path d="M46 32 C32 40 32 60 55 64" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M114 32 C128 40 128 60 105 64" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- COPA header text -->
      <text x="80" y="44" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="11" letter-spacing="2">COPA</text>
      <!-- PACEÑA Red Ribbon -->
      <rect x="25" y="52" width="110" height="26" rx="4" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <text x="80" y="70" text-anchor="middle" fill="#ffffff" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="18" letter-spacing="1">PACEÑA</text>
      <!-- Stars below -->
      <text x="80" y="90" text-anchor="middle" fill="#facc15" font-size="11">★ ★ ★</text>
    </svg>`
  },
  {
    id: 'liga-boliviana',
    name: 'Liga Tecno Boliviana',
    shortName: 'LIGA TECNO',
    category: 'bolivia',
    primaryColor: '#0284c7',
    accentColor: '#22c55e',
    sponsorText: 'Tigo Sports | División Profesional',
    headerTheme: 'default',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="div_bg" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0284c7" />
          <stop offset="1" stop-color="#0369a1" />
        </linearGradient>
      </defs>
      <!-- Shield Shape -->
      <path d="M80 10 L135 25 L135 70 C135 95 80 115 80 115 C80 115 25 95 25 70 L25 25 Z" fill="url(#div_bg)" stroke="#38bdf8" stroke-width="3"/>
      <!-- Tricolor Bolivia Ribbon -->
      <polygon points="27,27 133,27 133,33 27,33" fill="#ef4444" />
      <polygon points="27,33 133,33 133,39 27,39" fill="#eab308" />
      <polygon points="27,39 133,39 133,45 27,45" fill="#22c55e" />
      <circle cx="80" cy="68" r="16" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
      <!-- Ball icon -->
      <polygon points="80,60 87,65 84,74 76,74 73,65" fill="#0369a1" />
      <text x="80" y="98" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">DIVISIÓN PROFESIONAL</text>
    </svg>`
  },
  {
    id: 'copa-libertadores',
    name: 'CONMEBOL Libertadores',
    shortName: 'LIBERTADORES',
    category: 'conmebol',
    primaryColor: '#eab308',
    accentColor: '#ca8a04',
    sponsorText: 'CONMEBOL | La Gloria Eterna',
    headerTheme: 'libertadores',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gold_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </radialGradient>
      </defs>
      <!-- Elegant Round Golden Crest -->
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#gold_glow)" stroke-width="4"/>
      <circle cx="80" cy="60" r="42" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Legendary Trophy Silhouette -->
      <path d="M80 26 L83 36 L92 38 L85 46 L87 56 L80 50 L73 56 L75 46 L68 38 L77 36 Z" fill="url(#gold_glow)" />
      <!-- Base and Figurine -->
      <rect x="74" y="55" width="12" height="20" rx="2" fill="url(#gold_glow)" />
      <rect x="68" y="75" width="24" height="6" rx="2" fill="#eab308" />
      <!-- Header text -->
      <text x="80" y="92" text-anchor="middle" fill="#fef08a" font-family="Arial Black, sans-serif" font-weight="900" font-size="8.5" letter-spacing="1.5">CONMEBOL</text>
      <text x="80" y="103" text-anchor="middle" fill="#ffffff" font-family="Impact, sans-serif" font-weight="900" font-size="10" letter-spacing="1">LIBERTADORES</text>
    </svg>`
  },
  {
    id: 'copa-sudamericana',
    name: 'CONMEBOL Sudamericana',
    shortName: 'SUDAMERICANA',
    category: 'conmebol',
    primaryColor: '#94a3b8',
    accentColor: '#38bdf8',
    sponsorText: 'CONMEBOL | La Gran Conquista',
    headerTheme: 'sudamericana',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silver_glow" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff" />
          <stop offset="50%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#silver_glow)" stroke-width="4"/>
      <!-- Sudamericana Shield Crest -->
      <path d="M80 25 L110 38 L110 68 C110 88 80 102 80 102 C80 102 50 88 50 68 L50 38 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="80" cy="55" r="14" fill="url(#silver_glow)"/>
      <text x="80" y="88" text-anchor="middle" fill="#38bdf8" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">SUDAMERICANA</text>
    </svg>`
  },
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    shortName: 'CHAMPIONS LEAGUE',
    category: 'uefa',
    primaryColor: '#1e3a8a',
    accentColor: '#ffffff',
    sponsorText: 'UEFA | The Ultimate Stage',
    headerTheme: 'champions',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark Blue Circle -->
      <circle cx="80" cy="60" r="50" fill="#050b1e" stroke="#3b82f6" stroke-width="3"/>
      <!-- Starball Icons in Ring -->
      <g fill="#ffffff">
        <!-- Center star -->
        <polygon points="80,48 83,57 92,57 85,62 88,71 80,66 72,71 75,62 68,57 77,57" />
        <!-- Top star -->
        <polygon points="80,24 82,30 88,30 83,34 85,40 80,36 75,40 77,34 72,30 78,30" />
        <!-- Bottom star -->
        <polygon points="80,78 82,84 88,84 83,88 85,94 80,90 75,94 77,88 72,84 78,84" />
        <!-- Left star -->
        <polygon points="50,56 52,62 58,62 53,66 55,72 50,68 45,72 47,66 42,62 48,62" />
        <!-- Right star -->
        <polygon points="110,56 112,62 118,62 113,66 115,72 110,68 105,72 107,66 102,62 108,62" />
      </g>
      <text x="80" y="104" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="7" letter-spacing="2">CHAMPIONS LEAGUE</text>
    </svg>`
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'PREMIER LEAGUE',
    category: 'uefa',
    primaryColor: '#7c3aed',
    accentColor: '#00ff87',
    sponsorText: 'Barclays | Official Broadcast',
    headerTheme: 'premier',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#38003c" stroke="#00ff87" stroke-width="3"/>
      <!-- Lion Face Emblem -->
      <path d="M80 32 L85 24 L92 34 L100 28 L98 42 C108 52 104 74 94 84 C84 92 76 92 66 84 C56 74 52 52 62 42 L60 28 L68 34 L75 24 Z" fill="#ffffff" />
      <circle cx="73" cy="54" r="3" fill="#38003c"/>
      <circle cx="87" cy="54" r="3" fill="#38003c"/>
      <polygon points="80,64 85,58 75,58" fill="#38003c" />
      <text x="80" y="103" text-anchor="middle" fill="#00ff87" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">PREMIER LEAGUE</text>
    </svg>`
  },
  {
    id: 'la-liga',
    name: 'LALIGA EA SPORTS',
    shortName: 'LALIGA',
    category: 'uefa',
    primaryColor: '#ff2b42',
    accentColor: '#ffffff',
    sponsorText: 'EA SPORTS FC | LaLiga',
    headerTheme: 'default',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#0f172a" stroke="#ff2b42" stroke-width="3"/>
      <!-- Dual L Icon -->
      <path d="M60 38 L72 38 L72 70 L95 70 L95 82 L60 82 Z" fill="#ff2b42" />
      <path d="M82 48 L94 48 L94 65 L108 65 L108 77 L82 77 Z" fill="#ffffff" />
      <text x="80" y="102" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="9" letter-spacing="1.5">LALIGA</text>
    </svg>`
  },
  {
    id: 'eliminatorias-fifa',
    name: 'Eliminatorias Sudamericanas - Mundial 2026',
    shortName: 'ELIMINATORIAS',
    category: 'fifa',
    primaryColor: '#eab308',
    accentColor: '#0284c7',
    sponsorText: 'FIFA | Camino al Mundial 2026',
    headerTheme: 'fifa',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fifa_gold" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fef08a" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#fifa_gold)" stroke-width="3"/>
      <!-- World Cup Trophy Silhouette -->
      <path d="M72 30 C72 26 88 26 88 30 L88 38 C94 40 96 46 92 54 L88 62 L90 85 L70 85 L72 62 L68 54 C64 46 66 40 72 38 Z" fill="url(#fifa_gold)"/>
      <circle cx="80" cy="40" r="7" fill="#ffffff" opacity="0.9"/>
      <text x="80" y="96" text-anchor="middle" fill="#fef08a" font-family="Arial Black, sans-serif" font-weight="900" font-size="7" letter-spacing="1">ELIMINATORIAS</text>
      <text x="80" y="106" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="9">2026</text>
    </svg>`
  },
  {
    id: 'copa-america',
    name: 'Copa América',
    shortName: 'COPA AMÉRICA',
    category: 'conmebol',
    primaryColor: '#1d4ed8',
    accentColor: '#ef4444',
    sponsorText: 'CONMEBOL | Vibrando el Continente',
    headerTheme: 'copa-pacena',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 15 L125 28 L125 72 C125 96 80 114 80 114 C80 114 35 96 35 72 L35 28 Z" fill="#1e3a8a" stroke="#ffffff" stroke-width="3"/>
      <circle cx="80" cy="55" r="22" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
      <text x="80" y="58" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">USA / CONMEBOL</text>
      <text x="80" y="94" text-anchor="middle" fill="#ffffff" font-family="Impact, sans-serif" font-weight="900" font-size="12" letter-spacing="1">COPA AMÉRICA</text>
    </svg>`
  }
];

export function getCompetitionById(id: string): Competition {
  return COMPETITIONS.find(c => c.id === id) || COMPETITIONS[0];
}
