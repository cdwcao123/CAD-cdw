import type { PipelineDrawStylePropertyEvent } from './types/index';
/**
 * 管线默认配置UI管理器
 */
declare class PipelineDefaultSettingUIManager {
    private readonly moduleKey; /** 模块键 */
    private readonly panelKey; /** 面板键 */
    private isPanelActive; /** 是否激活 */
    private isMenuTriggerListening; /** 是否监听菜单触发 */
    private restartDrawTimer; /** 重启绘制定时器 */
    /** 是否启用标高 */
    readonly isElevationEnabled: import("vue").Ref<boolean, boolean>;
    /**
     * 处理菜单触发事件
     * @param data 菜单触发事件
     */
    private handleMenuTrigger;
    /**
     * 获取菜单触发事件主机
     * @returns 菜单触发事件主机
     */
    private getMenuTriggerEventHost;
    /**
     * 设置是否启用标高
     * @param enabled 是否启用
     */
    private setElevationEnabled;
    /**
     * 处理面板事件
     * @param event 面板事件
     */
    handlePanelEvent: (event: PipelineDrawStylePropertyEvent) => Promise<void>;
    /**
     * 打开面板
     */
    openPanel(): Promise<void>;
    /**
     * 重启绘制管线
     */
    private restartDrawPipeline;
    /**
     * 监听菜单触发事件
     */
    private listenMenuTrigger;
    /**
     * 取消监听菜单触发事件
     */
    private unlistenMenuTrigger;
    /**
     * 关闭面板事件处理
     * @param options 关闭面板选项
     */
    closePanel(options?: {
        notifyCore?: boolean;
        activateModuleKey?: string | null;
    }): void;
}
export declare const pipelineDefaultSettingUIManager: PipelineDefaultSettingUIManager;
export {};
