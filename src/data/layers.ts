import { TemplateType } from './templates';

export interface CanvasLayer {
  id: string;
  name: string;
  category: 'frame' | 'header' | 'title' | 'content' | 'footer' | 'custom';
  x: number; // offset in px
  y: number; // offset in px
  zIndex: number; // stacking order
  opacity: number; // 0.0 to 1.0
  isLocked: boolean; // if true, cannot be dragged
  isVisible: boolean; // if false, hidden
  customText?: string;
  customImageUrl?: string;
}

export const DEFAULT_FIXTURE_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-frame',
    name: 'Marco Clásico con Muescas',
    category: 'frame',
    x: 0,
    y: 0,
    zIndex: 10,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-sponsor-top',
    name: 'Logo Patrocinador Superior (Entel)',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-crest',
    name: 'Emblema Trofeo del Torneo',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 22,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-title',
    name: 'Título FIXTURE (Trazo Hueco)',
    category: 'title',
    x: 0,
    y: 0,
    zIndex: 25,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-subtitles',
    name: 'Subtítulos Fecha y Rango de Días',
    category: 'title',
    x: 0,
    y: 0,
    zIndex: 24,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-card-top',
    name: 'Tarjeta Superior (Martes y Miércoles)',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-card-bottom',
    name: 'Tarjeta Inferior (Jueves)',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 31,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Barra Inferior de Transmisión (Canal / App)',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export const DEFAULT_VERSUS_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-header',
    name: 'Cabecera y Estado EN VIVO',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-tournament',
    name: 'Insignia del Torneo',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 22,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-title',
    name: 'Título de la Fecha / Ronda',
    category: 'title',
    x: 0,
    y: 0,
    zIndex: 24,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-club-home',
    name: 'Escudo y Nombre Local',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-vs',
    name: 'Insignia VS / Choque Central',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 32,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-club-away',
    name: 'Escudo y Nombre Visitante',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-match-info',
    name: 'Caja de Estadio, Ciudad y Árbitro',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 35,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Barra Inferior de Transmisión',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export const DEFAULT_LINEUP_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-header',
    name: 'Cabecera Alineación Confirmada',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-club-info',
    name: 'Escudo, Nombre del Club y DT',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 25,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-pitch',
    name: 'Cancha y 11 Titulares',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-bench',
    name: 'Banquillo de Suplentes',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 32,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Pie de Redes y Canal',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export const DEFAULT_GOAL_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-header',
    name: 'Cabecera de Gol y Minuto',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-player-name',
    name: 'Nombre del Goleador',
    category: 'title',
    x: 0,
    y: 0,
    zIndex: 25,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-scoreboard',
    name: 'Marcador del Partido',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Barra Inferior de Transmisión',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export const DEFAULT_RESULT_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-header',
    name: 'Cabecera Resultado Final',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-tournament',
    name: 'Insignia del Torneo',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 22,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-scoreboard',
    name: 'Marcador y Escudos',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-scorers',
    name: 'Goleadores del Encuentro',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 35,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Barra Inferior de Transmisión',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export const DEFAULT_STANDINGS_LAYERS: CanvasLayer[] = [
  {
    id: 'layer-header',
    name: 'Cabecera de Tabla y Torneo',
    category: 'header',
    x: 0,
    y: 0,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-table',
    name: 'Filas de la Tabla de Posiciones',
    category: 'content',
    x: 0,
    y: 0,
    zIndex: 30,
    opacity: 1,
    isLocked: false,
    isVisible: true
  },
  {
    id: 'layer-broadcast-bar',
    name: 'Leyenda de Zona de Copas y Canal',
    category: 'footer',
    x: 0,
    y: 0,
    zIndex: 40,
    opacity: 1,
    isLocked: false,
    isVisible: true
  }
];

export function getDefaultLayersForTemplate(type: TemplateType): CanvasLayer[] {
  switch (type) {
    case 'fixture':
      return DEFAULT_FIXTURE_LAYERS.map(l => ({ ...l }));
    case 'versus':
      return DEFAULT_VERSUS_LAYERS.map(l => ({ ...l }));
    case 'result':
      return DEFAULT_RESULT_LAYERS.map(l => ({ ...l }));
    case 'lineup':
      return DEFAULT_LINEUP_LAYERS.map(l => ({ ...l }));
    case 'goal':
      return DEFAULT_GOAL_LAYERS.map(l => ({ ...l }));
    case 'standings':
      return DEFAULT_STANDINGS_LAYERS.map(l => ({ ...l }));
    default:
      return DEFAULT_FIXTURE_LAYERS.map(l => ({ ...l }));
  }
}
