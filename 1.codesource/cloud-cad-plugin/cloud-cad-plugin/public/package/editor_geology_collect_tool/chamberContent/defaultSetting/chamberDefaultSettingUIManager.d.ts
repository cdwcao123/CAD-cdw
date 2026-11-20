/** 默认设置UI管理器 */
declare class ChamberDefaultSettingUIManager {
    private readonly moduleKey;
    private isPanelActive;
    private isMenuTriggerListening;
    private uiExchangeBound;
    private lastActiveModuleKey;
    private runtimeSyncTimer;
    /** 获取UI交换实例 */
    private getUIExchange;
    /** 获取菜单触发事件主机 */
    private getMenuTriggerEventHost;
    /** 保存当前激活模块键 */
    private saveLastActiveModule;
    /** 解析回退模块键 */
    private resolveFallbackModuleKey;
    /** 开始实时同步 */
    private startRuntimeSync;
    /** 停止实时同步 */
    private stopRuntimeSync;
    /** 处理菜单触发事件 */
    private handleMenuTrigger;
    /** 监听菜单触发事件 */
    private listenMenuTrigger;
    /** 取消监听菜单触发事件 */
    private unlistenMenuTrigger;
    /** 绑定UI交换事件处理函数 */
    bindUIExchangeEvents: () => void;
    /** 打开默认设置面板 */
    openPanel: () => Promise<boolean>;
    closePanel: (options?: {
        notifyCore?: boolean;
        activateModuleKey?: string | null;
    }) => void;
}
export declare const chamberDefaultSettingUIManager: ChamberDefaultSettingUIManager;
export {};
