import type { CurrentModelNodeType } from './type';
/** 服务器模型树下发到当前图形树的最小模型元数据。 */
export interface CurrentModelServerBinding {
    /** 服务器模型唯一标识。 */
    modelId: string;
    /** 服务器模型显示名称，对应当前图形树分组名称。 */
    modelName: string;
    /** 服务器模型业务分类，如“硐室”“含水层”。 */
    groupName: string;
    /** 服务器模型类型字段，用于图标与交互扩展。 */
    modelType: string;
    /** 对应服务器模型图标。 */
    icon?: string;
    /** 原始服务器模型数据。 */
    rawModel: Record<string, unknown>;
}
/** 当前图形中一个合法的服务器模型绘制实体。 */
export interface CurrentModelEntity {
    /** 实体在数据库实体表中的唯一标识。 */
    objectId: string;
    /** 实体自身显示名称。 */
    entityName: string;
    /** 实体运行时类型名。 */
    entityTypeName: string;
    /** 服务器模型唯一标识。 */
    serverModelId: string;
    /** 服务器模型显示名称。 */
    serverModelName: string;
    /** 服务器模型业务分类。 */
    serverGroupName: string;
    /** 服务器模型类型。 */
    serverModelType: string;
    /** 对应服务器模型图标。 */
    icon?: string;
    /** 原始服务器模型数据。 */
    rawServerModel: Record<string, unknown>;
    /** 实体原始对象，供命令/选择等后续逻辑使用。 */
    rawEntity: any;
}
/** 当前图形树中的一个服务器模型分组节点。 */
export interface CurrentModelItem {
    /** 分组键，固定使用服务器模型 ID。 */
    modelId: string;
    /** 分组显示名称，固定使用服务器模型名称。 */
    modelName: string;
    /** 服务器模型业务分类，如“硐室”。 */
    groupName: string;
    /** 服务器模型类型。 */
    modelType: string;
    /** 分组对应图标。 */
    icon?: string;
    /** 原始服务器模型数据。 */
    rawServerModel: Record<string, unknown>;
    /** 该服务器模型在当前图形中的全部绘制实体。 */
    entities: CurrentModelEntity[];
}
/** 当前图形模型树节点。 */
export interface CurrentModelNode {
    id: string;
    label: string;
    type: CurrentModelNodeType;
    /** 模型节点下的实体数量；根节点为全部模型数量。 */
    count?: number;
    icon?: string;
    visible?: boolean;
    readable?: boolean;
    writeable?: boolean;
    children?: CurrentModelNode[];
    rawModel?: CurrentModelItem;
    rawEntity?: CurrentModelEntity;
}
/** 扫描当前图形实体表时兼容的实体 xData 对象。 */
export interface CurrentModelXData {
    get?: (key: string) => unknown;
    set?: (key: string, value: unknown) => void;
    [key: string]: unknown;
}
/** 当前图形实体表 getEntities() 返回的兼容容器。 */
export interface CurrentModelEntityContainer {
    values?: () => Iterable<unknown>;
    toArray?: () => unknown[];
    forEach?: (callback: (value: unknown) => void) => void;
    [key: string]: unknown;
}
