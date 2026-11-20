import { McEventReactor, McMcdFiler, McMctfFiler, McXData } from '../../mc';
import { McReturnStatus } from '../../mc/mcReturnStatus';
import { McDbDatabase, McDbEntity } from '..';
import { McGeExtent3 } from '../../mcGe';
import { McDbEntityTableEventType, McDbObjectId, McFetchEntities } from '../types/type';
export declare class McDbEntityTable extends McEventReactor<McDbEntityTableEventType> {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    db: McDbDatabase;
    objectId: McDbObjectId;
    xData: McXData;
    constructor(db: McDbDatabase);
    getEntityTopOrder(): number;
    getEntityBottomOrder(): number;
    undoEntityOrderList(change: {
        oldOrder: number;
        newOrder: number;
    }): void;
    redoEntityOrderList(change: {
        oldOrder: number;
        newOrder: number;
    }): void;
    setEntityOrderDown(entityList: McDbEntity[], targetEntity: McDbEntity): void;
    setEntityOrderUp(entityList: McDbEntity[], targetEntity: McDbEntity): void;
    setEntityOrderBottom(entityList: McDbEntity[]): void;
    setEntityOrderTop(entityList: McDbEntity[]): void;
    addBatchEntities(entities: McDbEntity[]): McReturnStatus<string>;
    addBatchEntitiesAsync(entities: McDbEntity[], options?: {
        batchSize?: number;
        onProgress?: (current: number, total: number) => void;
    }): Promise<McReturnStatus<string>>;
    removeBatchEntities(entityIDs: string[]): McReturnStatus<string>;
    addEntity(entity: McDbEntity): McReturnStatus<McDbObjectId>;
    removeEntity(entityId: string): McReturnStatus<string>;
    getEntity(entityId: McDbObjectId): McDbEntity | null;
    fetchEntities(callBack: McFetchEntities): void;
    getEntitiesByType<T extends McDbEntity>(type: string): T[];
    getEntities(): Map<string, McDbEntity>;
    getEntityCount(): number;
    updateEntityIndexID(oldID: string, newID: string): void;
    getExtent2D(): McGeExtent3 | null;
    getExtent3D(): McGeExtent3 | null;
    redraw(): void;
    redraw2D(): void;
    redraw3D(): void;
    destroy2d(): void;
    destroy3d(): void;
    clear(): void;
    getDatabase(): McDbDatabase;
    mctfInFields(fields: McMctfFiler, processInfo?: {
        minStep: number;
        maxStep: number;
    }): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(filer: McMcdFiler, silentTaskProgress?: boolean): Promise<void>;
    mcdOutFields(filer: McMcdFiler): void;
    mcdOutFieldsAsync(filer: McMcdFiler, useWorker?: boolean, chunkSize?: number): Promise<boolean>;
}
