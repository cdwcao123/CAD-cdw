import { DrawingWorkspaceSnapshot, McEditorDrawingMode } from '../type/interface';
import { DrawingAutoCacheWriter } from '../type/type';
import { MapCoreEngine } from '../../mcUiDraw/type/interface';
import { McCore } from 'McCore';
declare class DrawingAutoCacheManager {
    private readonly sessions;
    private drawingMode;
    private workspaceStorageKey;
    private entryTempId;
    constructor();
    configureWorkspace(tabSessionId: string | null, drawingMode: McEditorDrawingMode, entryTempId?: string): void;
    syncWorkspace(drawings: MapCoreEngine[], activeDrawingId?: string): void;
    getWorkspaceSnapshot(): DrawingWorkspaceSnapshot | undefined;
    clearWorkspace(): void;
    register(core: McCore, writeCache: DrawingAutoCacheWriter): void;
    unregister(core: McCore): void;
    markCached(core: McCore): void;
    disposeAll(): void;
    private readonly handleSystemVariableChanged;
    private readonly isValidWorkspaceDrawing;
}
export declare const drawingAutoCacheManager: DrawingAutoCacheManager;
export {};
