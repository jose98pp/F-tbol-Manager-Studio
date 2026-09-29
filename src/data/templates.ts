import { Player, getClubById } from './clubs';

export type TemplateType = 'fixture' | 'versus' | 'result' | 'standings' | 'lineup' | 'goal';

export interface FixtureMatch {
  id: string;
  day: string; // e.g. "MARTES", "MIÉRCOLES", "JUEVES"
  homeClubId: string;
  awayClubId: string;
  dateStr: string; // "MAR 29 / 15:00"
  stadium?: string;
  time?: string;
  homeScore?: number;
  awayScore?: number;
  status?: string; // "15:00", "EN VIVO", "FIN"
}

export interface GoalScorer {
  id: string;
  team: 'home' | 'away';
  player: string;
  minute: string;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export interface MatchStats {
  possessionHome: number; // e.g. 58
  possessionAway: number; // 42
  shotsHome: number;
  shotsAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  redCardsHome: number;
  redCardsAway: number;
}

export interface StandingRow {
  position: number;
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface LineupData {
  clubId: string;
  formation: '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2';
  coach: string;
  starters: Player[];
  substitutes: Player[];
}

export interface GoalBannerData {
  scoringClubId: string;
  opponentClubId: string;
  playerName: string;
  playerNumber: number;
  minute: string; // "67'"
  goalType: '¡GOLAZO!' | 'GOL DE PENAL' | 'TIRO LIBRE' | 'CABEZAZO' | 'GOL';
  homeScore: number;
  awayScore: number;
  assistBy?: string;
}

export interface TemplateData {
  type: TemplateType;
  competitionId: string;
  tournament: string;
  roundTitle: string;
  dateRange: string;
  stadiumTheme?: 'stadium-night' | 'libertadores-gold' | 'champions-blue' | 'cyber-esports' | 'copa-pacena';
  
  // Single match data
  singleMatch: {
    homeClubId: string;
    awayClubId: string;
    homeScore: number;
    awayScore: number;
    matchTime: string;
    statusBadge: string;
    stadium: string;
    city: string;
    referee: string;
    scorers: GoalScorer[];
    stats: MatchStats;
  };

  // Lineup 11 data
  lineup: LineupData;

  // Goal celebration banner data
  goal: GoalBannerData;

  // Fixture list data
  fixtureMatches: FixtureMatch[];

  // Standings data
  standings: StandingRow[];

