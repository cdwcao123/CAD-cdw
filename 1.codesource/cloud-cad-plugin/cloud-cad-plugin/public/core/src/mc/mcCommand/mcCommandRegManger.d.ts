import { IMcCommand } from '../../mcCore/types/interface';
import { McReturnStatus } from '../mcReturnStatus';
export declare class McCommandRegManager {
    #private;
    static getInstance(): McCommandRegManager;
    constructor();
    addCommand(cmd: IMcCommand): McReturnStatus<string>;
    removeCommand(name: string): McReturnStatus<string>;
    removeGroup(group: string): boolean;
    getCommands(): Map<string, IMcCommand>;
    has(cmd: string): boolean;
    get(cmd: string): IMcCommand | undefined;
    execCommand(cmdName: string, ...args: any[]): Promise<McReturnStatus<string>>;
}
export declare const mcCommandRegManger: McCommandRegManager;
