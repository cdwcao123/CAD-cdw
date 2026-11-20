import { ShapePath, Shape } from '../../../lib/ThreeJS/Three.js';
import { FontData } from './mcMeshFont';
export declare class McFont {
    readonly isFont: true;
    type: string;
    data: FontData;
    constructor(data: FontData);
    generateShapes(text: string, size?: number, xOffset?: number, yOffset?: number): Shape[];
    getShapePath(text: string, size?: number, xOffset?: number, yOffset?: number): ShapePath;
}
