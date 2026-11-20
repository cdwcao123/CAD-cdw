import { McEngine, McControl } from '../../mcCore';
import { McGeRaycaster } from '../../mcGe/mcGeRaycaster';
import { GsHAlignType, GsVAlignType } from '../types/enum';
import * as THREE from '../../../lib/ThreeJS/Three.js';
declare class McViewHelper extends THREE.Object3D {
    center: THREE.Vector3;
    camera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
    domElement: HTMLElement;
    control: McControl | null;
    orthoCamera: THREE.OrthographicCamera;
    posXAxisHelper: THREE.Sprite;
    posYAxisHelper: THREE.Sprite;
    posZAxisHelper: THREE.Sprite;
    negXAxisHelper: THREE.Sprite;
    negYAxisHelper: THREE.Sprite;
    negZAxisHelper: THREE.Sprite;
    interactiveObjects: THREE.Sprite[];
    xAxis: THREE.Mesh;
    yAxis: THREE.Mesh;
    zAxis: THREE.Mesh;
    vAlignType: GsVAlignType;
    hAlignType: GsHAlignType;
    panelSize: number;
    raycaster: McGeRaycaster;
    mouse: THREE.Vector2;
    point: THREE.Vector3;
    targetPosition: THREE.Vector3;
    targetHeading: number;
    targetTilt: number;
    viewport: THREE.Vector4;
    radius: number;
    constructor(control: McControl | null, camera: THREE.Camera | null, renderer: THREE.WebGLRenderer | null, domElement: HTMLElement);
    render(delta: number): void;
    handleClick(event: MouseEvent): boolean;
    dispose(): void;
}
declare class McViewHelperPanel extends McViewHelper {
    dom: HTMLElement;
    constructor(engine: McEngine, vAlign?: GsVAlignType, hAlign?: GsHAlignType);
    dispose(): void;
}
export { McViewHelperPanel };
