import { BasePropertyScript, PropertyType } from 'McEditor';
import { type McDbWorkFaceInstance, type McDbWorkFaceStatusValue } from '@/utils/pluginApi';
type McDbWorkFace = McDbWorkFaceInstance;
type McDbWorkFaceStatus = McDbWorkFaceStatusValue;
type WorkFaceFieldValue = string | number | McDbWorkFaceStatus;
interface WorkFaceHeaderActionContext {
    groupKey?: string;
    group?: GroupPropertyType<McDbWorkFace>;
    modelValue?: Record<string, unknown>;
    entities: McDbWorkFace[];
    entity?: McDbWorkFace;
}
interface WorkFaceHeaderAction {
    isShow?: boolean | ((ctx: WorkFaceHeaderActionContext) => boolean);
    label: string;
    onClick?: (ctx: WorkFaceHeaderActionContext) => Promise<void> | void;
}
export interface GroupPropertyType<T> {
    key: string;
    name: string;
    headerAction?: WorkFaceHeaderAction;
    property: PropertyType<T>[];
}
type WorkFaceGroupKey = 'propertiesBasic' | 'propertiesProduction' | 'ventilation';
interface WorkFaceFieldDef {
    groupKey: WorkFaceGroupKey;
    key: string;
    label: string;
    defaultValue: WorkFaceFieldValue;
    controlType: PropertyType<McDbWorkFace>['controlType'];
    isEdit?: boolean;
    valueType: 'string' | 'number' | 'enum';
    unit?: string;
    constraint?: string;
    getValue: (entity: McDbWorkFace) => WorkFaceFieldValue;
    setValue: (entity: McDbWorkFace, value: unknown) => void;
}
interface WorkFaceFieldMeta {
    groupKey: WorkFaceGroupKey;
    key: string;
    label: string;
    valueType: WorkFaceFieldDef['valueType'];
    defaultValue: WorkFaceFieldValue;
    unit?: string;
    constraint?: string;
}
export declare const workFaceFieldMetaList: WorkFaceFieldMeta[];
export declare const workFacePanelConfig: BasePropertyScript<McDbWorkFace>['panelConfig'];
export declare const workFaceProperties: Map<string, GroupPropertyType<McDbWorkFace>>;
export {};
