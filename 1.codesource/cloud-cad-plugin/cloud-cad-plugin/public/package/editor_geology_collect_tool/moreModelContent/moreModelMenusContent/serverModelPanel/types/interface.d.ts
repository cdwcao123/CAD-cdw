import type { ServerModelNodeType } from './type';
/**
 * 服务器模型权限类型
 * @property visible 是否可见
 * @property readable 是否可读
 * @property writeable 是否可写
 */
export interface ServerModelPermission {
    visible: boolean;
    readable: boolean;
    writeable: boolean;
}
/**
 * 服务器模型组数据类型
 */
export interface ServerModelGroupItem {
    ID?: string;
    Id?: string;
    id?: string;
    ParentID?: string;
    ParentId?: string;
    parentId?: string;
    parentCode?: string;
    GroupName?: string;
    groupName?: string;
    Name?: string;
    name?: string;
    FullName?: string;
    EnCode?: string;
    MineCode?: string;
    mineCode?: string;
    CreateUserId?: string;
    CreateUserId_Text?: string;
    CreatorUserId?: string;
    CreatorUserName?: string;
    UpdateUserId?: string;
    UpdateUserId_Text?: string;
    UpdateUseId?: string;
    DeleteMark?: number;
    Icon?: string | null;
    CreateDateTime?: string;
    UpdateDateTime?: string | null;
    visible?: boolean | number | string;
    readable?: boolean | number | string;
    writeable?: boolean | number | string;
    Visible?: boolean | number | string;
    Readable?: boolean | number | string;
    Writeable?: boolean | number | string;
    [key: string]: any;
}
/**
 * 服务器模型基础数据类型
 */
export interface ServerModelBaseItem {
    ID?: string;
    Id?: string;
    id?: string;
    ModelId?: string;
    modelId?: string;
    Code?: string;
    code?: string;
    ParentID?: string;
    ParentId?: string;
    parentId?: string;
    parentCode?: string;
    GroupId?: string;
    GroupID?: string;
    DataModelGroupId?: string;
    DataModelGroupID?: string;
    ModelGroupId?: string;
    ModelGroupID?: string;
    ModelGroup?: string;
    ModelName?: string;
    modelName?: string;
    Name?: string;
    name?: string;
    FullName?: string;
    EnCode?: string;
    BusinessType?: string;
    BusinessType_Text?: string;
    CategoryName?: string;
    categoryName?: string;
    ModelType?: string;
    ModelTypeName?: string;
    CreateUserId?: string;
    CreateUserId_Text?: string;
    CreatorUserId?: string;
    CreatorUserName?: string;
    UpdateUserId?: string;
    UpdateUserId_Text?: string;
    UpdateUseId?: string;
    Industry?: string;
    IsEnable?: number;
    Type?: string;
    Icon?: string | null;
    Remark?: string;
    CreateDataTime?: string | null;
    UpdateDateTime?: string | null;
    DeleteMark?: number;
    visible?: boolean | number | string;
    readable?: boolean | number | string;
    writeable?: boolean | number | string;
    Visible?: boolean | number | string;
    Readable?: boolean | number | string;
    Writeable?: boolean | number | string;
    [key: string]: any;
}
/**
 * 当前用户信息类型
 */
export interface CurrentUserInfo {
    F_UserId?: string;
    UserId?: string;
    UserID?: string;
    userId?: string;
    F_Account?: string;
    Account?: string;
    account?: string;
    F_RealName?: string;
    RealName?: string;
    realName?: string;
    IsAdministrator?: boolean | number | string;
    isAdministrator?: boolean | number | string;
    IsAdmin?: boolean | number | string;
    isAdmin?: boolean | number | string;
    RoleName?: string;
    roleName?: string;
    [key: string]: any;
}
/**
 * 当前用户角色信息类型
 * @property F_RoleId 角色ID
 * @property F_EnCode 角色编码
 * @property F_FullName 角色名称
 * @property F_Category 角色分类
 */
export interface CurrentUserRoleInfo {
    F_RoleId?: string;
    F_EnCode?: string;
    F_FullName?: string;
    F_Category?: string;
    [key: string]: any;
}
/**
 * 当前用户响应数据类型
 * @property baseinfo 当前用户基本信息
 * @property post 当前用户岗位信息数组
 * @property role 当前用户角色信息数组
 * @property [key: string] 其他任意属性
 */
export interface CurrentUserResponseData {
    baseinfo?: CurrentUserInfo;
    post?: Record<string, any>[];
    role?: CurrentUserRoleInfo[];
    [key: string]: any;
}
/**
 * 服务器模型树节点数据类型
 * @property id 节点ID
 * @property label 节点标签
 * @property type 节点类型
 * @property icon 节点图标
 * @property visible 节点是否可见
 * @property readable 节点是否可读
 * @property writeable 节点是否可写
 * @property children 子节点数组
 * @property rawGroup 原始组数据对象
 * @property rawModel 原始模型数据对象
 */
export interface ServerModelNode {
    id: string;
    label: string;
    type: ServerModelNodeType;
    icon?: string;
    visible?: boolean;
    readable?: boolean;
    writeable?: boolean;
    children?: ServerModelNode[];
    rawGroup?: ServerModelGroupItem;
    rawModel?: ServerModelBaseItem;
    rawData?: Record<string, unknown>;
}
/**
 * 服务器模型组列表请求参数类型
 */
export interface ServerModelGroupListRequest extends Record<string, string | number> {
    queryJson: string;
}
/**
 * 服务器模型基础列表请求参数类型
 */
export interface ServerModelBaseListRequest extends Record<string, string | number> {
    queryJson: string;
}
