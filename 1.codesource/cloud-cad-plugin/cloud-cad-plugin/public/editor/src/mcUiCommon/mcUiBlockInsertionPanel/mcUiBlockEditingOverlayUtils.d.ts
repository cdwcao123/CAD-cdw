import { McCore, McDbAttributeDef, McDbBlockDef } from 'McCore';
export interface BlockEditPerformanceMetrics {
    mode: 'legacy' | 'overlay';
    sourceEntityCount: number;
    blockEntityCount: number;
    blockAttributeCount: number;
    enterDurationMs: number;
    memoryBeforeMB: number | null;
    memoryAfterMB: number | null;
    templateExportMs?: number;
    templateLoadMs?: number;
    overlayInitMs?: number;
    mountDurationMs?: number;
}
export interface BlockEditOverlaySession {
    sourceCore: McCore;
    overlayCore: McCore;
    overlayHost: HTMLDivElement;
    overlayCanvasHost: HTMLDivElement;
    overlayBlockDef: McDbBlockDef;
    generatedEntityIds: Set<string>;
    entityIndexMap: Map<string, number>;
    tempAttributeIds: Set<string>;
    metrics: BlockEditPerformanceMetrics;
    destroy: () => void;
}
declare global {
    interface Window {
        __MC_BLOCK_EDIT_OVERLAY_EXPERIMENT__?: boolean;
    }
}
export declare function isBlockEditOverlayExperimentEnabled(): boolean;
export declare function createLegacyPerformanceMetrics(sourceEntityCount: number, blockEntityCount: number, blockAttributeCount: number, startAt: number, memoryBeforeMB: number | null): BlockEditPerformanceMetrics;
export declare function createBlockEditOverlaySession(sourceCore: McCore, blockDefName: string): Promise<BlockEditOverlaySession | null>;
export declare function cloneAttributeDef(attributeDef: McDbAttributeDef): McDbAttributeDef | null;
