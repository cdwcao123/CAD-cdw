import { BufferGeometry } from '../core/BufferGeometry';
export class BoxGeometry extends BufferGeometry {
    
    constructor(
        width?: number,
        height?: number,
        depth?: number,
        widthSegments?: number,
        heightSegments?: number,
        depthSegments?: number,
    );

    
    type: string;

    parameters: {
        width: number;
        height: number;
        depth: number;
        widthSegments: number;
        heightSegments: number;
        depthSegments: number;
    };

    static fromJSON(data: any): BoxGeometry;
}
