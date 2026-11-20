import { menuTriggerType } from './interface';
export type EditEventType = {
    initStateChange: (state: 'starting' | 'mounted' | 'ready' | 'error') => void;
    containerLoaded: (coreKey: string) => void;
    menuTrigger: (menu: menuTriggerType) => void;
};
export type ExtractParam<T> = T extends (param: infer P) => void ? P : never;
export type DrawingAutoCacheWriter = (editedAt: number) => Promise<boolean>;
export type DrawingCacheWriteMode = 'initial' | 'manual' | 'auto';
export type TempDrawingSnapshotUpdateResult = 'updated' | 'missing' | 'stale';
