import { McCore } from '../../mcCore';
import { McMenuActionFun } from '../../mcCore/types/type';
import { McMenuGroup } from './mcMenuGroup';
export declare class McMenuAction extends McMenuGroup {
    key: string;
    exeInCommand: boolean;
    keepHight: boolean;
    protected actionFun: McMenuActionFun | string | null;
    constructor(mcCore: McCore, name: string, priority?: number, key?: string, actionFun?: McMenuActionFun | string, exeInCommand?: boolean, bKeepHight?: boolean);
    getExeInCommand(): any;
    setExeInCommand(value: boolean): void;
    getKey(): any;
    setKey(value: any): void;
    getActionFun(): McMenuActionFun | string | null;
    setActionFun(value: McMenuActionFun | string | null): void;
    exe(): Promise<void>;
    isAction(): boolean;
}
