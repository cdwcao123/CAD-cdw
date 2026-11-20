import { McEngine } from '../../mcCore';
import { McDbEntity, McDbMText, McDbTextStyle, TextAttachment } from '../../mcDb';
import { McGeExtent2, McGeVector2, McGeVector3 } from '../../mcGe';
import { McGsRendererBase } from '..';
import { MTextParagraphAlignment } from '../../../lib/mtext-parser/parser';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export type shapeSize = {
    pos: McGeVector3;
    width: number;
    height: number;
    char: string;
    align: MTextParagraphAlignment;
};
export declare class McGsMTextRender extends McGsRendererBase {
    protected shapes: shapeSize[][];
    protected rectSize: McGeVector2[];
    protected baseLineFactor: number;
    entity: McDbMText;
    constructor(entity: McDbEntity, engine: McEngine);
    render(): boolean;
    private convertParagraphAlign;
    static getCenterPosition(position: THREE.Vector3, shapeWidth: number, shapeHeight: number, aligned: TextAttachment, rotation: number): THREE.Vector3;
    static getCenter(position: THREE.Vector3, shapeWidth: number, shapeHeight: number, aligned: TextAttachment, rotation: number): THREE.Vector3;
    static getTextSize(text: string, textStyle: McDbTextStyle | undefined, textSize: number): McGeVector2;
    private updateEditText;
    getTextRectSize(startIndex?: number, endIndex?: number): McGeExtent2[];
    getLineRectSize(shapes: shapeSize[], startIndex: number, endIndex: number): McGeExtent2[];
    getLineHeight(index: number): number;
    getCharIndexOnPoint(point: McGeVector3): number;
    getPositionByIndex(index: number): McGeVector3;
    getLineIndexRange(index: number): McGeVector2 | undefined;
    highLight(simpleHL?: boolean): void;
    getRealBox(): McGeVector3[];
}
