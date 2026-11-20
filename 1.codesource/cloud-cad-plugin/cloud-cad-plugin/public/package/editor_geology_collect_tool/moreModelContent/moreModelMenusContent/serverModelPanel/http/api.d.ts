import { responseType } from 'McCore';
import type { ServerModelBaseListRequest, ServerModelGroupListRequest, CurrentUserResponseData, ServerModelGroupItem, ServerModelBaseItem } from '../types';
export type CurrentUserInfoResponse = responseType<CurrentUserResponseData>;
export type ServerModelGroupListResponse = responseType<ServerModelGroupItem[]>;
export type ServerModelBaseListResponse = responseType<ServerModelBaseItem[]>;
/** 弹窗分组树节点：分组基础信息 + 子分组。 */
export interface DataModelGroupItem extends ServerModelGroupItem {
    children?: DataModelGroupItem[];
}
/** 保存地质模型库分组参数。 */
export interface SaveDataModelGroupParams {
    GroupName: string;
    ParentID?: string | null;
    visible?: boolean;
    readable?: boolean;
    writeable?: boolean;
    [key: string]: unknown;
}
/** 保存地质模型库类型（数据模型基础信息）参数。 */
export interface SaveDataModelBaseParams {
    ModelName: string;
    ModelGroup?: string | null;
    Industry?: string;
    BusinessType?: string;
    Type?: string;
    Icon?: string | null;
    Remark?: string;
    visible?: boolean;
    readable?: boolean;
    writeable?: boolean;
    [key: string]: unknown;
}
/** 获取服务器模型分组列表。 */
export declare const getServerModelGroupListApi: (params: ServerModelGroupListRequest) => Promise<ServerModelGroupListResponse>;
/** 获取地质模型库分组列表（供弹窗选择父级分组/所属分组）。 */
export declare const getDataModelGroupListApi: (params: ServerModelGroupListRequest) => Promise<ServerModelGroupListResponse>;
/** 获取服务器模型基础信息列表。 */
export declare const getServerModelBaseListApi: (params: ServerModelBaseListRequest) => Promise<ServerModelBaseListResponse>;
/** 保存地质模型库分组（新增/编辑共用）。 */
export declare const saveDataModelGroupApi: (params: SaveDataModelGroupParams) => Promise<ServerModelGroupListResponse>;
/** 保存地质模型库类型（新增/编辑共用）。 */
export declare const saveDataModelBaseApi: (params: SaveDataModelBaseParams) => Promise<ServerModelBaseListResponse>;
/** 删除地质模型库类型。 */
export declare const deleteDataModelBaseApi: (params: {
    keyValue: string;
}) => Promise<ServerModelBaseListResponse>;
/** 获取当前登录用户信息。 */
export declare const getCurrentUserInfoApi: (params?: any) => Promise<CurrentUserInfoResponse>;
/** 删除地质模型库分组。 */
export declare const deleteDataModelGroupApi: (params: {
    keyValue: string;
}) => Promise<ServerModelGroupListResponse>;
export declare const serverModelPanelApi: {
    getServerModelGroupListApi: (params: ServerModelGroupListRequest) => Promise<ServerModelGroupListResponse>;
    getDataModelGroupListApi: (params: ServerModelGroupListRequest) => Promise<ServerModelGroupListResponse>;
    getServerModelBaseListApi: (params: ServerModelBaseListRequest) => Promise<ServerModelBaseListResponse>;
    saveDataModelGroupApi: (params: SaveDataModelGroupParams) => Promise<ServerModelGroupListResponse>;
    saveDataModelBaseApi: (params: SaveDataModelBaseParams) => Promise<ServerModelBaseListResponse>;
    deleteDataModelBaseApi: (params: {
        keyValue: string;
    }) => Promise<ServerModelBaseListResponse>;
    getCurrentUserInfoApi: (params?: any) => Promise<CurrentUserInfoResponse>;
    deleteDataModelGroupApi: (params: {
        keyValue: string;
    }) => Promise<ServerModelGroupListResponse>;
};
