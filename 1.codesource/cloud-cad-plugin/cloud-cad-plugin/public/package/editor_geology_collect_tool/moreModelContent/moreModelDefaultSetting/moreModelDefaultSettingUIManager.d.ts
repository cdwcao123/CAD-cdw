/**
 * 打开地质模型库绘制面板的入参
 */
export interface MoreModelDefaultSettingOpenPayload {
    /** 模型实体 ID（用于获取实体并绑定修改监听） */
    entityId: string;
    /** 数据模型 ID（接口请求与缓存唯一键） */
    modelId: string;
    /** 数据模型名称 */
    modelName: string;
}
/**
 * 绘制面板全局状态
 * @description 记录当前打开的模型信息与刷新版本号，供外部读取/监听。
 */
export declare const moreModelDefaultSettingState: {
    entityId: string;
    modelId: string;
    modelName: string;
    version: number;
};
export declare const withSuppressPanelRefresh: <T>(fn: () => T | Promise<T>) => Promise<T>;
/**
 * 地质模型库绘制面板 UI 管理器
 * @description 负责面板生命周期：
 * 1. 打开：保存当前模块 -> 构建/读取缓存 ribbon module -> 挂载并激活顶部面板；
 * 2. 刷新：实体 modified 或显式触发时重建面板布局；
 * 3. 关闭：移除模块、解绑实体监听、恢复上次激活模块。
 */
