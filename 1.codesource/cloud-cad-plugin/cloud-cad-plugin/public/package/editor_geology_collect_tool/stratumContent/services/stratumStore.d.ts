import type { StratumChangeListener, StratumModel } from '../../types';
/**
 * 使用新列表替换 store，并按 stratum_sort 升序排序后通知订阅者。
 *
 * @param nextModels 待写入的完整地层列表；函数会克隆每个模型。
 */
export declare const setStratumModels: (nextModels: StratumModel[]) => void;
/**
 * 从服务端加载当前工作区矿井的地层配置，不请求三角网数据。
 * @returns 完成映射和排序后的独立列表快照。
 * @throws 工作区缺少矿井编码、接口失败或业务响应异常时清空旧列表并透传错误。
 */
export declare const loadStratumModels: () => Promise<StratumModel[]>;
/** @returns 当前地层列表的独立快照。 */
export declare const getStratumModels: () => StratumModel[];
/**
 * 订阅地层列表变化。
 *
 * @param listener 接收独立列表快照的监听器。
 * @returns 取消当前订阅的函数。
 */
export declare const subscribeStratumModels: (listener: StratumChangeListener) => (() => void);
/** @returns 供 Vue 组件响应式读取的只读地层列表。 */
export declare const useStratumModels: () => Readonly<import("vue").Ref<readonly {
    readonly Id: string;
    readonly stratum_code: string;
    readonly stratum_name: string;
    readonly stratum_type: string;
    readonly stratum_color: string;
    readonly stratum_sort: number;
    readonly is_mark_layer: number;
    readonly is_aquifer: number;
    readonly is_aquiclude: number;
    readonly stratum_path: string;
    readonly stratum_parentcode: string;
    readonly stratum_thickness_min: number;
    readonly stratum_thickness_max: number;
    readonly stratum_thickness_ave: number;
    readonly formation_lithology: string;
    readonly physical_characteristics: string;
    readonly hydrogeological_characteristics: string;
    readonly engineering_geological_characteristics: string;
    readonly lithology: string;
    readonly remark: string;
    readonly DeleteMark: number;
    readonly CreateDateTime: string;
    readonly CreateUserId: string;
    readonly CreateCompanyId: string;
    readonly CreateDepartmentId: string;
    readonly UpdateUserId: string;
    readonly UpdateDateTime: string;
    readonly coordinate: string;
    readonly vertexInfo: string;
    readonly refineCoord: string;
    readonly MineCode: string;
}[], readonly {
    readonly Id: string;
    readonly stratum_code: string;
    readonly stratum_name: string;
    readonly stratum_type: string;
    readonly stratum_color: string;
    readonly stratum_sort: number;
    readonly is_mark_layer: number;
    readonly is_aquifer: number;
    readonly is_aquiclude: number;
    readonly stratum_path: string;
    readonly stratum_parentcode: string;
    readonly stratum_thickness_min: number;
    readonly stratum_thickness_max: number;
    readonly stratum_thickness_ave: number;
    readonly formation_lithology: string;
    readonly physical_characteristics: string;
    readonly hydrogeological_characteristics: string;
    readonly engineering_geological_characteristics: string;
    readonly lithology: string;
    readonly remark: string;
    readonly DeleteMark: number;
    readonly CreateDateTime: string;
    readonly CreateUserId: string;
    readonly CreateCompanyId: string;
    readonly CreateDepartmentId: string;
    readonly UpdateUserId: string;
    readonly UpdateDateTime: string;
    readonly coordinate: string;
    readonly vertexInfo: string;
    readonly refineCoord: string;
    readonly MineCode: string;
}[]>>;
/** @returns 供 Vue 组件响应式读取的只读加载状态。 */
export declare const useStratumLoading: () => Readonly<import("vue").Ref<boolean, boolean>>;
/**
 * 将当前本地列表以 `{ data: StratumModel[] }` 全量提交服务端。
 * 新增、修改、删除及排序都必须提交完整快照，不能只提交差异项。
 *
 * @throws HTTP 请求失败或服务端业务码不是 200 时抛出保存错误。
 */
export declare const saveStratumModels: () => Promise<void>;
/**
 * 保存一个更新过顶点集合的完整地层对象。
 *
 * @param model 已更新 `vertexInfo` 的地层信息对象。
 * @throws HTTP 请求失败或服务端业务码不是 200 时抛出保存错误。
 */
export declare const saveStratumEntity: (model: StratumModel) => Promise<void>;
/**
 * 按 Id 新增或替换一个本地地层模型，并触发排序和列表通知。
 *
 * @param model 待写入的完整地层模型。
 */
export declare const upsertStratumModel: (model: StratumModel) => void;
/**
 * 从本地列表移除指定地层。
 *
 * @param id 待移除的地层模型 Id。
 */
export declare const removeStratumModel: (id: string) => void;
/**
 * 将指定地层向前或向后移动一位，并交换相邻模型的 stratum_sort。
 *
 * @param id 待移动的地层模型 Id。
 * @param offset 移动方向：-1 向前，1 向后。
 * @returns 成功交换返回 true；模型不存在或已到边界返回 false。
 */
export declare const moveStratumModel: (id: string, offset: -1 | 1) => boolean;
