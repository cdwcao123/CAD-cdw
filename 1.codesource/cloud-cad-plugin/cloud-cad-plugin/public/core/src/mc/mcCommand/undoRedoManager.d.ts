import { McCmdCache } from './mcCmdCache';
export declare class UndoRedoManager {
    private maxSteps;
    private undoStack;
    private redoStack;
    constructor(maxSteps?: number);
    getMaxSteps(): number;
    setMaxSteps(count: number): void;
    append(data: McCmdCache): void;
    undo(): Promise<boolean>;
    redo(): Promise<boolean>;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
    private trimStack;
}
