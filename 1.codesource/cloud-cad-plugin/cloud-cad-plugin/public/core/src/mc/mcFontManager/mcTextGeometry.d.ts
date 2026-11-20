import { ShapeGeometry, ExtrudeGeometryOptions } from '../../../lib/ThreeJS/Three.js';
import { McFont } from './mcFont';
export interface McTextGeometryParameters extends ExtrudeGeometryOptions {
    font: McFont;
    size?: number | undefined;
    height?: number | undefined;
    depth?: number | undefined;
    curveSegments?: number | undefined;
    bevelEnabled?: boolean | undefined;
    bevelThickness?: number | undefined;
    bevelSize?: number | undefined;
    bevelOffset?: number | undefined;
    bevelSegments?: number | undefined;
    xOffset?: number | undefined;
    yOffset?: number | undefined;
}
export declare class McTextGeometry extends ShapeGeometry {
    constructor(text: string, parameters: McTextGeometryParameters);
}
