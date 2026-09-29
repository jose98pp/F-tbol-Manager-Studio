export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'POR' | 'DEF' | 'MED' | 'DEL';
  isCaptain?: boolean;
  photoUrl?: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  category: 'bolivia' | 'conmebol' | 'international';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  stadium?: string;
  city?: string;
  founded?: string;
  coach?: string;
  nickname?: string;
  badgeUrl?: string; // Real transparent high-res PNG/SVG
  badgeSvg: string; // Crisp SVG fallback
  squad?: Player[];
}

export const CLUBS: Club[] = [
  // --- LIGA BOLIVIANA / COPA PACEÑA ---
  {
    id: 'bolivar',
    name: 'Club Bolívar',
    shortName: 'BOLÍVAR',
    category: 'bolivia',
    primaryColor: '#0080ff',
    secondaryColor: '#ffffff',
    accentColor: '#004499',
    city: 'La Paz',
    stadium: 'Estadio Hernando Siles',
    founded: '1925',
    coach: 'Flavio Robatto',
    nickname: 'La Academia / Los Celestes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Club_Bol%C3%ADvar_Oficial.png/280px-Club_Bol%C3%ADvar_Oficial.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#0284c7" stroke="#ffffff" stroke-width="4"/>
      <polygon points="12,24 88,80 88,92 12,36" fill="#ffffff" />
      <polygon points="12,28 88,84 88,88 12,32" fill="#ef4444" />
      <polygon points="12,32 88,88 88,92 12,36" fill="#eab308" />
      <polygon points="12,36 88,92 88,96 12,40" fill="#22c55e" />
      <text x="50" y="65" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="11">BOLÍVAR</text>
    </svg>`,
    squad: [
      { id: 'b1', name: 'Carlos Lampe', number: 1, position: 'POR' },
      { id: 'b2', name: 'Jesús Sagredo', number: 2, position: 'DEF' },
      { id: 'b3', name: 'Renzo Orihuela', number: 4, position: 'DEF' },
      { id: 'b4', name: 'José Sagredo', number: 3, position: 'DEF' },
      { id: 'b5', name: 'Yomar Rocha', number: 24, position: 'DEF' },
      { id: 'b6', name: 'Leonel Justiniano', number: 23, position: 'MED', isCaptain: true },
      { id: 'b7', name: 'Ervin Vaca', number: 20, position: 'MED' },
      { id: 'b8', name: 'Ramiro Vaca', number: 10, position: 'MED' },
      { id: 'b9', name: 'Patricio Rodríguez', number: 17, position: 'DEL' },
      { id: 'b10', name: 'Bruno Sávio', number: 11, position: 'DEL' },
      { id: 'b11', name: 'Fábio Gomes', number: 9, position: 'DEL' },
      { id: 'b12', name: 'Federico Lanzillota', number: 12, position: 'POR' },
      { id: 'b13', name: 'Fernando Saucedo', number: 8, position: 'MED' },
      { id: 'b14', name: 'Henry Vaca', number: 7, position: 'DEL' },
      { id: 'b15', name: 'Jairo Quinteros', number: 5, position: 'DEF' },
      { id: 'b16', name: 'Alfio Oviedo', number: 19, position: 'DEL' }
    ]
  },
  {
    id: 'the-strongest',
    name: 'The Strongest',
    shortName: 'STRONGEST',
    category: 'bolivia',
    primaryColor: '#eab308',
    secondaryColor: '#0f172a',
    accentColor: '#000000',
    city: 'La Paz',
    stadium: 'Estadio Hernando Siles',
    founded: '1908',
    coach: 'Ismael Rescalvo',
    nickname: 'El Tigre / Gualdinegro',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Club_The_Strongest_2014-present.png/280px-Club_The_Strongest_2014-present.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 18 L90 70 Q50 115 50 115 Q10 70 10 18 Z" fill="#eab308" stroke="#000000" stroke-width="4"/>
      <rect x="24" y="24" width="12" height="70" fill="#09090b" />
      <rect x="44" y="24" width="12" height="70" fill="#09090b" />
      <rect x="64" y="24" width="12" height="70" fill="#09090b" />
      <rect x="0" y="0" width="100" height="26" fill="#09090b" />
      <text x="50" y="18" text-anchor="middle" fill="#facc15" font-family="Arial Black, sans-serif" font-weight="900" font-size="7">THE STRONGEST</text>
    </svg>`,
    squad: [
      { id: 'ts1', name: 'Guillermo Viscarra', number: 1, position: 'POR' },
      { id: 'ts2', name: 'Maximiliano Caire', number: 22, position: 'DEF' },
      { id: 'ts3', name: 'Adrián Jusino', number: 5, position: 'DEF', isCaptain: true },
      { id: 'ts4', name: 'Darío Aimar', number: 4, position: 'DEF' },
      { id: 'ts5', name: 'Daniel Lino', number: 15, position: 'DEF' },
      { id: 'ts6', name: 'Diego Wayar', number: 14, position: 'MED' },
      { id: 'ts7', name: 'Luciano Ursino', number: 8, position: 'MED' },
      { id: 'ts8', name: 'Michael Ortega', number: 10, position: 'MED' },
      { id: 'ts9', name: 'Jaime Arrascaita', number: 30, position: 'MED' },
      { id: 'ts10', name: 'Jeyson Chura', number: 23, position: 'DEL' },
      { id: 'ts11', name: 'Enrique Triverio', number: 11, position: 'DEL' },
      { id: 'ts12', name: 'Jhohan Gutiérrez', number: 12, position: 'POR' },
      { id: 'ts13', name: 'Marc Enoumba', number: 3, position: 'DEF' },
      { id: 'ts14', name: 'Rodrigo Ramallo', number: 18, position: 'DEL' },
      { id: 'ts15', name: 'Gabriel Sotomayor', number: 20, position: 'DEL' }
    ]
  },
  {
    id: 'wilstermann',
    name: 'Jorge Wilstermann',
    shortName: 'WILSTERMANN',
    category: 'bolivia',
    primaryColor: '#b91c1c',
    secondaryColor: '#1d4ed8',
    accentColor: '#ffffff',
    city: 'Cochabamba',
    stadium: 'Estadio Félix Capriles',
    founded: '1949',
    coach: 'Eduardo Villegas',
    nickname: 'El Aviador / Hércules',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Club_Jorge_Wilstermann.svg/280px-Club_Jorge_Wilstermann.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L92 22 L92 72 Q50 115 50 115 Q8 72 8 22 Z" fill="#b91c1c" stroke="#ffffff" stroke-width="3"/>
      <path d="M8 22 L92 22 L92 72 Q50 115 50 115 Z" fill="#1d4ed8" opacity="0.9"/>
      <circle cx="50" cy="58" r="16" fill="#ffffff" stroke="#b91c1c" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" fill="#1d4ed8" font-family="Arial Black, sans-serif" font-weight="900" font-size="16">W</text>
    </svg>`,
    squad: [
      { id: 'w1', name: 'Bruno Poveda', number: 1, position: 'POR' },
      { id: 'w2', name: 'Robson dos Santos', number: 22, position: 'DEF' },
      { id: 'w3', name: 'Gonzalo Castillo', number: 5, position: 'DEF' },
      { id: 'w4', name: 'Santiago Echeverría', number: 2, position: 'DEF', isCaptain: true },
      { id: 'w5', name: 'Marvin Bejarano', number: 3, position: 'DEF' },
      { id: 'w6', name: 'Cristhian Machado', number: 8, position: 'MED' },
      { id: 'w7', name: 'Alejandro Chumacero', number: 30, position: 'MED' },
      { id: 'w8', name: 'Rudy Cardozo', number: 10, position: 'MED' },
      { id: 'w9', name: 'Carlitos Rodríguez', number: 11, position: 'DEL' },
      { id: 'w10', name: 'Ariel Nahuelpán', number: 9, position: 'DEL' },
      { id: 'w11', name: 'Héctor Bobadilla', number: 19, position: 'DEL' }
    ]
  },
  {
    id: 'blooming',
    name: 'Club Blooming',
    shortName: 'BLOOMING',
    category: 'bolivia',
    primaryColor: '#0ea5e9',
    secondaryColor: '#1e3a8a',
    accentColor: '#ffffff',
    city: 'Santa Cruz',
    stadium: 'Estadio Ramón Tahuichi Aguilera',
    founded: '1946',
    coach: 'Carlos Bustos',
    nickname: 'La Academia Cruceña / Pasión Celeste',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Club_Blooming_logo.svg/280px-Club_Blooming_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#0284c7" stroke="#ffffff" stroke-width="3"/>
      <path d="M50 12 L84 25 L84 72 Q50 106 50 106 Q16 72 16 25 Z" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
      <text x="50" y="38" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="900" font-size="9">BLOOMING</text>
      <circle cx="50" cy="64" r="15" fill="#ffffff" stroke="#1e3a8a" stroke-width="2"/>
      <text x="50" y="96" text-anchor="middle" fill="#facc15" font-size="11">★★★★★</text>
    </svg>`,
    squad: [
      { id: 'bl1', name: 'Braulio Uraezaña', number: 1, position: 'POR' },
      { id: 'bl2', name: 'César Romero', number: 4, position: 'DEF' },
      { id: 'bl3', name: 'Gabriel Valverde', number: 22, position: 'DEF' },
      { id: 'bl4', name: 'Denilson Durán', number: 3, position: 'DEF' },
      { id: 'bl5', name: 'Arquímedes Figuera', number: 5, position: 'MED', isCaptain: true },
      { id: 'bl6', name: 'Richard Spenhay', number: 16, position: 'MED' },
      { id: 'bl7', name: 'Rafinha', number: 10, position: 'MED' },
      { id: 'bl8', name: 'Juan Carlos Arce', number: 17, position: 'DEL' },
      { id: 'bl9', name: 'Fernando Arismendi', number: 7, position: 'DEL' },
      { id: 'bl10', name: 'César Menacho', number: 9, position: 'DEL' },
      { id: 'bl11', name: 'Moisés Villarroel', number: 8, position: 'MED' }
    ]
  },
  {
    id: 'oriente-petrolero',
    name: 'Oriente Petrolero',
    shortName: 'ORIENTE PET.',
    category: 'bolivia',
    primaryColor: '#15803d',
    secondaryColor: '#ffffff',
    accentColor: '#166534',
    city: 'Santa Cruz',
    stadium: 'Estadio Ramón Tahuichi Aguilera',
    founded: '1955',
    coach: 'Joaquín Monasterio',
    nickname: 'Los Refineros / Albiverdes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Orientepetrolero.png/280px-Orientepetrolero.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 18 L90 70 Q50 115 50 115 Q10 70 10 18 Z" fill="#ffffff" stroke="#15803d" stroke-width="4"/>
      <rect x="36" y="22" width="10" height="75" fill="#15803d" />
      <rect x="54" y="22" width="10" height="75" fill="#15803d" />
      <circle cx="50" cy="56" r="18" fill="#ffffff" stroke="#166534" stroke-width="2"/>
      <text x="50" y="63" text-anchor="middle" fill="#166534" font-family="Arial Black, sans-serif" font-weight="900" font-size="13">O P</text>
    </svg>`,
    squad: [
      { id: 'op1', name: 'Alejandro Torres', number: 1, position: 'POR' },
      { id: 'op2', name: 'Roberto Díez', number: 2, position: 'DEF' },
      { id: 'op3', name: 'Sebastián Álvarez', number: 27, position: 'DEF' },
      { id: 'op4', name: 'Carlos Ventura', number: 11, position: 'DEL' },
      { id: 'op5', name: 'Franz Gonzales', number: 14, position: 'MED' },
      { id: 'op6', name: 'Diego Barreto', number: 8, position: 'MED' },
      { id: 'op7', name: 'Hugo Dorrego', number: 10, position: 'MED', isCaptain: true },
      { id: 'op8', name: 'Gilbert Álvarez', number: 9, position: 'DEL' },
      { id: 'op9', name: 'Marcos Riquelme', number: 19, position: 'DEL' },
      { id: 'op10', name: 'Jorge Flores', number: 17, position: 'DEF' },
      { id: 'op11', name: 'Kevin Salvatierra', number: 20, position: 'MED' }
    ]
  },
  {
    id: 'always-ready',
    name: 'Always Ready',
    shortName: 'ALWAYS READY',
    category: 'bolivia',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    accentColor: '#991b1b',
    city: 'El Alto',
    stadium: 'Estadio Municipal de Villa Ingenio (El Alto)',
    founded: '1933',
    coach: 'Facundo Biondi',
    nickname: 'La Banda Roja / El Millonario',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Club_Always_Ready.svg/280px-Club_Always_Ready.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
      <polygon points="12,22 88,85 88,100 12,37" fill="#dc2626" />
      <text x="50" y="26" text-anchor="middle" fill="#dc2626" font-family="Arial Black, sans-serif" font-weight="900" font-size="9">C.A.R.</text>
      <text x="50" y="65" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8" transform="rotate(32 50 65)">ALWAYS READY</text>
    </svg>`,
    squad: [
      { id: 'ar1', name: 'Alain Baroja', number: 1, position: 'POR' },
      { id: 'ar2', name: 'Diego Medina', number: 14, position: 'DEF' },
      { id: 'ar3', name: 'Marcelo Suárez', number: 4, position: 'DEF' },
      { id: 'ar4', name: 'Luis Caicedo', number: 26, position: 'DEF' },
      { id: 'ar5', name: 'Héctor Cuéllar', number: 13, position: 'MED' },
      { id: 'ar6', name: 'Robson Matheus', number: 8, position: 'MED' },
      { id: 'ar7', name: 'Adalid Terrazas', number: 10, position: 'MED', isCaptain: true },
      { id: 'ar8', name: 'Darlison Rodríguez', number: 11, position: 'DEL' },
      { id: 'ar9', name: 'Wesley Tanque', number: 9, position: 'DEL' },
      { id: 'ar10', name: 'José Carabalí', number: 17, position: 'DEF' },
      { id: 'ar11', name: 'Moisés Paniagua', number: 20, position: 'DEL' }
    ]
  },
  {
    id: 'aurora',
    name: 'Club Aurora',
    shortName: 'AURORA',
    category: 'bolivia',
    primaryColor: '#38bdf8',
    secondaryColor: '#ffffff',
    accentColor: '#0284c7',
    city: 'Cochabamba',
    stadium: 'Estadio Félix Capriles',
    founded: '1935',
    coach: 'Mauricio Soria',
    nickname: 'El Equipo del Pueblo / El Celeste',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Club_Aurora_logo.svg/280px-Club_Aurora_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="3"/>
      <rect x="18" y="42" width="64" height="22" rx="4" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
      <text x="50" y="57" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="10">AURORA</text>
    </svg>`,
    squad: [
      { id: 'au1', name: 'David Akologo', number: 99, position: 'POR' },
      { id: 'au2', name: 'Nelson Amarilla', number: 3, position: 'DEF' },
      { id: 'au3', name: 'Luis Barboza', number: 22, position: 'DEF', isCaptain: true },
      { id: 'au4', name: 'Jair Torrico', number: 20, position: 'DEF' },
      { id: 'au5', name: 'Didí Torrico', number: 26, position: 'MED' },
      { id: 'au6', name: 'Carlos Sejas', number: 8, position: 'MED' },
      { id: 'au7', name: 'Darío Torrico', number: 10, position: 'MED' },
      { id: 'au8', name: 'Serginho', number: 7, position: 'DEL' },
      { id: 'au9', name: 'Oswaldo Blanco', number: 18, position: 'DEL' },
      { id: 'au10', name: 'Jair Reinoso', number: 9, position: 'DEL' },
      { id: 'au11', name: 'Antonio Bustamante', number: 14, position: 'MED' }
    ]
  },
  {
    id: 'san-antonio',
    name: 'San Antonio Bulo Bulo',
    shortName: 'SAN ANTONIO',
    category: 'bolivia',
    primaryColor: '#1e3a8a',
    secondaryColor: '#22c55e',
    accentColor: '#ffffff',
    city: 'Entre Ríos / Bulo Bulo',
    stadium: 'Estadio Carlos Villegas',
    founded: '1962',
    coach: 'Thiago Leitao',
    nickname: 'El Santo de Bulo Bulo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Club_Deportivo_San_Antonio_Bulo_Bulo.png/280px-Club_Deportivo_San_Antonio_Bulo_Bulo.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#1e3a8a" stroke="#22c55e" stroke-width="3.5"/>
      <circle cx="50" cy="44" r="10" fill="#ffffff" stroke="#1e3a8a" stroke-width="2"/>
      <text x="50" y="48" text-anchor="middle" fill="#1e3a8a" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">SA</text>
      <text x="50" y="94" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="800" font-size="7">SAN ANTONIO</text>
    </svg>`,
    squad: [
      { id: 'sa1', name: 'Jhunior Vera', number: 1, position: 'POR' },
      { id: 'sa2', name: 'Josué Prieto', number: 3, position: 'DEF' },
      { id: 'sa3', name: 'Gustavo Olguín', number: 2, position: 'DEF' },
      { id: 'sa4', name: 'Alonso Sánchez', number: 22, position: 'DEF' },
      { id: 'sa5', name: 'Edwin Rivera', number: 6, position: 'MED', isCaptain: true },
      { id: 'sa6', name: 'Carlos Preciado', number: 8, position: 'MED' },
      { id: 'sa7', name: 'Mateo Bustos', number: 10, position: 'MED' },
      { id: 'sa8', name: 'Felipe Pasadore', number: 9, position: 'DEL' },
      { id: 'sa9', name: 'Daniel Floro', number: 11, position: 'DEL' },
      { id: 'sa10', name: 'Michael Castellón', number: 17, position: 'MED' },
      { id: 'sa11', name: 'Pablo Meza', number: 5, position: 'DEF' }
    ]
  },
  {
    id: 'real-tomayapo',
    name: 'Real Tomayapo',
    shortName: 'TOMAYAPO',
    category: 'bolivia',
    primaryColor: '#16a34a',
    secondaryColor: '#ffffff',
    accentColor: '#ca8a04',
    city: 'Tarija',
    stadium: 'Estadio IV Centenario',
    founded: '1999',
    coach: 'Cristian Arán',
    nickname: 'El Verdolaga Tarijeño',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Club_Real_Tomayapo.png/280px-Club_Real_Tomayapo.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#15803d" stroke="#facc15" stroke-width="3"/>
      <circle cx="50" cy="58" r="17" fill="#ffffff" stroke="#15803d" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" fill="#15803d" font-family="Arial Black, sans-serif" font-weight="900" font-size="7">TOMAYAPO</text>
    </svg>`,
    squad: [
      { id: 'rt1', name: 'Pedro Galindo', number: 1, position: 'POR' },
      { id: 'rt2', name: 'Juan Pablo Rioja', number: 5, position: 'DEF', isCaptain: true },
      { id: 'rt3', name: 'Leonardo Justiniano', number: 2, position: 'DEF' },
      { id: 'rt4', name: 'Jaime Villamil', number: 15, position: 'DEF' },
      { id: 'rt5', name: 'Sergio Villamil', number: 8, position: 'MED' },
      { id: 'rt6', name: 'Leandro Maygua', number: 10, position: 'MED' },
      { id: 'rt7', name: 'Matías Noble', number: 11, position: 'MED' },
      { id: 'rt8', name: 'Agustín Graneros', number: 9, position: 'DEL' },
      { id: 'rt9', name: 'Jorge Orozco', number: 19, position: 'DEL' },
      { id: 'rt10', name: 'Mateo Hernández', number: 20, position: 'MED' },
      { id: 'rt11', name: 'Aldair Cantillo', number: 4, position: 'DEF' }
    ]
  },
  {
    id: 'nacional-potosi',
    name: 'Nacional Potosí',
    shortName: 'NAC. POTOSÍ',
    category: 'bolivia',
    primaryColor: '#b91c1c',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    city: 'Potosí',
    stadium: 'Estadio Víctor Agustín Ugarte',
    founded: '1942',
    coach: 'Alberto Illanes',
    nickname: 'La Banda Roja de Potosí',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Club_Atl%C3%A9tico_Nacional_Potos%C3%AD.png/280px-Club_Atl%C3%A9tico_Nacional_Potos%C3%AD.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#ffffff" stroke="#b91c1c" stroke-width="4"/>
      <polygon points="12,22 88,85 88,100 12,37" fill="#b91c1c" />
      <text x="50" y="32" text-anchor="middle" fill="#b91c1c" font-family="Arial Black, sans-serif" font-weight="900" font-size="11">C.A.N.P.</text>
    </svg>`,
    squad: [
      { id: 'np1', name: 'Saidt Mustafá', number: 1, position: 'POR' },
      { id: 'np2', name: 'Daniel Mancilla', number: 4, position: 'DEF', isCaptain: true },
      { id: 'np3', name: 'Edisson Restrepo', number: 2, position: 'DEF' },
      { id: 'np4', name: 'Heber Leaños', number: 19, position: 'DEF' },
      { id: 'np5', name: 'Diego Hoyos', number: 8, position: 'MED' },
      { id: 'np6', name: 'Saulo Guerra', number: 10, position: 'MED' },
      { id: 'np7', name: 'Facundo Callejo', number: 11, position: 'DEL' },
      { id: 'np8', name: 'Martín Prost', number: 9, position: 'DEL' },
      { id: 'np9', name: 'William Álvarez', number: 18, position: 'DEL' },
      { id: 'np10', name: 'Andrés Torrico', number: 20, position: 'MED' },
      { id: 'np11', name: 'Maximiliano Ortíz', number: 3, position: 'DEF' }
    ]
  },
  {
    id: 'guabira',
    name: 'Club Deportivo Guabirá',
    shortName: 'GUABIRÁ',
    category: 'bolivia',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    accentColor: '#16a34a',
    city: 'Montero',
    stadium: 'Estadio Gilberto Parada',
    founded: '1962',
    coach: 'Gualberto Mojica',
    nickname: 'Los Azucareros / Furia Roja',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Club_Deportivo_Guabir%C3%A1.png/280px-Club_Deportivo_Guabir%C3%A1.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="48" fill="#dc2626" stroke="#ffffff" stroke-width="4"/>
      <circle cx="50" cy="60" r="28" fill="#ffffff"/>
      <text x="50" y="69" text-anchor="middle" fill="#dc2626" font-family="Arial Black, sans-serif" font-weight="900" font-size="28">G</text>
    </svg>`,
    squad: [
      { id: 'gu1', name: 'Jairo Cuellar', number: 1, position: 'POR' },
      { id: 'gu2', name: 'Leandro Zazpe', number: 3, position: 'DEF' },
      { id: 'gu3', name: 'Dico Roca', number: 2, position: 'DEF' },
      { id: 'gu4', name: 'Fran Supayabe', number: 14, position: 'DEF' },
      { id: 'gu5', name: 'Alejandro Meleán', number: 8, position: 'MED', isCaptain: true },
      { id: 'gu6', name: 'Gustavo Peredo', number: 20, position: 'MED' },
      { id: 'gu7', name: 'Ronaldo Vásquez', number: 10, position: 'MED' },
      { id: 'gu8', name: 'Alejandro Quintana', number: 9, position: 'DEL' },
      { id: 'gu9', name: 'Pedro Cabral', number: 11, position: 'DEL' },
      { id: 'gu10', name: 'Erick Japa', number: 7, position: 'DEL' },
      { id: 'gu11', name: 'Jefferson Ibáñez', number: 5, position: 'DEF' }
    ]
  },
  {
    id: 'universitario-vinto',
    name: 'Universitario de Vinto',
    shortName: 'U. DE VINTO',
    category: 'bolivia',
    primaryColor: '#991b1b',
    secondaryColor: '#ffffff',
    accentColor: '#1e3a8a',
    city: 'Vinto',
    stadium: 'Estadio Hipólito Lazarte',
    founded: '2005',
    coach: 'Pablo Godoy',
    nickname: 'El Manzanero de Vinto',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Universitario_de_Vinto.png/280px-Universitario_de_Vinto.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="48" fill="#991b1b" stroke="#ffffff" stroke-width="4"/>
      <circle cx="50" cy="60" r="30" fill="#ffffff" stroke="#991b1b" stroke-width="3"/>
      <text x="50" y="70" text-anchor="middle" fill="#991b1b" font-family="Arial Black, sans-serif" font-weight="900" font-size="28">U</text>
    </svg>`,
    squad: [
      { id: 'uv1', name: 'Raúl Olivares', number: 1, position: 'POR', isCaptain: true },
      { id: 'uv2', name: 'Julio Vila', number: 3, position: 'DEF' },
      { id: 'uv3', name: 'Joaquín Lencinas', number: 2, position: 'DEF' },
      { id: 'uv4', name: 'Diago Giménez', number: 14, position: 'DEF' },
      { id: 'uv5', name: 'Erick Cano', number: 17, position: 'MED' },
      { id: 'uv6', name: 'Ronaldo Monteiro', number: 19, position: 'DEL' },
      { id: 'uv7', name: 'Daniel Camacho', number: 10, position: 'MED' },
      { id: 'uv8', name: 'Tommy Tobar', number: 9, position: 'DEL' },
      { id: 'uv9', name: 'Maximiliano Núñez', number: 7, position: 'DEL' },
      { id: 'uv10', name: 'Guilder Cuellar', number: 22, position: 'MED' },
      { id: 'uv11', name: 'Pablo Laredo', number: 4, position: 'DEF' }
    ]
  },
  {
    id: 'gv-san-jose',
    name: 'GV San José / Real Oruro',
    shortName: 'GV SAN JOSÉ',
    category: 'bolivia',
    primaryColor: '#1e3a8a',
    secondaryColor: '#ffffff',
    accentColor: '#16a34a',
    city: 'Oruro',
    stadium: 'Estadio Jesús Bermúdez',
    founded: '1942',
    coach: 'Julio César Baldivieso',
    nickname: 'El Santo de Oruro',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Escudo_Club_Gualberto_Villarroel_San_Jos%C3%A9.png/280px-Escudo_Club_Gualberto_Villarroel_San_Jos%C3%A9.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#1e3a8a" stroke="#ffffff" stroke-width="3.5"/>
      <polygon points="15,25 50,85 85,25 72,25 50,65 28,25" fill="#ffffff" />
      <text x="50" y="20" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">GV SAN JOSÉ</text>
    </svg>`,
    squad: [
      { id: 'sj1', name: 'Roberto Rivas', number: 1, position: 'POR' },
      { id: 'sj2', name: 'Mario Cuéllar', number: 2, position: 'DEF', isCaptain: true },
      { id: 'sj3', name: 'Augusto Seimandi', number: 3, position: 'DEF' },
      { id: 'sj4', name: 'Saúl Torres', number: 4, position: 'DEF' },
      { id: 'sj5', name: 'Víctor Hugo Melgar', number: 6, position: 'MED' },
      { id: 'sj6', name: 'Ronaldo Sánchez', number: 10, position: 'MED' },
      { id: 'sj7', name: 'Javier Sanguinetti', number: 11, position: 'MED' },
      { id: 'sj8', name: 'Rubén Tarasco', number: 9, position: 'DEL' },
      { id: 'sj9', name: 'Hernán Rodríguez', number: 8, position: 'MED' },
      { id: 'sj10', name: 'Percy Loza', number: 17, position: 'DEL' },
      { id: 'sj11', name: 'Gonzalo Vaca', number: 14, position: 'DEF' }
    ]
  },
  {
    id: 'independiente-petrolero',
    name: 'Independiente Petrolero',
    shortName: 'INDEPENDIENTE',
    category: 'bolivia',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    city: 'Sucre',
    stadium: 'Estadio Olímpico Patria',
    founded: '1932',
    coach: 'Marcelo Robledo',
    nickname: 'El Matador de Sucre',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Club_Independiente_Petrolero.png/280px-Club_Independiente_Petrolero.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#ffffff" stroke="#dc2626" stroke-width="4"/>
      <rect x="25" y="20" width="16" height="70" fill="#dc2626" />
      <rect x="59" y="20" width="16" height="70" fill="#dc2626" />
      <circle cx="50" cy="58" r="16" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" fill="#dc2626" font-family="Arial Black, sans-serif" font-weight="900" font-size="14">IP</text>
    </svg>`,
    squad: [
      { id: 'ip1', name: 'Elder Arauz', number: 1, position: 'POR' },
      { id: 'ip2', name: 'David Díaz', number: 2, position: 'DEF', isCaptain: true },
      { id: 'ip3', name: 'Wilfredo Soleto', number: 3, position: 'DEF' },
      { id: 'ip4', name: 'Denilson Valda', number: 14, position: 'DEF' },
      { id: 'ip5', name: 'Diego Navarro', number: 6, position: 'MED' },
      { id: 'ip6', name: 'Thomaz Santos', number: 10, position: 'MED' },
      { id: 'ip7', name: 'Francisco Gatti', number: 8, position: 'MED' },
      { id: 'ip8', name: 'Juan Godoy', number: 9, position: 'DEL' },
      { id: 'ip9', name: 'Bastián García', number: 11, position: 'DEL' },
      { id: 'ip10', name: 'Miguel Quiroga', number: 7, position: 'MED' },
      { id: 'ip11', name: 'Rodrigo Ávila', number: 4, position: 'DEF' }
    ]
  },
  {
    id: 'real-oruro',
    name: 'Real Oruro',
    shortName: 'REAL ORURO',
    category: 'bolivia',
    primaryColor: '#dc2626',
    secondaryColor: '#facc15',
    accentColor: '#ffffff',
    city: 'Oruro',
    stadium: 'Estadio Jesús Bermúdez',
    founded: '2008',
    coach: 'Daniel Gómez',
    nickname: 'Los Leones del Sajama',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Escudo_Club_Gualberto_Villarroel_San_Jos%C3%A9.png/280px-Escudo_Club_Gualberto_Villarroel_San_Jos%C3%A9.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Golden Crown -->
      <path d="M26 18 L34 26 L50 12 L66 26 L74 18 L76 30 L24 30 Z" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="50" cy="12" r="2.5" fill="#fef08a"/>
      <circle cx="26" cy="18" r="2" fill="#fef08a"/>
      <circle cx="74" cy="18" r="2" fill="#fef08a"/>
      <!-- Red Shield -->
      <path d="M50 28 L86 36 L86 78 C86 102 50 116 50 116 C50 116 14 102 14 78 L14 36 Z" fill="#b91c1c" stroke="#eab308" stroke-width="3"/>
      <!-- Header Banner -->
      <polygon points="16,36 84,36 84,46 50,72 16,46" fill="#eab308"/>
      <text x="50" y="44" text-anchor="middle" fill="#000000" font-family="Arial Black, sans-serif" font-weight="900" font-size="6.5">REAL ORURO</text>
      <!-- Golden V letter -->
      <path d="M34 56 L50 94 L66 56 L56 56 L50 78 L44 56 Z" fill="#fef08a"/>
    </svg>`,
    squad: [
      { id: 'ro1', name: 'Junior Peña', number: 1, position: 'POR' },
      { id: 'ro2', name: 'Iván Huayhuata', number: 5, position: 'DEF', isCaptain: true },
      { id: 'ro3', name: 'Carlos Balcázar', number: 4, position: 'DEF' },
      { id: 'ro4', name: 'Alejandro Morales', number: 2, position: 'DEF' },
      { id: 'ro5', name: 'Juan Carlos Gómez', number: 8, position: 'MED' },
      { id: 'ro6', name: 'Yony Angulo', number: 9, position: 'DEL' },
      { id: 'ro7', name: 'Luis Alí', number: 11, position: 'DEL' },
      { id: 'ro8', name: 'Pedro Moreira', number: 10, position: 'MED' },
      { id: 'ro9', name: 'Ricardo Orihuela', number: 7, position: 'MED' },
      { id: 'ro10', name: 'Marcos Barrera', number: 3, position: 'DEF' },
      { id: 'ro11', name: 'Raúl Becerra', number: 19, position: 'DEL' }
    ]
  },
  {
    id: 'abb',
    name: 'Academia del Balompié Boliviano (ABB)',
    shortName: 'A.B.B.',
    category: 'bolivia',
    primaryColor: '#facc15',
    secondaryColor: '#1e3a8a',
    accentColor: '#ffffff',
    city: 'La Paz',
    stadium: 'Estadio Hernando Siles',
    founded: '1985',
    coach: 'Luis Mollinedo',
    nickname: 'Los Académicos Amarillos',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Academia_del_Balompi%C3%A9_Boliviano.png/280px-Academia_del_Balompi%C3%A9_Boliviano.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#facc15" stroke="#1e3a8a" stroke-width="4"/>
      <circle cx="50" cy="58" r="22" fill="#1e3a8a" stroke="#ffffff" stroke-width="2"/>
      <text x="50" y="63" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="10">A.B.B.</text>
    </svg>`,
    squad: [
      { id: 'abb1', name: 'Mauricio Adorno', number: 1, position: 'POR' },
      { id: 'abb2', name: 'Álvaro Quiroga', number: 2, position: 'DEF' },
      { id: 'abb3', name: 'Jorge Toco', number: 3, position: 'DEF', isCaptain: true },
      { id: 'abb4', name: 'Christian Fernández', number: 4, position: 'DEF' },
      { id: 'abb5', name: 'Jehaner Céspedes', number: 8, position: 'MED' },
      { id: 'abb6', name: 'Gery Rojas', number: 10, position: 'MED' },
      { id: 'abb7', name: 'Gary Rea', number: 11, position: 'DEL' },
      { id: 'abb8', name: 'Kevin Romay', number: 9, position: 'DEL' },
      { id: 'abb9', name: 'Brian Hinojosa', number: 7, position: 'MED' },
      { id: 'abb10', name: 'Matías Romero', number: 5, position: 'MED' },
      { id: 'abb11', name: 'Diego Paz', number: 17, position: 'DEL' }
    ]
  },
  {
    id: 'real-potosi',
    name: 'Real Potosí',
    shortName: 'REAL POTOSÍ',
    category: 'bolivia',
    primaryColor: '#7c3aed',
    secondaryColor: '#ffffff',
    accentColor: '#facc15',
    city: 'Potosí',
    stadium: 'Estadio Víctor Agustín Ugarte',
    founded: '1988',
    coach: 'Cleibson Ferreira',
    nickname: 'El León Imperial / Los Lilas',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Club_Real_Potos%C3%AD.png/280px-Club_Real_Potos%C3%AD.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 16 L36 6 L50 14 L64 6 L70 16 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <path d="M50 18 L90 30 L90 78 Q50 115 50 115 Q10 78 10 30 Z" fill="#6d28d9" stroke="#ffffff" stroke-width="3"/>
      <circle cx="50" cy="62" r="20" fill="#ffffff" stroke="#facc15" stroke-width="2"/>
      <text x="50" y="65" text-anchor="middle" fill="#6d28d9" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">REAL POTOSÍ</text>
    </svg>`,
    squad: [
      { id: 'rp1', name: 'Carlos López', number: 1, position: 'POR' },
      { id: 'rp2', name: 'Ronald Eguino', number: 2, position: 'DEF', isCaptain: true },
      { id: 'rp3', name: 'Douglas Ferrufino', number: 3, position: 'DEF' },
      { id: 'rp4', name: 'Aldo Gallardo', number: 4, position: 'DEF' },
      { id: 'rp5', name: 'Dino Huallpa', number: 8, position: 'MED' },
      { id: 'rp6', name: 'Gerardo Yecerotte', number: 11, position: 'DEL' },
      { id: 'rp7', name: 'Maximiliano Gómez', number: 10, position: 'MED' },
      { id: 'rp8', name: 'Bismark Ubah', number: 9, position: 'DEL' },
      { id: 'rp9', name: 'Luis Garnica', number: 7, position: 'MED' },
      { id: 'rp10', name: 'Rodrigo Borda', number: 14, position: 'MED' },
      { id: 'rp11', name: 'Christian Bekamenga', number: 19, position: 'DEL' }
    ]
  },

  // --- CONMEBOL GIANTS ---
  {
    id: 'boca-juniors',
    name: 'Boca Juniors',
    shortName: 'BOCA',
    category: 'conmebol',
    primaryColor: '#1d4ed8',
    secondaryColor: '#facc15',
    accentColor: '#002875',
    city: 'Buenos Aires',
    stadium: 'Estadio Alberto J. Armando (La Bombonera)',
    founded: '1905',
    coach: 'Diego Martínez',
    nickname: 'Xeneize',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boca_Juniors_logo18.svg/280px-Boca_Juniors_logo18.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#1e3a8a" stroke="#facc15" stroke-width="4"/>
      <rect x="10" y="42" width="80" height="26" fill="#facc15" />
      <text x="50" y="60" text-anchor="middle" fill="#1e3a8a" font-family="Arial Black, sans-serif" font-weight="900" font-size="12">CABJ</text>
    </svg>`,
    squad: [
      { id: 'bj1', name: 'Sergio Romero', number: 1, position: 'POR' },
      { id: 'bj2', name: 'Luis Advíncula', number: 17, position: 'DEF' },
      { id: 'bj3', name: 'Cristian Lema', number: 2, position: 'DEF' },
      { id: 'bj4', name: 'Marcos Rojo', number: 6, position: 'DEF', isCaptain: true },
      { id: 'bj5', name: 'Lautaro Blanco', number: 23, position: 'DEF' },
      { id: 'bj6', name: 'Cristian Medina', number: 36, position: 'MED' },
      { id: 'bj7', name: 'Pol Fernández', number: 8, position: 'MED' },
      { id: 'bj8', name: 'Kevin Zenón', number: 22, position: 'MED' },
      { id: 'bj9', name: 'Edinson Cavani', number: 10, position: 'DEL' },
      { id: 'bj10', name: 'Miguel Merentiel', number: 16, position: 'DEL' },
      { id: 'bj11', name: 'Milton Giménez', number: 9, position: 'DEL' }
    ]
  },
  {
    id: 'river-plate',
    name: 'River Plate',
    shortName: 'RIVER',
    category: 'conmebol',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    city: 'Buenos Aires',
    stadium: 'Estadio Monumental',
    founded: '1901',
    coach: 'Marcelo Gallardo',
    nickname: 'El Millonario',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Club_Atl%C3%A9tico_River_Plate_crest.svg/280px-Club_Atl%C3%A9tico_River_Plate_crest.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#ffffff" stroke="#000000" stroke-width="4"/>
      <polygon points="12,22 88,85 88,102 12,39" fill="#dc2626" />
      <circle cx="50" cy="62" r="16" fill="#ffffff" stroke="#000000" stroke-width="2"/>
      <text x="50" y="68" text-anchor="middle" fill="#000000" font-family="Arial Black, sans-serif" font-weight="900" font-size="10">CARP</text>
    </svg>`,
    squad: [
      { id: 'rp1', name: 'Franco Armani', number: 1, position: 'POR', isCaptain: true },
      { id: 'rp2', name: 'Fabricio Bustos', number: 16, position: 'DEF' },
      { id: 'rp3', name: 'Germán Pezzella', number: 6, position: 'DEF' },
      { id: 'rp4', name: 'Paulo Díaz', number: 17, position: 'DEF' },
      { id: 'rp5', name: 'Marcos Acuña', number: 24, position: 'DEF' },
      { id: 'rp6', name: 'Matías Kranevitter', number: 5, position: 'MED' },
      { id: 'rp7', name: 'Santiago Simón', number: 31, position: 'MED' },
      { id: 'rp8', name: 'Ignacio Fernández', number: 26, position: 'MED' },
      { id: 'rp9', name: 'Maximiliano Meza', number: 8, position: 'MED' },
      { id: 'rp10', name: 'Facundo Colidio', number: 11, position: 'DEL' },
      { id: 'rp11', name: 'Miguel Borja', number: 9, position: 'DEL' }
    ]
  },
  {
    id: 'flamengo',
    name: 'Flamengo',
    shortName: 'FLAMENGO',
    category: 'conmebol',
    primaryColor: '#dc2626',
    secondaryColor: '#000000',
    accentColor: '#ffffff',
    city: 'Rio de Janeiro',
    stadium: 'Estadio Maracanã',
    founded: '1895',
    coach: 'Filipe Luís',
    nickname: 'Mengão / Rubro-Negro',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/280px-Flamengo_braz_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L90 20 L90 75 Q50 115 50 115 Q10 75 10 20 Z" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
      <rect x="10" y="30" width="80" height="12" fill="#09090b" />
      <rect x="10" y="55" width="80" height="12" fill="#09090b" />
      <text x="50" y="24" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="11">CRF</text>
    </svg>`,
    squad: [
      { id: 'fla1', name: 'Agustín Rossi', number: 1, position: 'POR' },
      { id: 'fla2', name: 'Guillermo Varela', number: 2, position: 'DEF' },
      { id: 'fla3', name: 'Fabrício Bruno', number: 15, position: 'DEF' },
      { id: 'fla4', name: 'Léo Pereira', number: 4, position: 'DEF' },
      { id: 'fla5', name: 'Ayrton Lucas', number: 6, position: 'DEF' },
      { id: 'fla6', name: 'Erick Pulgar', number: 5, position: 'MED' },
      { id: 'fla7', name: 'Nicolás De La Cruz', number: 18, position: 'MED' },
      { id: 'fla8', name: 'Giorgian De Arrascaeta', number: 14, position: 'MED', isCaptain: true },
      { id: 'fla9', name: 'Gerson', number: 8, position: 'MED' },
      { id: 'fla10', name: 'Bruno Henrique', number: 27, position: 'DEL' },
      { id: 'fla11', name: 'Gabriel Barbosa', number: 99, position: 'DEL' }
    ]
  },
  {
    id: 'palmeiras',
    name: 'Palmeiras',
    shortName: 'PALMEIRAS',
    category: 'conmebol',
    primaryColor: '#047857',
    secondaryColor: '#ffffff',
    accentColor: '#065f46',
    city: 'São Paulo',
    stadium: 'Allianz Parque',
    founded: '1914',
    coach: 'Abel Ferreira',
    nickname: 'Verdão / Alviverde',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/280px-Palmeiras_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="48" fill="#047857" stroke="#ffffff" stroke-width="4"/>
      <circle cx="50" cy="60" r="34" fill="#ffffff"/>
      <text x="50" y="66" text-anchor="middle" fill="#047857" font-family="Arial Black, sans-serif" font-weight="900" font-size="16">P</text>
    </svg>`,
    squad: [
      { id: 'pal1', name: 'Weverton', number: 21, position: 'POR' },
      { id: 'pal2', name: 'Marcos Rocha', number: 2, position: 'DEF' },
      { id: 'pal3', name: 'Gustavo Gómez', number: 15, position: 'DEF', isCaptain: true },
      { id: 'pal4', name: 'Murilo', number: 26, position: 'DEF' },
      { id: 'pal5', name: 'Joaquín Piquerez', number: 22, position: 'DEF' },
      { id: 'pal6', name: 'Aníbal Moreno', number: 5, position: 'MED' },
      { id: 'pal7', name: 'Zé Rafael', number: 8, position: 'MED' },
      { id: 'pal8', name: 'Raphael Veiga', number: 23, position: 'MED' },
      { id: 'pal9', name: 'Maurício', number: 18, position: 'MED' },
      { id: 'pal10', name: 'Estêvão', number: 41, position: 'DEL' },
      { id: 'pal11', name: 'Flaco López', number: 42, position: 'DEL' }
    ]
  },

  // --- INTERNATIONAL ELITE ---
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    shortName: 'REAL MADRID',
    category: 'international',
    primaryColor: '#ffffff',
    secondaryColor: '#3b82f6',
    accentColor: '#facc15',
    city: 'Madrid',
    stadium: 'Estadio Santiago Bernabéu',
    founded: '1902',
    coach: 'Carlo Ancelotti',
    nickname: 'Los Merengues / Los Blancos',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Real_Madrid_Club_de_F%C3%BAtbol_logo.svg/280px-Real_Madrid_Club_de_F%C3%BAtbol_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 18 L36 8 L50 16 L64 8 L70 18 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="50" cy="65" r="40" fill="#ffffff" stroke="#facc15" stroke-width="5"/>
      <polygon points="25,45 75,85 70,90 20,50" fill="#6366f1" />
      <text x="50" y="72" text-anchor="middle" fill="#facc15" font-family="Arial Black, sans-serif" font-weight="900" font-size="14">MCF</text>
    </svg>`,
    squad: [
      { id: 'rm1', name: 'Thibaut Courtois', number: 1, position: 'POR' },
      { id: 'rm2', name: 'Dani Carvajal', number: 2, position: 'DEF' },
      { id: 'rm3', name: 'Éder Militão', number: 3, position: 'DEF' },
      { id: 'rm4', name: 'Antonio Rüdiger', number: 22, position: 'DEF' },
      { id: 'rm5', name: 'Ferland Mendy', number: 23, position: 'DEF' },
      { id: 'rm6', name: 'Federico Valverde', number: 8, position: 'MED' },
      { id: 'rm7', name: 'Aurélien Tchouaméni', number: 14, position: 'MED' },
      { id: 'rm8', name: 'Jude Bellingham', number: 5, position: 'MED' },
      { id: 'rm9', name: 'Rodrygo', number: 11, position: 'DEL' },
      { id: 'rm10', name: 'Vinícius Júnior', number: 7, position: 'DEL' },
      { id: 'rm11', name: 'Kylian Mbappé', number: 9, position: 'DEL' },
      { id: 'rm12', name: 'Luka Modrić', number: 10, position: 'MED', isCaptain: true }
    ]
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BARCELONA',
    category: 'international',
    primaryColor: '#1e3a8a',
    secondaryColor: '#dc2626',
    accentColor: '#facc15',
    city: 'Barcelona',
    stadium: 'Spotify Camp Nou / Montjuïc',
    founded: '1899',
    coach: 'Hansi Flick',
    nickname: 'Culers / Blaugrana',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/FC_Barcelona_%28crest%29.svg/280px-FC_Barcelona_%28crest%29.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 5 L88 20 L88 65 Q50 115 50 115 Q12 65 12 20 Z" fill="#ffffff" stroke="#facc15" stroke-width="4"/>
      <path d="M12 55 L88 55 L88 65 Q50 115 50 115 Q12 65 12 55 Z" fill="#1e3a8a" />
      <rect x="36" y="55" width="10" height="55" fill="#dc2626" />
      <rect x="54" y="55" width="10" height="55" fill="#dc2626" />
      <rect x="12" y="44" width="76" height="12" fill="#facc15" />
      <text x="50" y="53" text-anchor="middle" fill="#1e3a8a" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">FCB</text>
    </svg>`,
    squad: [
      { id: 'fcb1', name: 'Marc-André ter Stegen', number: 1, position: 'POR', isCaptain: true },
      { id: 'fcb2', name: 'Jules Koundé', number: 23, position: 'DEF' },
      { id: 'fcb3', name: 'Pau Cubarsí', number: 2, position: 'DEF' },
      { id: 'fcb4', name: 'Iñigo Martínez', number: 5, position: 'DEF' },
      { id: 'fcb5', name: 'Alejandro Balde', number: 3, position: 'DEF' },
      { id: 'fcb6', name: 'Marc Casadó', number: 17, position: 'MED' },
      { id: 'fcb7', name: 'Pedri', number: 8, position: 'MED' },
      { id: 'fcb8', name: 'Dani Olmo', number: 20, position: 'MED' },
      { id: 'fcb9', name: 'Lamine Yamal', number: 19, position: 'DEL' },
      { id: 'fcb10', name: 'Raphinha', number: 11, position: 'DEL' },
      { id: 'fcb11', name: 'Robert Lewandowski', number: 9, position: 'DEL' }
    ]
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    shortName: 'MAN. CITY',
    category: 'international',
    primaryColor: '#38bdf8',
    secondaryColor: '#1e3a8a',
    accentColor: '#ffffff',
    city: 'Manchester',
    stadium: 'Etihad Stadium',
    founded: '1894',
    coach: 'Pep Guardiola',
    nickname: 'The Citizens / Sky Blues',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Manchester_City_FC_badge.svg/280px-Manchester_City_FC_badge.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="48" fill="#ffffff" stroke="#1e3a8a" stroke-width="4"/>
      <circle cx="50" cy="60" r="42" fill="#38bdf8" />
      <text x="50" y="55" text-anchor="middle" fill="#1e3a8a" font-family="Arial, sans-serif" font-weight="900" font-size="7">MANCHESTER</text>
      <text x="50" y="68" text-anchor="middle" fill="#1e3a8a" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">CITY</text>
    </svg>`,
    squad: [
      { id: 'mc1', name: 'Ederson', number: 31, position: 'POR' },
      { id: 'mc2', name: 'Kyle Walker', number: 2, position: 'DEF', isCaptain: true },
      { id: 'mc3', name: 'Rúben Dias', number: 3, position: 'DEF' },
      { id: 'mc4', name: 'Manuel Akanji', number: 25, position: 'DEF' },
      { id: 'mc5', name: 'Josko Gvardiol', number: 24, position: 'DEF' },
      { id: 'mc6', name: 'Rodri', number: 16, position: 'MED' },
      { id: 'mc7', name: 'Bernardo Silva', number: 20, position: 'MED' },
      { id: 'mc8', name: 'Kevin De Bruyne', number: 17, position: 'MED' },
      { id: 'mc9', name: 'Phil Foden', number: 47, position: 'DEL' },
      { id: 'mc10', name: 'Savinho', number: 26, position: 'DEL' },
      { id: 'mc11', name: 'Erling Haaland', number: 9, position: 'DEL' }
    ]
  },
  {
    id: 'inter-miami',
    name: 'Inter Miami CF',
    shortName: 'INTER MIAMI',
    category: 'international',
    primaryColor: '#f472b6',
    secondaryColor: '#09090b',
    accentColor: '#ffffff',
    city: 'Miami',
    stadium: 'Chase Stadium',
    founded: '2018',
    coach: 'Gerardo Martino',
    nickname: 'Las Garzas / The Herons',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Inter_Miami_CF_logo.svg/280px-Inter_Miami_CF_logo.svg.png',
    badgeSvg: `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="48" fill="#09090b" stroke="#f472b6" stroke-width="4"/>
      <text x="50" y="55" text-anchor="middle" fill="#f472b6" font-family="Arial, sans-serif" font-weight="900" font-size="7">INTER MIAMI</text>
      <text x="50" y="68" text-anchor="middle" fill="#ffffff" font-family="Arial Black, sans-serif" font-weight="900" font-size="8">MMXX</text>
    </svg>`,
    squad: [
      { id: 'im1', name: 'Drake Callender', number: 1, position: 'POR' },
      { id: 'im2', name: 'Marcelo Weigandt', number: 57, position: 'DEF' },
      { id: 'im3', name: 'Tomás Avilés', number: 6, position: 'DEF' },
      { id: 'im4', name: 'Nicolás Freire', number: 21, position: 'DEF' },
      { id: 'im5', name: 'Jordi Alba', number: 18, position: 'DEF' },
      { id: 'im6', name: 'Sergio Busquets', number: 5, position: 'MED' },
      { id: 'im7', name: 'Federico Redondo', number: 55, position: 'MED' },
      { id: 'im8', name: 'Julian Gressel', number: 24, position: 'MED' },
      { id: 'im9', name: 'Diego Gómez', number: 20, position: 'MED' },
      { id: 'im10', name: 'Lionel Messi', number: 10, position: 'DEL', isCaptain: true },
      { id: 'im11', name: 'Luis Suárez', number: 9, position: 'DEL' }
    ]
  }
];

export function getClubById(id: string): Club {
  return CLUBS.find(c => c.id === id) || CLUBS[0];
}
