import { McMenuManager } from '../../mcMenu';
import { McCore } from '../../../mcCore/mcCore';
import { McDbEntity, McDbGrip, McDbObject, McDbObjectId } from '../../../mcDb';
import { McGeVector3 } from '../../../mcGe';
import { McPrDrawRender } from '../../../mcPr';
import { McPrDefaultGetEntities } from '../../../mcPr/mcPrDefaultGetEntities';
import * as THREE from '../../../../lib/ThreeJS/Three.js';
export declare class McHighLightEntity {
    mcCore: McCore;
    entityMap: Map<McDbObjectId, McDbObject>;
    running: boolean;
    mcPrGetEntities: McPrDefaultGetEntities | null;
    menuManager: McMenuManager;
    constructor(mcCore: McCore);
    protected update3DSelectObject(): void;
    protected cancel3DSelectObject(): void;
    getSelectedEntities(): Map<McDbObjectId, McDbObject>;
    getSelectedCount(): number;
    selectAllEntity(): void;
    setEntitySelect(entity: McDbObject): void;
    cancelOneEntitySelect(objectId: McDbObjectId): void;
    cancelEntitySelect(): void;
    refreshSelectedEntities(): void;
    deleteEntity(core: McCore): Promise<boolean>;
    start(): Promise<any>;
    restart(): void;
    end(): void;
}
export declare class McSelectObject3D extends THREE.Object3D {
    entities: McDbEntity[];
    grip: McDbGrip | null;
    mcPrDrawRender: McPrDrawRender;
    srcPosition: McGeVector3;
    mcCore: McCore;
    constructor(core: McCore);
    isGripSelect(): boolean;
    setEntities(entities: McDbObject[]): void;
    setGrip(grip: McDbGrip): void;
    worldDraw(point: McGeVector3): void;
    finished(point: McGeVector3): void;
    reset(): void;
    dispose(): void;
}
