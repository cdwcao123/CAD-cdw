import { DrawingSourceType } from './enum';
import { McCore } from 'McCore';
export interface MapCore {
    name: string;
    core: object;
}
export interface MapCoreEngine extends MapCore {
    key: string;
    sourceType: DrawingSourceType;
    cacheTempId?: string;
    cacheDrawingId?: string;
    restoredFromCache?: boolean;
    sourceFileName?: string;
    sourceLastModified?: number;
}
export interface CommandHistoryItem {
    text: string;
    type: 'command' | 'response' | 'error' | 'info' | 'success';
    timestamp?: Date;
}
export interface CommandSuggestion {
    command: string;
    description: string;
    aliases?: string[];
}
export interface Coordinates {
    x: number;
    y: number;
}
export interface CmdProps {
    modelValue?: string;
    disabled?: boolean;
    placeholder?: string;
    maxHistory?: number;
    coordinates?: Coordinates;
}
export interface SplitPaneProps {
    initialLeftWidth?: number;
    minLeftWidth?: number;
    minRightWidth?: number;
    dividerWidth?: number;
    coreKey: string;
    index: number;
}
export interface CommandHistoryRecord {
    name: string;
}
export type CommandManagerEvent = 'cmdBegin' | 'cmdEnd' | 'cmdCancel';
export type CommandManagerEventHandler = (...args: unknown[]) => void;
export interface CommandManagerLike {
    isRunningCommand: () => boolean;
    execCommand: (command: string, core?: McCore) => unknown;
    getHistory: () => CommandHistoryRecord[];
    on: (event: CommandManagerEvent, fn: CommandManagerEventHandler) => void;
    off: (event: CommandManagerEvent, fn: CommandManagerEventHandler) => void;
}
