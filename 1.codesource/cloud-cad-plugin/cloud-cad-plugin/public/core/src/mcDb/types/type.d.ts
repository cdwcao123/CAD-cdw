import { McDbDictionaryRecord } from '..';
import { McGeVector3 } from '../../mcGe';
import { McPrDrawRender } from '../../mcPr';
import { McDbBlock, McDbEntity } from '../entity';
import { McDbGrip } from '../grips/mcDbGrip';
import { McDbObject } from '../mcDbObject';
import { McDbSymbolTableRecord } from '../mcDbSymbolTableRecord';
import { McDbMTextContextPropertyEvent, McDbMTextContextPropertyType } from './enum';
type McLineTypeName = 'ByLayer' | 'ByBlock' | string;
type McDbObjectId = string;
type McDbObjectIdArray = McDbObjectId[];
type McDbObjectEventType = {
    erased: () => void;
    added: () => void;
    modified: (newOb: McDbObject) => void;
};
type McDbDatabaseEventType = {
    objectAdded: (item: McDbObject | McDbObject[]) => void;
    objectDeleted: (item: McDbObject | McDbObject[]) => void;
    objectModified: (item: McDbObject | McDbObject[], oldValues: Record<string, any> | Record<string, any>[], changedValues: Record<string, any> | Record<string, any>[]) => void;
    created: () => void;
    entityTableCreated: () => void;
    selectionSetChanged: (entityMap: Map<string, McDbObject>) => void;
    templateLoaded: (template: string) => void;
    fileOpened: () => void;
    fileOpenFailed: () => void;
    headerValChanged: (key: string, oldValue: any, value: any) => void;
};
type McDbEntityTableEventType = {
    created: () => void;
    entityAdded: (item: McDbEntity | McDbEntity[]) => void;
    entityDeleted: (item: McDbEntity | McDbEntity[]) => void;
    entityModified: (item: McDbEntity | McDbEntity[], oldValues: Record<string, any> | Record<string, any>[], changedValues: Record<string, any> | Record<string, any>[]) => void;
    _blockEditAttr: (item: McDbBlock) => void;
};
type McDbSymbolTableEventType = {
    recordAdded: (item: McDbSymbolTableRecord) => void;
    recordDeleted: (item: McDbSymbolTableRecord) => void;
    recordModified: (item: McDbSymbolTableRecord, oldValues?: Record<string, any>, changedValues?: Record<string, any>) => void;
    currentRecordChanged: (val: string, oldVal?: string) => void;
} & McDbObjectEventType;
type McDbDictionaryEventType = {
    dictionaryAdded: (item: McDbDictionaryRecord) => void;
    dictionaryDeleted: (item: McDbDictionaryRecord) => void;
    dictionaryModified: (item: McDbDictionaryRecord) => void;
    currentDictionaryChanged: (val: string, oldVal?: string) => void;
} & McDbObjectEventType;
type McFetchEntities = (entity: McDbEntity) => void;
type McGripMenuFun = (menu: string, grip: McDbGrip) => boolean;
type McGripEditFinishFun = (grip: McDbGrip, point: McGeVector3) => void;
type McGripEditCancelFun = (grip: McDbGrip) => void;
type McGripWorldDrawFun = (grip: McDbGrip, point: McGeVector3, prDrawRender: McPrDrawRender) => void;
type McGripClickFun = (grip: McDbGrip) => void;
type McDbMTextContextStyleProperty = {
    propertyType: McDbMTextContextPropertyType;
    enable?: boolean;
    value?: any;
};
type McDbMTextContextStyleChangeFun = (propertyType: McDbMTextContextStyleProperty) => void;
type McDbMTextContextStyleInitFun = (properties: McDbMTextContextStyleProperty[]) => void;
type McDbMTextContextStylePanelFun = (event: McDbMTextContextPropertyEvent) => void;
export type { McLineTypeName, McDbObjectId, McDbObjectIdArray, McDbObjectEventType, McDbDatabaseEventType, McFetchEntities, McGripMenuFun, McGripEditFinishFun, McGripEditCancelFun, McGripWorldDrawFun, McDbMTextContextStyleProperty, McDbMTextContextStyleChangeFun, McDbMTextContextStyleInitFun, McDbMTextContextStylePanelFun, McGripClickFun, McDbSymbolTableEventType, McDbDictionaryEventType, McDbEntityTableEventType, };
