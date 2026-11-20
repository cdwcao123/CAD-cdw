import { McEventReactor } from './mcEventReactor';
import { TaskProgressArgs } from './types/interface';
import { TaskProgressEvent } from './types/type';
export declare class McTaskProgress extends McEventReactor<TaskProgressEvent> {
    #private;
    message: string;
    step: number;
    total: number;
    visible: boolean;
    statusColor: string;
    constructor();
    static getInstance(): McTaskProgress;
    startTask(message: string, total: number): void;
    setProgress(step: number, message?: string, total?: number): void;
    setMessage(message: string): void;
    endTask(): void;
    interruptTask(params: Partial<TaskProgressArgs>): void;
}
export declare const mcTaskProgress: McTaskProgress;