  highlightHeadline: string;
  highlightSub: string;
}

const defaultBolivarSquad = getClubById('bolivar').squad || [];

export const INITIAL_TEMPLATE_DATA: TemplateData = {
  type: 'fixture',
  competitionId: 'copa-pacena',
  tournament: 'COPA PACEÑA',
  roundTitle: 'FECHA 6',
  dateRange: '29 SEP/ 01 OCT',
  stadiumTheme: 'copa-pacena',
  singleMatch: {
    homeClubId: 'bolivar',
    awayClubId: 'the-strongest',
    homeScore: 3,
    awayScore: 1,
    matchTime: 'HOY 20:00',
    statusBadge: 'CLÁSICO PACEÑO',
    stadium: 'Estadio Hernando Siles',
    city: 'La Paz, Bolivia',
    referee: 'Gery Vargas',
    scorers: [
      { id: '1', team: 'home', player: 'Ramiro Vaca', minute: "24'" },
      { id: '2', team: 'away', player: 'Enrique Triverio', minute: "42'" },
      { id: '3', team: 'home', player: 'Bruno Sávio', minute: "67'" },
      { id: '4', team: 'home', player: 'Patricio Rodríguez', minute: "89'" },
    ],
    stats: {
      possessionHome: 56,
      possessionAway: 44,
      shotsHome: 14,
      shotsAway: 9,
      shotsOnTargetHome: 7,
      shotsOnTargetAway: 3,
      cornersHome: 6,
      cornersAway: 4,
      foulsHome: 12,
      foulsAway: 16,
      yellowCardsHome: 2,
      yellowCardsAway: 3,
      redCardsHome: 0,
      redCardsAway: 1,
    }
  },
  lineup: {
    clubId: 'bolivar',
    formation: '4-3-3',
    coach: 'Flavio Robatto',
    starters: defaultBolivarSquad.slice(0, 11),
    substitutes: defaultBolivarSquad.slice(11, 16)
  },
  goal: {
    scoringClubId: 'bolivar',
    opponentClubId: 'the-strongest',
    playerName: 'RAMIRO VACA',
    playerNumber: 10,
    minute: "24'",
    goalType: '¡GOLAZO!',
    homeScore: 1,
    awayScore: 0,
    assistBy: 'Bruno Sávio'
  },
  fixtureMatches: [
    {
      id: 'f1',
      day: 'MARTES',
      homeClubId: 'universitario-vinto',
      awayClubId: 'guabira',
      dateStr: 'MAR 29 / 15:00',
      stadium: 'Hipólito Lazarte'
    },
    {
      id: 'f2',
      day: 'MARTES',
      homeClubId: 'real-potosi',
      awayClubId: 'abb',
      dateStr: 'MAR 29 / 18:00',
      stadium: 'Víctor Agustín Ugarte'
    },
    {
      id: 'f3',
      day: 'MARTES',
      homeClubId: 'aurora',
      awayClubId: 'san-antonio',
      dateStr: 'SAB 19 / 20:00',
      stadium: 'Félix Capriles'
    },
    {
      id: 'f4',
      day: 'MIÉRCOLES',
      homeClubId: 'real-oruro',
      awayClubId: 'always-ready',
      dateStr: 'MIÉ 30 / 15:00',
      stadium: 'Jesús Bermúdez'
    },
    {
      id: 'f5',
      day: 'MIÉRCOLES',
      homeClubId: 'real-tomayapo',
      awayClubId: 'nacional-potosi',
      dateStr: 'MIÉ 30 / 18:30',
      stadium: 'IV Centenario'
    },
    {
      id: 'f6',
      day: 'MIÉRCOLES',
      homeClubId: 'oriente-petrolero',
      awayClubId: 'the-strongest',
      dateStr: 'MIÉ 30 / 20:30',
      stadium: 'Tahuichi Aguilera'
    },
    {
      id: 'f7',
      day: 'JUEVES',
      homeClubId: 'bolivar',
      awayClubId: 'gv-san-jose',
      dateStr: 'JUE 01 / 18:30',
      stadium: 'Hernando Siles'
    },
    {
      id: 'f8',
      day: 'JUEVES',
      homeClubId: 'blooming',
      awayClubId: 'independiente-petrolero',
      dateStr: 'JUE 01 / 20:30',
      stadium: 'Tahuichi Aguilera'
    }
  ],
  standings: [
    { position: 1, clubId: 'bolivar', played: 14, won: 10, drawn: 2, lost: 2, goalsFor: 32, goalsAgainst: 12, points: 32 },
    { position: 2, clubId: 'the-strongest', played: 14, won: 9, drawn: 3, lost: 2, goalsFor: 28, goalsAgainst: 14, points: 30 },
    { position: 3, clubId: 'always-ready', played: 14, won: 7, drawn: 4, lost: 3, goalsFor: 24, goalsAgainst: 16, points: 25 },
    { position: 4, clubId: 'san-antonio', played: 14, won: 7, drawn: 3, lost: 4, goalsFor: 22, goalsAgainst: 18, points: 24 },
    { position: 5, clubId: 'aurora', played: 14, won: 6, drawn: 5, lost: 3, goalsFor: 20, goalsAgainst: 15, points: 23 },
    { position: 6, clubId: 'blooming', played: 14, won: 6, drawn: 4, lost: 4, goalsFor: 19, goalsAgainst: 17, points: 22 },
    { position: 7, clubId: 'oriente-petrolero', played: 14, won: 5, drawn: 4, lost: 5, goalsFor: 21, goalsAgainst: 22, points: 19 },
    { position: 8, clubId: 'wilstermann', played: 14, won: 4, drawn: 5, lost: 5, goalsFor: 18, goalsAgainst: 19, points: 17 }
  ],
  highlightHeadline: '¡TRANSMISIÓN EN VIVO!',
  highlightSub: 'DISFRUTA CADA JUGADA EN NUESTRO CANAL'
};
