import { TemplateData } from './templates';
import { CanvasLayer } from './layers';

/** Complete editor state persisted for cross-device restoration. */
export interface WorkspaceSnapshot {
  data: TemplateData;
  layersByTemplate: Record<string, CanvasLayer[]>;
}
