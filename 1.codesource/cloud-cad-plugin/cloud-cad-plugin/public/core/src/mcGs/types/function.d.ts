export interface SurfaceResult {
    vertices: Array<{
        x: number;
        y: number;
    }>;
    indices: Array<number>;
    boundary?: Array<number>;
}
export declare function generateSurface(bounds: Array<Array<{
    x: number;
    y: number;
}>>, holes: Array<Array<{
    x: number;
    y: number;
}>>, coords: Array<{
    x: number;
    y: number;
}>, constraints?: Array<Array<{
    x: number;
    y: number;
}>>): SurfaceResult;
