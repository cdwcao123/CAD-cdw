import { Object3D } from './../core/Object3D';
import { Raycaster } from './../core/Raycaster';
import { Camera } from './../cameras/Camera';
import { Intersection } from '../core/Raycaster';
export class LOD extends Object3D {
    constructor();

    type: 'LOD';

    
    levels: Array<{ distance: number; hysteresis: number; object: Object3D }>;

    autoUpdate: boolean;
    readonly isLOD: true;

    
    addLevel(object: Object3D, distance?: number, hysteresis?: number): this;

    getCurrentLevel(): number;
    getObjectForDistance(distance: number): Object3D | null;
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    update(camera: Camera): void;
    toJSON(meta: any): any;

    
    
    objects: any[];
}
