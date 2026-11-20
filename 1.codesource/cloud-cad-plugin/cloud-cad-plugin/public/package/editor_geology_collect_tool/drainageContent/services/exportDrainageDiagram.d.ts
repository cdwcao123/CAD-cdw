import type { DrainageDiagramExportSnapshot } from '../types/interface';
/** 固定当前预览副本，独立数据库只写预览实体；正图和预览均不参与入库/删除。 */
export declare function exportDrainageDiagram(snapshot: DrainageDiagramExportSnapshot, title: string): Promise<void>;
