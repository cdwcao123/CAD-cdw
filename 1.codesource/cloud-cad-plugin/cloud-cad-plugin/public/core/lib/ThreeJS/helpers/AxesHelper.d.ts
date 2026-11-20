import { Color } from '../math/Color';
import { LineSegments } from './../objects/LineSegments';
export class AxesHelper extends LineSegments {
    
    constructor(size?: number);

    
    type: string;

    setColors(xAxisColor: Color, yAxisColor: Color, zAxisColor: Color): this;

    dispose(): void;
}
