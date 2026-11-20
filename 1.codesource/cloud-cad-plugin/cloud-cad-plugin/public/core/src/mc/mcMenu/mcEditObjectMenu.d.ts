import { McCore } from '../../mcCore';
import { McMenuGroup } from './mcMenuGroup';
export declare class McEditObjectMenu extends McMenuGroup {
    constructor(mcCore: McCore, name: string, priority?: number);
    canShow(): boolean;
}
