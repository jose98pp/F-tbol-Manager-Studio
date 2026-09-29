import { TemplateData, INITIAL_TEMPLATE_DATA, TemplateType } from './templates';

export interface SavedTemplatePreset {
  id: string;
  name: string;
  description: string;
  category: 'previa' | 'alineacion' | 'gol' | 'resultado' | 'resumen';
  type: TemplateType;
  badgeTag: string;
  previewColor: string;
  data: TemplateData;
  isCustom?: boolean;
  createdAt?: string;
}

export const DEFAULT_SAVED_PRESETS: SavedTemplatePreset[] = [
  {
    id: 'preset-previa-clasico',
    name: 'Previa de Clásico Paceño',
    description: 'Diseño para partidos estelares con contador de horas, estadio y designación arbitral.',
    category: 'previa',
    type: 'versus',
    badgeTag: 'MATCHDAY PREVIA',
    previewColor: 'from-amber-500 to-red-600',
    data: {
      ...INITIAL_TEMPLATE_DATA,
      type: 'versus',
      competitionId: 'copa-pacena',
      tournament: 'Copa Paceña 2026',
      roundTitle: 'SUPERCLÁSICO BOLIVIANO',
      dateRange: 'DOMINGO • 17:30 BOT',
      singleMatch: {
        ...INITIAL_TEMPLATE_DATA.singleMatch,
        homeClubId: 'bolivar',
        awayClubId: 'the-strongest',
        matchTime: '17:30 BOT',
        stadium: 'Estadio Hernando Siles, La Paz',
        referee: 'Gery Vargas',
        statusBadge: 'CLÁSICO PACEÑO'
      }
    }
  },
  {
    id: 'preset-alineacion-tactica',
    name: '11 Titular Táctico (4-3-3)',
    description: 'Pizarra táctica con 11 jugadores en cancha, dorsales, capitán y banca de suplentes.',
    category: 'alineacion',
    type: 'lineup',
    badgeTag: 'ALINEACIÓN OFICIAL',
    previewColor: 'from-emerald-500 to-teal-700',
    data: {
      ...INITIAL_TEMPLATE_DATA,
      type: 'lineup',
      competitionId: 'liga-tecno',
      tournament: 'Liga Tecno Boliviana',
      lineup: {
        ...INITIAL_TEMPLATE_DATA.lineup,
        clubId: 'bolivar',
        formation: '4-3-3',
        coach: 'Flavio Robatto'
      }
    }
  },
  {
    id: 'preset-gol-explosivo',
    name: '¡GOL! Fuego y Neón',
    description: 'Celebración instantánea con club que anota, dorsal, minuto del gol y asistente.',
    category: 'gol',
    type: 'goal',
    badgeTag: 'GRITO DE GOL',
    previewColor: 'from-yellow-400 to-amber-600',
    data: {
      ...INITIAL_TEMPLATE_DATA,
      type: 'goal',
      competitionId: 'copa-pacena',
      goal: {
        ...INITIAL_TEMPLATE_DATA.goal,
        scoringClubId: 'bolivar',
        opponentClubId: 'the-strongest',
        playerName: 'RAMIRO VACA',
        playerNumber: 10,
        minute: "38'",
        goalType: '¡GOLAZO!',
        homeScore: 1,
        awayScore: 0,
        assistBy: 'Patricio Rodríguez'
      }
    }
  },
  {
    id: 'preset-resultado-final',
    name: 'Marcador & Estadísticas Finales',
    description: 'Cierre del encuentro con goles, posesión de balón, tiros al arco y tarjetas.',
    category: 'resultado',
    type: 'result',
    badgeTag: 'FINAL DEL PARTIDO',
    previewColor: 'from-blue-600 to-indigo-900',
    data: {
      ...INITIAL_TEMPLATE_DATA,
      type: 'result',
      competitionId: 'copa-pacena',
      singleMatch: {
        ...INITIAL_TEMPLATE_DATA.singleMatch,
        homeClubId: 'bolivar',
        awayClubId: 'the-strongest',
        homeScore: 2,
        awayScore: 1,
        scorers: [
          { id: 'sc-1', team: 'home', player: 'Ramiro Vaca', minute: "38'" },
          { id: 'sc-2', team: 'away', player: 'Michael Ortega', minute: "62'" },
          { id: 'sc-3', team: 'home', player: 'Bruno Sávio', minute: "84'" }
        ],
        stats: {
          possessionHome: 56,
          possessionAway: 44,
          shotsHome: 15,
          shotsAway: 9,
          shotsOnTargetHome: 7,
          shotsOnTargetAway: 4,
          cornersHome: 8,
          cornersAway: 3,
          foulsHome: 12,
          foulsAway: 16,
          yellowCardsHome: 2,
          yellowCardsAway: 4,
          redCardsHome: 0,
          redCardsAway: 1
        }
      }
    }
  },
  {
    id: 'preset-resumen-fixture',
    name: 'Cartelera de Toda la Fecha',
    description: 'Resumen completo de partidos de la jornada con marco tradicional y muescas.',
    category: 'resumen',
    type: 'fixture',
    badgeTag: 'FIXTURE COMPLETO',
    previewColor: 'from-slate-700 to-slate-950',
    data: {
      ...INITIAL_TEMPLATE_DATA,
      type: 'fixture',
      competitionId: 'copa-pacena',
      tournament: 'Copa Paceña 2026',
      roundTitle: 'FECHA 6 - FASE DE GRUPOS',
      dateRange: 'VIERNES 26 AL DOMINGO 28'
    }
  }
];

const LOCAL_STORAGE_CUSTOM_PRESETS_KEY = 'futbol_banner_custom_presets_v1';

export function getCustomPresets(): SavedTemplatePreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading custom presets:', e);
    return [];
  }
}

export function saveCustomPreset(preset: Omit<SavedTemplatePreset, 'id' | 'isCustom' | 'createdAt'>): SavedTemplatePreset {
  const customList = getCustomPresets();
  const newPreset: SavedTemplatePreset = {
    ...preset,
    id: `custom-preset-${Date.now()}`,
    isCustom: true,
    createdAt: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
  };
  const updated = [newPreset, ...customList];
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_PRESETS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom preset:', e);
  }
  return newPreset;
}

export function deleteCustomPreset(id: string): void {
  const customList = getCustomPresets();
  const updated = customList.filter(p => p.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_PRESETS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting custom preset:', e);
  }
}
