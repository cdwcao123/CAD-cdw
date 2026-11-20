import { McEventReactor } from 'McCore';
import { Component } from 'vue';
import { CoreConfig, McEditorCoreOptions, McEditorDrawingMode, McEditorRuntimeScene } from './type/interface';
import { EditEventType } from './type/type';
export declare class McEditCore extends McEventReactor<EditEventType> {
    #private;
    protected container: HTMLElement;
    protected assetsPath: string;
    version: string;
    readonly coreOptions: McEditorCoreOptions;
    readonly drawingMode: McEditorDrawingMode;
    protected runtimeScene: McEditorRuntimeScene;
    constructor(config: CoreConfig);
    protected resolveRuntimeScene(): McEditorRuntimeScene;
    initCore(): void;
    protected unmountCore(): void;
    resolveConfigPath(configPath?: string): string;
    normalizeDirectoryPath(path: string): string;
    registerPreparedPluginComponents(): void;
    getRegisteredComponent(name: string): Component | undefined;
    protected ensureComponentRegistered(name: string, component: Component): void;
}
export default McEditCore;
