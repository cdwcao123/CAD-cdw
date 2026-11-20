import { McUiPluginComponentRegistration, McUiPluginCustomPageRegistration, McUiPluginDialogRegistration, McUiPluginSidePanelPosition, McUiPluginSidePanelRegistration } from '../mcEditor/type/interface';
interface McUiPluginSidePanelHost {
    setVisiblePanel: (type: 'leftPanel' | 'rightPanel', show: boolean) => void;
    setExpandPanel: (type: 'leftPanel' | 'rightPanel', show: boolean) => void;
}
export declare class McUiPluginEditorContext {
    private readonly internalComponents;
    private readonly pluginComponents;
    private readonly internalCustomPages;
    private readonly pluginCustomPages;
    private readonly internalSidePanels;
    private readonly pluginSidePanels;
    private readonly internalDialogs;
    private readonly pluginDialogs;
    private activeCustomPageKey;
    private hasExplicitActiveCustomPage;
    private sidePanelHost;
    private ensureDefaultActiveCustomPage;
    registerInternalComponent(input: McUiPluginComponentRegistration): void;
    registerInternalCustomPage(key: string, customPageConfig: McUiPluginCustomPageRegistration): void;
    registerInternalSidePanel(input: McUiPluginSidePanelRegistration): void;
    registerInternalDialog(input: McUiPluginDialogRegistration): void;
    addComponent(input: McUiPluginComponentRegistration): void;
    addCustomPage(key: string, customPageConfig: McUiPluginCustomPageRegistration): void;
    setActiveCustomPage(key: string): void;
    getActiveCustomPageKey(): string | null;
    addSidePanel(input: McUiPluginSidePanelRegistration): void;
    bindSidePanelHost(host: McUiPluginSidePanelHost | null): void;
    openSidePanel(key: string): void;
    addDialog(input: McUiPluginDialogRegistration): void;
    getComponents(): McUiPluginComponentRegistration[];
    getCustomPages(): Array<McUiPluginCustomPageRegistration & {
        key: string;
    }>;
    getSidePanels(position?: McUiPluginSidePanelPosition): McUiPluginSidePanelRegistration[];
    getDialogs(): McUiPluginDialogRegistration[];
    reset(): void;
}
export declare const mcUiPluginEditorContext: McUiPluginEditorContext;
export {};
