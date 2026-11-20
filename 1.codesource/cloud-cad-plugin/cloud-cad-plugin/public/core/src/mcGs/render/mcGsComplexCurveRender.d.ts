import { McDbVertex } from '../../mcDb';
import { IMcDbLineTypeSegment } from '../../mcDb/types/interface';
import { McGeMatrix4, McGePoint, McGeVector3 } from '../../mcGe';
import { McGsRendererBase, McGsRenderable } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export interface ICurveRenderableParamsEx {
    color: THREE.Color;
    alpha: number;
    vertices: McDbVertex[];
    width: number;
    lineTypePattern: Array<IMcDbLineTypeSegment>;
    lineTypeScale: number;
    isMerge: boolean;
    globalWidth: number;
    thickness?: number;
    showLineWeight: boolean;
    closed: boolean;
    isPixelWidth: boolean;
    isCurve?: boolean;
    blockMatrix?: McGeMatrix4;
}
export declare class McGsComplexCurveRender extends McGsRendererBase {
    renderCurve(coords: McGeVector3[], needHandleBlockMatrix?: boolean, closed?: boolean): boolean;
    renderCurveEx(ver: McDbVertex[], needHandleBlockMatrix?: boolean, globalWidth?: number, closed?: boolean, isPixelWidth?: boolean): boolean;
    protected getSpaceLineRenderableWithLineType(render: McGsRendererBase, params: ICurveRenderableParamsEx): McGsRenderable[];
    protected getLineTypePatternWidth(params: ICurveRenderableParamsEx): number;
    protected calculateLineBorderCoords(lineRenderableCoords: McDbVertex[][], closed?: boolean): McGePoint[][];
    private calculateLeftIntersectPoint;
    private calculateRightIntersectPoint;
}
