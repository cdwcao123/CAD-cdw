import { CmdExeStatus, ICmdExeHistoryRecord, McCore } from '../../mcCore';
import { CommandCallFunction } from '../../mcCore/types/type';
import { McCmdCache } from './mcCmdCache';
import { McCommandReactor } from './mcCommandReactor';
export declare class McCommandManager extends McCommandReactor {
    #private;
    constructor(core: McCore);
    getCurCmdCache(): McCmdCache | null;
    _addToExeHistory(name: string, status?: CmdExeStatus): string;
    upCmdStatus(id: string, status: CmdExeStatus): boolean;
    getCmdHistoryRecord(id: string): ICmdExeHistoryRecord | null;
    execCommand(cmdName: string, ...args: any[]): Promise<boolean>;
    execTempCommand(cmdFn: CommandCallFunction, keepHighlight?: boolean, ...args: any[]): Promise<boolean>;
    execCommandFn(cmdName: string, keepHighlight?: boolean, ...args: any[]): Promise<any>;
    onBeginCommand(keepHighlight?: boolean): string;
    onCompleteCommand(cmdId: string, keepHighlight?: boolean): void;
    onInterruptCommand(cmdId: string, keepHighlight?: boolean): void;
    interruptCommand(cmdId?: string, keepHighlight?: boolean): void;
    clearHistory(): void;
    getHistory(): ICmdExeHistoryRecord[];
    undo(): void;
    redo(): void;
    isRunningCommand(): boolean;
    setCore(core: McCore): void;
    getCore(): McCore;
    destroy(): void;
    _setCurCmdName(cmdName: string): void;
}
