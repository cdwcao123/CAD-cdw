/**
 * 服务器模型面板相关类型定义
 */
export type ServerModelTabKey = 'server' | 'current';
/**
 * 服务器模型树节点类型
 */
export type ServerModelNodeType = 'root' | 'category' | 'model' | 'record' | 'feature';
/**
 * 服务器模型树节点数据类型
 */
export type ServerModelMenuKey = 'draw' | 'sync' | 'delete' | 'refresh' | 'more-draw' | 'add-to-current' | 'remove-from-current' | 'add-group' | 'add-model';
/**
 * 添加模型到当前弹窗数据类型
 * @property confirm 确认回调函数，返回一个对象，包含模型名称和图标，或者返回 false 表示取消添加模型
 * @property cancel 取消回调函数，返回一个 boolean，表示是否取消添加模型
 */
export type AddModelDefToCurrentDialogData = {
    confirm: () => {
        name: string;
        icon: string;
    } | false;
    cancel: () => boolean;
};
/**
 * 通用布尔弹窗数据类型
 */
export type BooleanDialogData = {
    confirm: () => Promise<boolean> | boolean;
    cancel: () => Promise<boolean> | boolean;
};
/** 添加数据模型组弹窗数据类型 */
export type AddDataModelGroupDialogData = BooleanDialogData;
/** 服务器模型同步弹窗数据类型 */
export type ServerModelSyncDialogData = BooleanDialogData;
/** 同步模式 */
export type SyncMode = 'normal' | 'force' | 'preview';
export type SyncSectionKey = 'conflict' | 'sync' | 'local' | 'server';
export type SyncDialogData = BooleanDialogData;
/** 添加数据模型弹窗数据类型 */
export type AddDataModelDialogData = BooleanDialogData;
export type TableRef = {
    clearSelection?: () => void;
    toggleRowSelection?: (row: SyncRow, selected?: boolean) => void;
};
/** 要素类同步快照项 */
export type GeoModelSyncFeatureSnapshot = {
    id: string;
    name: string;
    label: string;
    featureCount: number;
    geometryTypes: string[];
    fieldKeys: string[];
    signature: string;
};
/** 同步记录 */
export type GeoModelSyncRecord = {
    origin: 'local' | 'server';
    modelId: string;
    modelName: string;
    modelType: string;
    recordId: string;
    recordName: string;
    businessKey: string;
    compareKey: string;
    fieldRecord: Record<string, unknown>;
    featureSummary: GeoModelSyncFeatureSnapshot[];
    featureCount: number;
    summary: string;
    comparePayload: string;
    adapterState: 'ready' | 'pending';
    pendingReason?: string;
    raw: unknown;
};
/** 同步记录行 */
export type SyncRow = {
    id: string;
    name: string;
    code: string;
    updatedAt: string;
    summary: string;
    actionLabel: string;
    sourceLabel: string;
    enabled: boolean;
    modelId: string;
    diffFields: string[];
    businessKey: string;
    compareKey: string;
    localRecord: GeoModelSyncRecord | null;
    serverRecord: GeoModelSyncRecord | null;
};
/** 要素类原始项 */
export type SourceQueryFeatureClass = Record<string, unknown> & {
    id?: string;
    className?: string;
    classLabel?: string;
    features?: Record<string, unknown>[];
};
/** 模型记录原始项 */
export type SourceQueryModelRecord = Record<string, unknown> & {
    id?: string;
    ID?: string;
    modelId?: string;
    modelName?: string;
    name?: string;
    Name?: string;
    fields?: unknown;
    metaData?: Record<string, unknown>;
    featureClasses?: SourceQueryFeatureClass[];
};
/** 要素类 Schema 原始项 */
export type FeatureClassSchemaItem = Record<string, unknown> & {
    ID?: string;
    ClassName?: string;
    ClassLabel?: string;
};
/** 模型 Schema 原始项 */
export type GroupMeta = {
    groupId: string;
    parentGroupId: string;
    groupName: string;
};
/** 模型 Schema 原始项 */
export type ModelMeta = {
    modelId: string;
    modelName: string;
    groupId: string;
    groupName: string;
};
/** 模型 Schema 原始项 */
export type SourceRecordMeta = {
    recordId: string;
    recordName: string;
};
/** 应用源模型的特征样式到目标模型 */
type SourceFeatureStyle = Record<string, unknown>;
type SourceFeature = {
    styles?: SourceFeatureStyle[];
};
export type SourceFeatureClass = {
    features?: SourceFeature[];
};
export {};
