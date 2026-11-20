import { McBaseTextShape } from '../../mc';
import { PickResult } from '../../mcCore';
import { TextHorizontalMode, TextVerticalMode } from '../../mcDb';
import { McGeVector2, McGeVector3 } from '../../mcGe';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { McGsRendererBase } from '..';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsTextRender extends McGsRendererBase {
    protected rectSize: McGeVector2;
    protected shapes: McBaseTextShape[];
    render(): boolean;
    private updateEditText;
    getTextRectSize(startIndex?: number, endIndex?: number): McGeVector2;
    getCharIndexOnPoint(point: McGeVector3): number;
    raycast(raycaster: McGeRaycaster): PickResult | null;
    dispose(): void;
    getRealBox(): McGeVector3[];
    static getCenterPosition(position: THREE.Vector3, shapeWidth: number, shapeHeight: number, verticalMode: TextVerticalMode, horizontalMode: TextHorizontalMode, rotation: number, baseLineFactor?: number): THREE.Vector3;
}
