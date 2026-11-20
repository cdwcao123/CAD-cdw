import { McEventReactor } from 'McCore';
import { GeoModelDefInfo, McGeoDrawPanelDescriptor, McGeoFeatureClassDefInfo, McGeoPropertyGroupDescriptor } from './types/interface';
import type { McGeoStyle } from './style/mcGeoStyle';
import type { McGeoFieldMap } from './types/type';
export type { GeoModelDefInfo, McGeoFeatureClassDefInfo, McGeoModelUIExchangeInfo, } from './types/interface';
/**
 * 地质模型 UI 交互事件类型
 */
export type GeoModelUIExchangeEventType = {
    /** 初始化完成（请求、解析、组装全部结束） */
    initFinished: () => void;
    /** 绘制面板关闭 */
    drawPanelClosed: () => void;
    /** 绘制面板打开 */
    drawPanelOpen: () => void;
};
/**
 * 地质模型 UI 交互单例类
 * @description 地质模型数据与 UI 的唯一交互枢纽：
 * 1. 按 modelId 请求接口（模型基础 / 要素类 Schema / 样式分类 / 样式明细）；
 * 2. 解析并完成样式二维/三维分类（CAD=二维，3D=三维，2D 忽略）；
 * 3. 组装内核格式（exchangeInfo）、特性面板中性描述、绘制面板中性描述；
 * 4. 提供 getter 供 editor 侧消费；持久化缓存与 UI 运行时化由 editor 完成。
 */
