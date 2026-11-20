import { McColor } from 'McCore';
import { BasePropertyScript, PropertyType } from 'McEditor';
import { type McDbWorkFaceInstance, type McSeriesVentilationValue, type McDbWorkFaceStatusValue, type McWorkFaceVentilationTypeValue } from '@/utils/pluginApi';
type McDbWorkFace = McDbWorkFaceInstance;
type McDbWorkFaceStatus = McDbWorkFaceStatusValue;
type McWorkFaceVentilationType = McWorkFaceVentilationTypeValue;
type McSeriesVentilation = McSeriesVentilationValue;
type WorkFaceFieldValue = string | string[] | number | boolean | McColor | McDbWorkFaceStatus | McWorkFaceVentilationType | McSeriesVentilation;
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
type WorkFaceGroupKey = 'propertiesBasic' | 'propertiesProduction' | 'ventilation' | 'ventilationTunnelList' | 'propertiesStyles';
interface WorkFaceFieldDef {
    groupKey: WorkFaceGroupKey;
    key: string;
    label: string;
    defaultValue: WorkFaceFieldValue;
    controlType: PropertyType<McDbWorkFace>['controlType'];
    isEdit?: boolean;
    valueType: 'string' | 'number' | 'enum';
    labelWidth?: number;
    unit?: string;
    constraint?: string;
    getValue: (entity: McDbWorkFace) => WorkFaceFieldValue;
    setValue: (entity: McDbWorkFace, value: unknown) => void;
}
export declare const syncWorkFaceEnumLists: () => void;
/** 初始化所属水平和所属采区下拉选项 */
export declare const initHorizontalAndMiningOptions: (force?: boolean) => Promise<void>;
/** 初始化工作面相关下拉选项 */
export declare const initWorkFaceDropdownOptions: (force?: boolean) => Promise<void>;
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
/** 工作面特性面板页签配置 */
export declare const workFacePanelConfig: BasePropertyScript<McDbWorkFace>['panelConfig'];
export declare const workFaceProperties: Map<string, GroupPropertyType<McDbWorkFace>>;
export {};
