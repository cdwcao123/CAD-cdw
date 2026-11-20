import { CommandEventType } from '../../mcCore/types/type';
import { McEventReactor } from '../mcEventReactor';
export declare class McCommandReactor extends McEventReactor<CommandEventType> {
    #private;
    constructor();
}
