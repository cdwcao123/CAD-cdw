import { McUiSidePanelState } from './types/interface';
import { McUiSidePanelPosition } from './types/type';
export declare class McUiSidePanelManager {
    private static instance;
    private readonly states;
    private constructor();
    static getInstance(): McUiSidePanelManager;
    getState(position: McUiSidePanelPosition): McUiSidePanelState;
    setActivePanel(position: McUiSidePanelPosition, key: string | undefined): void;
    addPanel(position: McUiSidePanelPosition, key: string, name: string): void;
    removePanel(position: McUiSidePanelPosition, key: string): void;
    clear(position?: McUiSidePanelPosition): void;
}
export declare const mcUiSidePanelManager: McUiSidePanelManager;