declare class MoreModelDefaultSettingUIManager {
    private readonly moduleKey;
    private isPanelActive;
    private isMenuTriggerListening;
    private lastActiveModuleKey;
    private currentPayload;
    private currentEntity;
    private currentRefreshToken;
    private entityModifiedHandler;
    private restartDrawTimer;
    private pendingPayload;
    private uiExchangeBound;
    private suppressRibbonRebuild;
    /**
     * 生成面板唯一 key
     * @param fallbackLabel 兜底标签
     * @param globalIndex 全局自增计数
     * @returns 面板 key
     */
    private buildPanelsKey;
    /**
     * 判断是否为 Ribbon 布局数组（行数组）
     * @param value 待判断值
     * @returns 是否为二维数组
     */
    private isRibbonLayoutArray;
    /**
     * 归一化模块定义
     * @description 保证每个子面板都有唯一 key/label/icon/children：
     * 顶层布局数组会按模块标签展开为面板；无 key 的子面板自动生成 key。
     * @param moduleDefinition 原始模块定义
     * @returns 归一化后的模块定义
     */
    private normalizeModulePanels;
    /**
     * 顶部菜单触发事件处理
     * @description 面板激活期间：点击顶部（非面板）位置或切换到其他模块 Tab 时关闭本面板。
     * @param data 菜单触发数据
     */
    private handleMenuTrigger;
    /**
     * 获取菜单触发事件宿主（window.mcEditor）
     * @returns 事件宿主，不可用时返回 null
     */
    private getMenuTriggerEventHost;
    /**
     * 记录当前激活模块，供关闭后回退
     * @param topMenuManager 顶部菜单管理器
     */
    private saveLastActiveModule;
    /**
     * 解析关闭面板后应回退激活的模块 key
     * @description 优先上次激活模块 -> defaultModuleData -> 其余可用模块。
     * @param topMenuManager 顶部菜单管理器
     * @returns 回退模块 key 或 null
     */
    private resolveFallbackModuleKey;
    /**
     * 监听顶部菜单触发事件
     */
    private listenMenuTrigger;
    /**
     * 取消监听顶部菜单触发事件
     */
    private unlistenMenuTrigger;
    /**
     * 按实体 ID 从当前图形数据库获取实体
     * @param objectId 实体 ID
     * @returns 实体对象或 null
     */
    private getEntityById;
    /**
     * 解包 Vue 响应式实体（取 __v_raw）
     * @param entity 实体
     * @returns 原始实体
     */
    private unwrapEntity;
    /**
     * 解绑实体 modified 监听
     */
    private clearEntityListener;
    /**
     * 绑定实体 modified 监听（实体修改时自动刷新面板布局）
     * @param entity 实体
     */
    private bindEntityListener;
    /**
     * 挂载面板模块到顶部菜单
     * @description 先移除旧模块，再归一化定义并调用 addModulePanel；
     * 遍历子节点 key 做去重（重复 key 追加 __dup_N 后缀）。
     * @param topMenuManager 顶部菜单管理器
     * @param rawModuleDefinition 原始模块定义
     * @returns 是否挂载成功
     */
    private ensurePanelModule;
    /**
     * 刷新面板布局
     * @description 通过实体 + modelId 构建 ribbon module（读取缓存或重建），
     * 用刷新令牌避免并发刷新覆盖；成功后重新挂载模块并绑定实体监听。
     * @returns 是否刷新成功
     */
    private refreshPanelLayout;
    /**
     * 打开地质模型库绘制面板
     * @param payload 打开入参（实体 ID / 模型 ID / 模型名称）
     * @returns 是否成功打开并激活
     */
    openPanel(payload: MoreModelDefaultSettingOpenPayload): Promise<boolean>;
    /**
     * 获取 McGeoModelUIExchange 单例实例（通过 getCoreGeologyCollectTool().McGeoModelUIExchange.getInstance）
     * 对齐巷道/管线从 getCoreGeologyCollectTool 取单例实例的方式。
     */
    private getUIExchange;
    /**
     * 等待 UIExchange 初始化完成（未初始化则主动 init）
     * @param modelId 目标模型 ID
     */
    private ensureExchangeInitialized;
    /**
     * 设置待消费的面板 payload（一次性）
     * @description createMoreModelDefEntity 调用后保存 payload，等收到 drawPanelOpen 事件时消费。
     * @param payload 打开面板入参
     */
    setPendingPayload(payload: MoreModelDefaultSettingOpenPayload): void;
    /**
     * 消费待消费的面板 payload（一次性）
     * @returns payload 或 null
     */
    private consumePendingPayload;
    /**
     * 绑定 McGeoModelUIExchange 事件（仅绑定一次）
     * @description installMoreModelDefaultSetting 时调用：
     *  - drawPanelOpen：消费 pendingPayload 并打开面板（或从 UIExchange.getModelDefInfo 兜底读取）；
     *  - drawPanelClosed：核心主动关面板时，UI 侧同步关闭且不再反向通知核心。
     */
    bindUIExchangeEvents(): void;
    /**
     * 关闭地质模型库绘制面板
     * @param options.activateModuleKey 关闭后激活的目标模块；未传则 fallback 到上次激活模块
     * @param options.notifyCore       true=前端主动关闭（通知内核中断命令 + 发 drawPanelClosed）；
     *                                 false=内核侧命令结束反向通知（只清 UI，不重复通知内核，避免闭环）
     */
    closePanel(options?: {
        activateModuleKey?: string | null;
        notifyCore?: boolean;
    }): void;
    /**
     * 面板是否处于激活状态
     * @returns 是否激活
     */
    isActive(): boolean;
    /**
     * 获取当前实体
     * @returns 实体对象或 null
     */
    getCurrentEntity(): any | null;
    /**
     * 获取当前打开入参
     * @returns 打开入参或 null
     */
    getCurrentPayload(): MoreModelDefaultSettingOpenPayload | null;
}
/** 地质模型库绘制面板 UI 管理器单例 */
export declare const moreModelDefaultSettingUIManager: MoreModelDefaultSettingUIManager;
/**
 * 打开地质模型库绘制面板（模块级便捷方法）7
 * @param payload 打开入参
 * @returns 是否成功打开
 */
export declare const openMoreModelDefaultSetting: (payload: MoreModelDefaultSettingOpenPayload) => Promise<boolean>;
/**
 * 关闭地质模型库绘制面板（模块级便捷方法）
 * @param options 关闭选项
 */
export declare const closeMoreModelDefaultSetting: (options?: {
    activateModuleKey?: string | null;
}) => void;
export {};
