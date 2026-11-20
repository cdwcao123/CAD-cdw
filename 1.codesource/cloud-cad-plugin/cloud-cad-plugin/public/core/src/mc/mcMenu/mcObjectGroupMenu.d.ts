import { McCore } from '../../mcCore';
import { McDbGroup } from '../../mcDb';
import { McMenuGroup } from './mcMenuGroup';
export declare class McObjectGroupMenu extends McMenuGroup {
    constructor(mcCore: McCore, name: string, priority?: number);
    canShow(): boolean;
    getSelectGroup(): McDbGroup | null;
}
