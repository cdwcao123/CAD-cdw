import { BufferGeometry } from './../core/BufferGeometry';
export class PlaneGeometry extends BufferGeometry {
    
    constructor(width?: number, height?: number, widthSegments?: number, heightSegments?: number);

    
    type: string;

    parameters: {
        width: number;
        height: number;
        widthSegments: number;
        heightSegments: number;
    };

    static fromJSON(data: any): PlaneGeometry;
}
