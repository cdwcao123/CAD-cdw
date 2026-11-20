import { default as McColor } from '../../mc/mcColor';
import { McEngine, McPrintMode } from '../../mcCore';
import { McDbEntity } from '../../mcDb';
import { McGeExtent3 } from '../../mcGe';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class McGsPrintRender {
    outputColor: THREE.Color;
    engine: McEngine;
    fsQuad: THREE.Mesh | null;
    constructor(engine: McEngine, convertColor?: boolean, outputColor?: McColor);
    printEntity(entity: McDbEntity, width: number, height: number): string;
    print(mode: McPrintMode, size: number, extent?: McGeExtent3): string;
    renderImage(targetCamera: THREE.Camera, width: number, height: number): string;
    setOutputColor(color: McColor): void;
    private flipY;
}