export declare class McGeoModelUIExchange extends McEventReactor<GeoModelUIExchangeEventType> {
    #private;
    /** 单例实例 */
    private static instance;
    /** @internal 兼容兜底：单例私有引用快照（init 成功后 cloneDeep，保证 cached 命中时同步切换）。类型 any 兜底旧 TS target 不识别私有字段声明。 */
    private readonly _modelSnapshotMap;
    /** 绘制面板关闭事件的 Promise resolve 函数 */
    resolve: ((data?: any) => void) | null;
    /** 绘制面板关闭事件的 Promise reject 函数 */
    reject: ((reason?: any) => void) | null;
    private constructor();
    /**
     * 获取单例实例
     * @returns McGeoModelUIExchange 单例
     */
    static getInstance(): McGeoModelUIExchange;
    /**
     * 初始化地质模型数据
     * @description 请求并解析接口数据，组装内核格式与两份面板描述；
     * 同一 modelId 并发调用会复用同一个 Promise；成功后触发 initFinished 事件。
     * @param modelId 数据模型 ID
     * @returns 是否初始化成功
     * @example
     * const ok = await mcGeoModelUIExchange.init(modelId);
     */
    init(modelId: string): Promise<boolean>;
    /**
     * 获取模型定义信息
     * @returns 模型定义信息
     */
    getModelDefInfo(): GeoModelDefInfo | undefined;
    /**
     * 设置模型定义信息
     * @param id 模型id
     * @param name 模型名字
     * @param type 模型类型
     */
    setModelDefInfo(id?: string | undefined, name?: string | undefined, type?: string | undefined): void;
    /**
     * 获取模型基础属性字段
     * @returns 模型基础属性字段映射
     */
    getMetaDataFields(): McGeoFieldMap | undefined;
    /**
     * 设置模型基础属性字段
     * @param key 字段名
     * @param value 字段值
     */
    setMetaDataFields(key: string, value: string): void;
    /**
     * 重置运行时字段为系统默认值（清理绘制前临时输入）
     * @description 不影响模型定义、接口缓存与已缓存的分组中性描述，只把「metaDataFields / featureClassFields / featureClassStyles」
     * Map 重新还原为 buildExchangeInfo 产出时的默认初值：
     *  - metaDataFields: 逐条还原为 modelSchema.meta[key].default
     *  - featureClassFields: 每条 classID 还原为 schema 的 attr/geometry 字段默认值
     *  - featureClassStyles: 每条 classID 原地还原为 styleOptions 默认选项（保留数组与样式对象引用，
     *    避免 drawGeoModel 在命令启动时捕获的样式引用因数组替换而失效，导致绘制预览颜色不同步）
     */
    resetRuntimeFields(): void;
    /**
     * 获取要素类定义信息列表
     * @returns 要素类定义信息列表
     */
    getFeatureClassDefInfos(): McGeoFeatureClassDefInfo[] | undefined;
    /**
     * 设置指定要素类的定义信息
     * @param featureClassId 要素类 ID
     * @param featureClassDefInfo 要素类定义信息
     */
    setFeatureClassDefInfo(featureClassId: string, featureClassDefInfo: McGeoFeatureClassDefInfo): void;
    /**
     * 获取指定要素类的字段
     * @param featureClassId 要素类 ID
     * @returns McGeoFieldMap 映射
     */
    getFeatureClassFields(featureClassId: string): McGeoFieldMap | undefined;
    /**
     * 设置指定要素类的字段
     * @param featureClassId 要素类 ID
     * @param key 字段名
     * @param value 字段值
     */
    setFeatureClassFields(featureClassId: string, key: string, value: string): void;
    /**
     * 获取指定要素类的样式
     * @param featureClassId 要素类 ID
     * @returns McGeoStyle 数组
     */
    getFeatureClassStyle(featureClassId: string): McGeoStyle[] | undefined;
    /**
     * 获取指定要素类的样式（可按视图类型过滤）
     * @param featureClassId 要素类 ID
     * @param viewType 视图类型（CAD / 3D），不传返回全部
     * @returns McGeoStyle 数组
     */
    getFeatureClassStyles(featureClassId: string, viewType?: string): McGeoStyle[] | undefined;
    /**
     * 获取线类要素当前样式
     * @param featureClassId 要素类 ID
     * @returns McGeoStyle 数组
     */
    getLineClassStyle(featureClassId: string): McGeoStyle[] | undefined;
    /**
     * 设置指定要素类的样式
     * @param featureClassId 要素类 ID
     * @param styles McGeoStyle 数组
     */
    setFeatureClassStyle(featureClassId: string, styles: McGeoStyle[]): void;
    /**
     * 更新指定要素类的某个样式
     * @param featureClassId 要素类 ID
     * @param nIndex 样式索引
     * @param style 新的样式对象
     */
    updateFeatureClassStyle(featureClassId: string, nIndex: number, style: McGeoStyle): void;
    /**
     * 获取特性面板脚本（中性分组树描述）
     * @returns 特性面板分组树描述
     */
    getPropertyPanelScript(): McGeoPropertyGroupDescriptor[] | undefined;
    /**
     * 获取绘制面板脚本（中性描述）
     * @returns 绘制面板中性描述
     */
    getDrawPanelScript(): McGeoDrawPanelDescriptor | undefined;
    /**
     * 是否已完成初始化
     * @returns 是否已初始化
     */
    isInitialized(): boolean;
    /**
     * 同步切换到目标 modelId 的快照并返回其特性面板描述符（供特性面板脚本构造函数同步初始化使用）。
     * @description 绘制阶段已通过 init(modelId) 写入快照，特性面板首次打开时无需再走异步接口请求，
     * 直接同步切快照即可拿到 getPropertyPanelScript()，规避构造函数异步回填导致面板空白的时序问题。
     * @param modelId 模型 ID
     * @returns 特性面板中性分组树描述；无快照或描述符为空时返回 undefined
     */
    getPropertyPanelScriptByModelId(modelId: string): McGeoPropertyGroupDescriptor[] | undefined;
    /**
     * 强制将内部 6 条引用同步切换为目标 modelId 对应快照（同步），保证 init cached 命中时同事的同步 get*() 立刻拿到目标模型。
     * 无快照时返回 false，调用方负责走 doInit 分支。
     * @internal 仅本类内部使用
     */
    private syncToSnapshot;
    /**
     * UI 面板关闭时由 moreModelDefaultSettingUIManager.closePanel 通知：
     * 1) resetRuntimeFields 回当前模型接口默认；2) 清空 resolve/reject 防止闭包残留
     */
    closePanel(): void;
    /**
     * 清除所有模型快照（_modelSnapshotMap）与并发 init Promise 缓存（#initPromiseMap）。
     * 由 CLEARGEOLOGYPANELCACHE 命令调用：确保下一次打开同一模型不会命中旧快照，强制走接口请求分支。
     */
    clearAllSnapshots(): void;
    /**
     * 释放单例当前加载的模型引用（6 条内部引用 + initPromiseMap + 快照 + resolve/reject 闭包）。
     * 由 CLEARGEOLOGYPANELCACHE 命令调用：
     * 清缓存后如果用户再次点击积水区菜单，McGeoModelUIExchange.init 会被识别为"首次初始化"，
     * 严格重新请求接口（parse/assemble 全部重跑），不保留任何旧模型的数据残留。
     */
    deinit(): void;
}
