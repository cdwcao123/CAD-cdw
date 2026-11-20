import { BufferGeometry } from '../core/BufferGeometry';
export class EdgesGeometry<TBufferGeometry extends BufferGeometry = BufferGeometry> extends BufferGeometry {
    
    constructor(geometry?: TBufferGeometry, thresholdAngle?: number);

    
    type: string;

    parameters: {
        geometry: TBufferGeometry;
        thresholdAngle: number;
    };
}
