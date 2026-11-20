import { getCoreGeologyCollectTool } from '@/utils/pluginApi';
type CoreGeologyCollectTool = NonNullable<ReturnType<typeof getCoreGeologyCollectTool>>;
type TunnelDrawStylePropertyEvent = Parameters<NonNullable<Parameters<CoreGeologyCollectTool['McDbTunnelDrawStyle']['instance']['setContextStylePanelFun']>[0]>>[0];
/**
 *巷道配置面板UI管理器
 */
declare class TunnelDefaultSettingUIManager {
    private readonly moduleKey; /** 模块键 */
    private readonly panelKey; /** 面板键 */
    private isPanelActive; /** 面板是否激活 */
    private isMenuTriggerListening; /** 是否监听菜单触发事件 */
    private restartDrawTimer; /** 重新绘制定时器 */
    /**
     * 处理菜单触发事件
     * @param data 菜单触发事件数据
     */
    private handleMenuTrigger;
    /**
     * @description: 获取菜单触发事件主机
     * @returns 菜单触发事件主机或 null
     */
    private getMenuTriggerEventHost;
    /**
     * @description: 处理巷道配置面板事件
     * @param event巷道配置面板事件
     */
    handlePanelEvent: (event: TunnelDrawStylePropertyEvent) => Promise<void>;
    /**
     * @description: 打开巷道配置面板
     */
    private openPanel;
    /**
     * @description: 重启巷道绘制
     */
    private restartDrawTunnel;
    /**
     * @description: 监听菜单触发事件
     */
    private listenMenuTrigger;
    /**
     * @description: 取消监听菜单触发事件
     */
    private unlistenMenuTrigger;
    /**
     * @description: 关闭巷道配置面板
     */
    closePanel(options?: {
        notifyCore?: boolean;
        activateModuleKey?: string | null;
    }): void;
}
export declare const tunnelDefaultSettingUIManager: TunnelDefaultSettingUIManager;
export {};
