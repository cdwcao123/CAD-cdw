import { DimBlock, McDbBlock, McDbEntity } from '../..';
import { McGeMatrix4, McGeVector3 } from '../../../mcGe';
import { McGsRenderable } from '../../../mcGs/renderable';
import { Color } from '../../../../lib/ThreeJS/Three.js';
import { McGsRendererBase } from '../../../mcGs/render/mcGsRendererBase';
export declare class DimensionRenderUtils {
    static getArrowRenderable(render: McGsRendererBase, type: DimBlock, pos: McGeVector3, dir: McGeVector3, size: number, width: number, color: Color, alpha?: number): McGsRenderable[];
    static getArrowEntityList(type: DimBlock, pos: McGeVector3, dir: McGeVector3): McDbEntity[];
    static getArrowShapeSize(type: DimBlock, size: number): number;
    static getCurvePath(center: McGeVector3, radiusPoint: McGeVector3, linePoint1: McGeVector3, linePoint2: McGeVector3, blockMatrix?: McGeMatrix4, segments?: number): McGeVector3[];
    static getMLeaderBlockEntityList(blockName: string): McDbEntity[];
    static getMLeaderContentBlock(blockName: string, position: McGeVector3): McDbBlock | undefined;
    static getBlockContentCenterSize(blockName: string): number;
}
