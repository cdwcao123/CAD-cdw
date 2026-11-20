import { McRGB } from '../../mc';
import { McGePoint, McGeVector3 } from '../../mcGe';
import { McGsRenderable, McGsRendererBase } from '..';
import { GsMergeGeometry } from '../types/interface';
export declare class McGsHighLightRenderable extends McGsRenderable {
    protected coords: McGePoint[][];
    protected alpha: number;
    protected width: number;
    readonly isHighLightRenderable: boolean;
    constructor(renderBase: McGsRendererBase, coords: McGePoint[][], width?: number, alpha?: number, color?: McRGB);
    getAlpha(): number;
    setAlpha(alpha: number): void;
    getWidth(): number;
    setWidth(width: number): void;
    getMaterialCode(): string;
    generateGeometry(center: McGeVector3, offset: number, indexOffset: number, isTransparent: boolean): GsMergeGeometry | null;
}
