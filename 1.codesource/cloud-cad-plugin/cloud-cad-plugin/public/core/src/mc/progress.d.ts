export declare class TaskProgress {
    message: string;
    step: number;
    total: number;
    visible: boolean;
    status: string;
    constructor(obj?: TaskProgress);
    startTask(message: string, total?: number): void;
    setProgress(step: number, message?: string, total?: number): void;
    setMessage(message: string): void;
    endTask(): void;
    interruptTask(message?: string): void;
}
