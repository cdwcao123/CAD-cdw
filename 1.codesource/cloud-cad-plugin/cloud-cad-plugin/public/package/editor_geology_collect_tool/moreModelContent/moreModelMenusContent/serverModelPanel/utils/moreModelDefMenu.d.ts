/** 新增模型定义实体参数。 */
export interface MoreModelDefParams {
    modelId: string;
    name: string;
    icon?: string;
}
/** 创建“更多模型”定义参数（扩展）。 */
export interface CreateMoreModelDefEntityOptions extends MoreModelDefParams {
    /** 是否直接进入 DRAWGEOMODEL 绘制流程并打开面板；默认 true（向后兼容）。传 false 时仅写入 pendingPayload，由调用方后续执行命令。 */
    autoOpenPanel?: boolean;
}
/**
 * 判断“更多模型”顶部菜单中是否存在指定模型定义的菜单项（modelId 匹配）。
 * @description 复用 add / remove 共用的 layout 递归匹配逻辑，避免 serverModelPanel 层再重复写遍历。
 */
export declare const existsMoreModelDefInMenu: (modelIdIn: string) => boolean;
/**
 * 在“更多模型”面板第一顺位添加一个模型定义菜单项：
 * 新菜单项累积到第一行的模型数组中，结构为 [[[item1, item2, …], moreModelTestEntity], …]。
 * 添加成功后会同步写入 moreModelPanelCacheDb 的顶部菜单缓存（刷新浏览器后自动还原）。
 */
export declare const addMoreModelDefToMenu: (params: MoreModelDefParams) => Promise<boolean>;
/**
 * 从“更多模型”面板删除一个模型定义菜单项（与 addMoreModelDefToMenu 对称）：
 * 1. 在 TopMenu layout 的 modelGroup 中删除 key=moreModelDef_${modelId} 的项；
 * 2. 同步从 mcMoreModelPanelCacheDb 的顶部菜单缓存删除（刷新后不再自动还原）。
 */
export declare const removeMoreModelDefFromMenu: (modelIdIn: string) => Promise<boolean>;
/**
 * 启动（installMoreModelDefaultSetting）时从 mcMoreModelPanelCacheDb 读取"已添加到当前菜单"的
 * 模型定义，并逐一调用 addMoreModelDefToMenu 补回顶部菜单。
 * 保证刷新页面 / 重新进入图纸后用户添加过的模型菜单仍然可见。addMoreModelDefToMenu 内部已做去重，重复调用安全。
 */
export declare const restoreMoreModelDefMenu: () => Promise<number>;
/**
 * 开始地质模型库绘制流程（与 DRAWGEOMODEL 命令联动）。
 * @description 不再创建 McDbCustomEntity 占位实体也不做高亮选中，仅：
 * 1. init McGeoModelUIExchange(modelId) 拉取模型 Schema 与样式；
 * 2. 写入 pendingPayload，等收到 drawPanelOpen 事件时消费并打开面板；
 * 3. autoOpenPanel=true（默认）时立即执行 DRAWGEOMODEL 命令，由核心命令通过事件驱动面板打开。
 */
export declare const createMoreModelDefEntity: (params: CreateMoreModelDefEntityOptions) => Promise<boolean>;
