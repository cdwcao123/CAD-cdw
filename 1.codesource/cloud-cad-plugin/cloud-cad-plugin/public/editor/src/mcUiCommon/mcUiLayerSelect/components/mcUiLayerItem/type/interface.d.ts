import { McColor } from 'McCore';
import { McDbLineWeight } from 'McCore/mcDb';
export interface Layer {
    id: string;
    name: string;
    color: McColor;
    isOff: boolean;
    locked: boolean;
    frozen: boolean;
    lineType?: string;
    lineWidth?: McDbLineWeight;
    transparency?: number;
    desc?: string;
    index?: number;
}
