import { McCore, McEngine } from '../mcCore';
import { McPrGetEntities } from './mcPrGetEntities';
export declare class McPrDefaultGetEntities extends McPrGetEntities {
    private clickTable;
    private clickPoint;
    constructor(mcCore: McCore);
    handleMouseDown: (event: MouseEvent, engine: McEngine) => void;
    handleMouseMove: (event: MouseEvent, engine: McEngine) => void;
    handleMouseUp: (event: MouseEvent, engine: McEngine) => void;
    stop(): void;
}
