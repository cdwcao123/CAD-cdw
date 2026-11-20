import { McBaseTextShape } from '../../mc/mcFontManager';
import { McGeExtent3, McGeVector3 } from '../../mcGe';
import { MTextParagraphAlignment, MTextToken } from '../../../lib/mtext-parser/parser';
import { GsHAlignType, GsLineGripStyle, GsVAlignType } from './enum';
import * as THREE from '../../../lib/ThreeJS/Three.js';
interface GsRectOption {
    name?: string;
    uuid?: string;
    canCover?: boolean;
    adjustRenderOrder?: boolean;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    width?: number;
    height?: number;
    radius?: number;
    highLightColor?: THREE.Color;
    innerColor?: THREE.Color;
    outterColor?: THREE.Color;
    innerAlpha?: number;
    outterAlpha?: number;
    offset?: THREE.Vector2;
    position?: THREE.Vector3;
    direction?: THREE.Vector3;
}
interface GsPolylineOption {
    name?: string;
    uuid?: string;
    canCover?: boolean;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    width?: number;
    alpha?: number;
    colorDuration?: number;
    highLightColor?: THREE.Color;
    startColor?: THREE.Color;
    endColor?: THREE.Color;
}
interface GsTextPanelOption {
    name?: string;
    uuid?: string;
    canCover?: boolean;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    showBorder?: boolean;
    showBackground?: boolean;
    size?: number;
    alpha?: number;
    backgroundAlpha?: number;
    highLightColor?: THREE.Color;
    textColor?: THREE.Color;
    backgroundColor?: THREE.Color;
    borderColor?: THREE.Color;
    offset?: THREE.Vector2;
    hAlignType?: GsHAlignType;
    vAlignType?: GsVAlignType;
    position?: THREE.Vector3;
}
interface GsIconOption {
    name?: string;
    uuid?: string;
    canCover?: boolean;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    alpha?: number;
    width?: number;
    height?: number;
    highLightColor?: THREE.Color;
    color?: THREE.Color;
    offset?: THREE.Vector2;
    hAlignType?: GsHAlignType;
    vAlignType?: GsVAlignType;
    position?: THREE.Vector3;
}
interface GsScreenLineOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    width?: number;
    color?: THREE.Color;
    alpha?: number;
}
interface GsScreenPolygonOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    lineWidth?: number;
    lineColor?: THREE.Color;
    color?: THREE.Color;
    alpha?: number;
}
interface GsHighLightLineOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    width?: number;
    alpha?: number;
    offset?: number;
    color?: THREE.Color;
}
interface GsDashLineOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    space?: number;
    color?: THREE.Color;
    alpha?: number;
}
interface GsAnglePanelOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    angleSpace?: number;
    radius?: number;
    length?: number;
    highLightColor?: THREE.Color;
    color?: THREE.Color;
    position?: THREE.Vector3;
}
interface GsPolygonOption {
    name?: string;
    uuid?: string;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    alpha?: number;
    lineWidth?: number;
    color?: THREE.Color;
    lineColor?: THREE.Color;
    lineAlpha?: number;
    highLightColor?: THREE.Color;
}
interface GsMergeGeometry {
    vertices: number[] | Float32Array;
    colors: number[] | Float32Array;
    orders?: number[] | Float32Array;
    neighbors?: number[] | Float32Array;
    uvs?: number[] | Float32Array;
    widths?: number[] | Float32Array;
    alphas?: number[] | Float32Array;
    indices: number[] | Uint16Array | Uint32Array;
    box: McGeExtent3;
    indexOffset?: number;
    colors2?: number[] | Float32Array;
    normals?: number[] | Float32Array;
    extend1?: number[] | Float32Array;
}
interface GsCrossLineOption {
    name?: string;
    uuid?: string;
    canCover?: boolean;
    show?: boolean;
    canPick?: boolean;
    highLight?: boolean;
    size?: number;
    highLightColor?: THREE.Color;
    color?: THREE.Color;
    alpha?: number;
    offset?: THREE.Vector2;
    position?: THREE.Vector3;
    style: GsLineGripStyle;
    direction?: THREE.Vector3;
}
interface McGsQuadrantInfo {
    name: string;
    startPoint1: McGeVector3;
    startPoint2: McGeVector3;
    startDir: McGeVector3;
    startAngle: number;
    endDir: McGeVector3;
    endPoint1: McGeVector3;
    endPoint2: McGeVector3;
    endAngle: number;
}
interface McMTextLineShapeInfo {
    index: number;
    height: number;
    shapesInfo: {
        shape: McBaseTextShape;
        token: MTextToken;
    }[];
    align: MTextParagraphAlignment;
}
export type { GsRectOption, GsMergeGeometry, GsPolylineOption, GsTextPanelOption, GsScreenLineOption, GsPolygonOption, GsDashLineOption, GsAnglePanelOption, GsIconOption, GsHighLightLineOption, GsScreenPolygonOption, GsCrossLineOption, McGsQuadrantInfo, McMTextLineShapeInfo, };
