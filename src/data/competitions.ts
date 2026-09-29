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
  // --- BOLIVIA ---
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
      <!-- Metallic Silver Trophy Handles -->
      <path d="M44 24 C34 32 34 52 46 66" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M44 24 C34 32 34 52 46 66" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M116 24 C126 32 126 52 114 66" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M116 24 C126 32 126 52 114 66" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" fill="none"/>
      
      <!-- Top Center COPA text -->
      <text x="80" y="44" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Montserrat, sans-serif" font-weight="900" font-size="12" letter-spacing="2.5">COPA</text>
      
      <!-- Iconic Red Ribbon with White Outline -->
      <path d="M22 52 L138 52 L134 76 L26 76 Z" fill="#e11d48" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="80" y="70" text-anchor="middle" fill="#ffffff" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="18" font-style="italic" letter-spacing="1.2">PACEÑA</text>
      
      <!-- Stars below Ribbon -->
      <text x="80" y="87" text-anchor="middle" fill="#ffffff" font-size="9" letter-spacing="3">★ ★ ★</text>
      
      <!-- Radiating Trophy Stem Rays -->
      <line x1="54" y1="78" x2="72" y2="104" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="106" y1="78" x2="88" y2="104" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="68" y1="78" x2="76" y2="104" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="92" y1="78" x2="84" y2="104" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'liga-boliviana',
    name: 'Liga Tecno (División Profesional)',
    shortName: 'LIGA TECNO',
    category: 'bolivia',
    primaryColor: '#0284c7',
    accentColor: '#22c55e',
    sponsorText: 'Tigo Sports & Tecno | FBF División Profesional',
    headerTheme: 'default',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tecno_blue" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0284c7" />
          <stop offset="100%" stop-color="#082f49" />
        </linearGradient>
        <linearGradient id="tecno_cyan" x1="0" y1="0" x2="1" y2="0">
          <stop stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <!-- Shield Shape -->
      <path d="M80 8 L138 22 L138 72 C138 98 80 116 80 116 C80 116 22 98 22 72 L22 22 Z" fill="url(#tecno_blue)" stroke="url(#tecno_cyan)" stroke-width="3"/>
      <!-- Tricolor Bolivia Ribbon -->
      <polygon points="25,24 135,24 135,29 25,29" fill="#ef4444" />
      <polygon points="25,29 135,29 135,34 25,34" fill="#eab308" />
      <polygon points="25,34 135,34 135,39 25,39" fill="#22c55e" />
      <!-- Soccer Ball with Tech Hexagon Rings -->
      <circle cx="80" cy="62" r="17" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
      <polygon points="80,52 87,57 84,67 76,67 73,57" fill="#0369a1" />
      <!-- Speed tech lines -->
      <line x1="42" y1="62" x2="56" y2="62" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="104" y1="62" x2="118" y2="62" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <!-- Bold LIGA TECNO banner -->
      <rect x="28" y="82" width="104" height="22" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="80" y="97" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="11" letter-spacing="1">LIGA TECNO</text>
    </svg>`
  },
  {
    id: 'copa-simon-bolivar',
    name: 'Copa Simón Bolívar',
    shortName: 'SIMÓN BOLÍVAR',
    category: 'bolivia',
    primaryColor: '#15803d',
    accentColor: '#eab308',
    sponsorText: 'FBF | Nacional B de Ascenso',
    headerTheme: 'default',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Logo_Oficial_de_la_Copa_Sim%C3%B3n_Bol%C3%ADvar_2021.png',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#14532d" stroke="#eab308" stroke-width="3"/>
      <circle cx="80" cy="60" r="42" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Trophy Silhouette -->
      <path d="M68 32 L92 32 L88 56 C88 64 72 64 72 56 Z" fill="#eab308"/>
      <rect x="76" y="58" width="8" height="14" fill="#ca8a04"/>
      <rect x="70" y="72" width="20" height="6" fill="#eab308"/>
      <text x="80" y="92" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">SIMÓN BOLÍVAR</text>
      <text x="80" y="103" text-anchor="middle" fill="#facc15" font-family="Arial, sans-serif" font-weight="700" font-size="7">ASCENSO FBF</text>
    </svg>`
  },

  // --- CONMEBOL ---
  {
    id: 'copa-libertadores',
    name: 'CONMEBOL Libertadores',
    shortName: 'LIBERTADORES',
    category: 'conmebol',
    primaryColor: '#eab308',
    accentColor: '#ca8a04',
    sponsorText: 'CONMEBOL | La Gloria Eterna',
    headerTheme: 'libertadores',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Copa_Libertadores_logo.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gold_glow_lib" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="60%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#a16207" />
        </radialGradient>
      </defs>
      <!-- Elegant Round Golden Crest -->
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#gold_glow_lib)" stroke-width="4"/>
      <circle cx="80" cy="60" r="42" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Legendary Trophy Silhouette -->
      <path d="M80 26 L83 36 L92 38 L85 46 L87 56 L80 50 L73 56 L75 46 L68 38 L77 36 Z" fill="url(#gold_glow_lib)" />
      <!-- Base and Figurine -->
      <rect x="74" y="55" width="12" height="20" rx="2" fill="url(#gold_glow_lib)" />
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
    primaryColor: '#0284c7',
    accentColor: '#94a3b8',
    sponsorText: 'CONMEBOL | La Gran Conquista',
    headerTheme: 'sudamericana',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Conmebol-sudamericana.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silver_glow_sud" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff" />
          <stop offset="50%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#silver_glow_sud)" stroke-width="4"/>
      <!-- Sudamericana Shield Crest -->
      <path d="M80 25 L110 38 L110 68 C110 88 80 102 80 102 C80 102 50 88 50 68 L50 38 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="80" cy="55" r="14" fill="url(#silver_glow_sud)"/>
      <text x="80" y="88" text-anchor="middle" fill="#38bdf8" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">SUDAMERICANA</text>
    </svg>`
  },
  {
    id: 'copa-america',
    name: 'CONMEBOL Copa América',
    shortName: 'COPA AMÉRICA',
    category: 'conmebol',
    primaryColor: '#1e3a8a',
    accentColor: '#dc2626',
    sponsorText: 'CONMEBOL | Vibrando el Continente',
    headerTheme: 'copa-pacena',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Conmebol_Copa_America_2024_Logo.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 15 L125 28 L125 72 C125 96 80 114 80 114 C80 114 35 96 35 72 L35 28 Z" fill="#1e3a8a" stroke="#ffffff" stroke-width="3"/>
      <circle cx="80" cy="55" r="22" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
      <text x="80" y="58" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">USA / CONMEBOL</text>
      <text x="80" y="94" text-anchor="middle" fill="#ffffff" font-family="Impact, sans-serif" font-weight="900" font-size="12" letter-spacing="1">COPA AMÉRICA</text>
    </svg>`
  },

  // --- UEFA & EUROPEAN LEAGUES ---
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    shortName: 'CHAMPIONS LEAGUE',
    category: 'uefa',
    primaryColor: '#030b20',
    accentColor: '#38bdf8',
    sponsorText: 'UEFA | The Ultimate Stage',
    headerTheme: 'champions',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/UEFA_Champions_League.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="50" fill="#050b1e" stroke="#3b82f6" stroke-width="3"/>
      <g fill="#ffffff">
        <polygon points="80,48 83,57 92,57 85,62 88,71 80,66 72,71 75,62 68,57 77,57" />
        <polygon points="80,24 82,30 88,30 83,34 85,40 80,36 75,40 77,34 72,30 78,30" />
        <polygon points="80,78 82,84 88,84 83,88 85,94 80,90 75,94 77,88 72,84 78,84" />
        <polygon points="50,56 52,62 58,62 53,66 55,72 50,68 45,72 47,66 42,62 48,62" />
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
    primaryColor: '#38003c',
    accentColor: '#00ff87',
    sponsorText: 'Barclays | Official Broadcast',
    headerTheme: 'premier',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#38003c" stroke="#00ff87" stroke-width="3"/>
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
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#0f172a" stroke="#ff2b42" stroke-width="3"/>
      <path d="M60 38 L72 38 L72 70 L95 70 L95 82 L60 82 Z" fill="#ff2b42" />
      <path d="M82 48 L94 48 L94 65 L108 65 L108 77 L82 77 Z" fill="#ffffff" />
      <text x="80" y="102" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="9" letter-spacing="1.5">LALIGA</text>
    </svg>`
  },
  {
    id: 'copa-del-rey',
    name: 'Copa del Rey',
    shortName: 'COPA DEL REY',
    category: 'uefa',
    primaryColor: '#b91c1c',
    accentColor: '#eab308',
    sponsorText: 'RFEF | El Torneo del K.O.',
    headerTheme: 'default',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Copa_del_Rey_logo_(2021).svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#18181b" stroke="#eab308" stroke-width="3"/>
      <path d="M65 35 L95 35 L88 65 C88 74 72 74 72 65 Z" fill="#eab308"/>
      <rect x="76" y="65" width="8" height="15" fill="#ca8a04"/>
      <rect x="68" y="80" width="24" height="6" rx="2" fill="#eab308"/>
      <text x="80" y="101" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="7.5" letter-spacing="1">COPA DEL REY</text>
    </svg>`
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'BUNDESLIGA',
    category: 'uefa',
    primaryColor: '#d20515',
    accentColor: '#ffffff',
    sponsorText: 'DFL | Football As It’s Meant To Be',
    headerTheme: 'default',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_(2017).svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="15" width="90" height="90" rx="12" fill="#d20515"/>
      <circle cx="95" cy="40" r="9" fill="#ffffff"/>
      <path d="M55 85 L65 55 L82 72 L100 48" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="80" y="96" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="7" letter-spacing="1">BUNDESLIGA</text>
    </svg>`
  },
  {
    id: 'coppa-italia',
    name: 'Coppa Italia Frecciarossa',
    shortName: 'COPPA ITALIA',
    category: 'uefa',
    primaryColor: '#002f6c',
    accentColor: '#00a3e0',
    sponsorText: 'Lega Serie A | Frecciarossa',
    headerTheme: 'default',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Coppa_Italia_logo.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="48" fill="#002f6c" stroke="#00a3e0" stroke-width="3"/>
      <!-- Tricolore cockade -->
      <circle cx="80" cy="50" r="22" fill="#008c45"/>
      <circle cx="80" cy="50" r="16" fill="#f4f5f0"/>
      <circle cx="80" cy="50" r="10" fill="#cd212a"/>
      <text x="80" y="88" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" letter-spacing="1">COPPA ITALIA</text>
      <text x="80" y="99" text-anchor="middle" fill="#00a3e0" font-family="Arial, sans-serif" font-weight="800" font-size="7">FRECCIAROSSA</text>
    </svg>`
  },

  // --- FIFA & INTERNATIONAL ---
  {
    id: 'eliminatorias-fifa',
    name: 'Eliminatorias Sudamericanas - Mundial 2026',
    shortName: 'ELIMINATORIAS',
    category: 'fifa',
    primaryColor: '#eab308',
    accentColor: '#0284c7',
    sponsorText: 'CONMEBOL & FIFA | Camino al Mundial 2026',
    headerTheme: 'fifa',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/2026_FIFA_World_Cup_emblem.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fifa_gold" x1="0" y1="0" x2="160" y2="120" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fef08a" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="60" r="48" fill="#09090b" stroke="url(#fifa_gold)" stroke-width="3"/>
      <path d="M72 30 C72 26 88 26 88 30 L88 38 C94 40 96 46 92 54 L88 62 L90 85 L70 85 L72 62 L68 54 C64 46 66 40 72 38 Z" fill="url(#fifa_gold)"/>
      <circle cx="80" cy="40" r="7" fill="#ffffff" opacity="0.9"/>
      <text x="80" y="96" text-anchor="middle" fill="#fef08a" font-family="Arial Black, sans-serif" font-weight="900" font-size="7" letter-spacing="1">ELIMINATORIAS</text>
      <text x="80" y="106" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="9">2026</text>
    </svg>`
  },
  {
    id: 'fifa-world-cup',
    name: 'Copa Mundial FIFA 2026',
    shortName: 'MUNDIAL 2026',
    category: 'fifa',
    primaryColor: '#09090b',
    accentColor: '#22c55e',
    sponsorText: 'FIFA | Estados Unidos, México & Canadá',
    headerTheme: 'fifa',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/2026_FIFA_World_Cup_emblem.svg',
    badgeSvg: `<svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="15" width="90" height="90" rx="14" fill="#09090b" stroke="#ffffff" stroke-width="2"/>
      <text x="80" y="55" text-anchor="middle" fill="#ffffff" font-family="Impact, sans-serif" font-size="34">26</text>
      <text x="80" y="78" text-anchor="middle" fill="#22c55e" font-family="Arial Black, sans-serif" font-size="8" letter-spacing="1">FIFA WORLD CUP</text>
      <text x="80" y="94" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="6.5">USA • MEX • CAN</text>
    </svg>`
  }
];

export function getCompetitionById(id: string): Competition {
  return COMPETITIONS.find(c => c.id === id) || COMPETITIONS[0];
}
