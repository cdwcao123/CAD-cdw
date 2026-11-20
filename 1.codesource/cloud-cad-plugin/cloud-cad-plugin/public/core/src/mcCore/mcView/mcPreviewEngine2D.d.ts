import { default as McColor } from '../../mc/mcColor';
import { McDbEntity, McDbObject, McDbEntityMask } from '../../mcDb';
import { McGeExtent3, McGeVector2, McGeVector3 } from '../../mcGe';
import { McCore } from '../mcCore';
import { McPrintMode } from '../types/enum';
import { IMcEngine2DOption, PickResult } from '../types/interface';
import { McEngine2D } from './mcEngine2D';
export declare class McPreviewEngine2D extends McEngine2D {
    #private;
    constructor(container: HTMLElement, core: McCore, engineOption?: Partial<IMcEngine2DOption>);
    init(): boolean;
    listenDomEvent(): boolean;
    protected updateMouseCoord(event: MouseEvent): void;
    dispose(): void;
    getBoundingBox(): McGeExtent3 | null;
    pick(x: number, y: number, layers?: McDbEntityMask, threshold?: number, altitude?: number): PickResult | null;
    pickByVolume(coords: McGeVector3[], isWrap?: boolean, layers?: McDbEntityMask): McDbObject[];
    pickVolumeScreen(coords: McGeVector2[], isWrap?: boolean, layers?: McDbEntityMask): McDbObject[];
    drawEntity(entity: McDbEntity): void;
    clearEntity(): void;
    getEntities(): Map<string, McDbEntity>;
    getEntity(entityId: string): McDbEntity | undefined;
    zoomToEntity(entity: McDbEntity): void;
    printImage(mode: McPrintMode, size?: number, extent?: McGeExtent3, convertColor?: boolean, outputColor?: McColor): string;
    printEntity(entity: McDbEntity, width?: number, height?: number, convertColor?: boolean, outputColor?: McColor): string;
}
