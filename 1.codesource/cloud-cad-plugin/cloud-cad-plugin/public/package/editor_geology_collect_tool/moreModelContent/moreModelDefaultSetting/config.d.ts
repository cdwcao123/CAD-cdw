import { type MoreModelDefaultSettingOpenPayload } from './moreModelDefaultSettingUIManager';
/**
 * 打开地质模型库绘制面板
 * @param payload 打开面板入参（实体 ID / 模型 ID / 模型名称）
 * @returns 是否成功打开
 */
export declare const openMoreModelDefaultSetting: (payload: MoreModelDefaultSettingOpenPayload) => Promise<boolean>;
/**
 * 清除所有地质模型顶部菜单动态添加的模型缓存（不影响绘制面板 ribbon JSON 缓存）。
 * @returns 实际删除的缓存条目数
 */
export declare const clearGeoModelTopMenuCache: () => Promise<number>;
/**
 * 清除全部地质模型配置面板缓存（全链路，与 CLEARGEOLOGYPANELCACHE 菜单动作一一对应）：
 * 1. 顶部菜单动态模型（mcMoreModelPanelCacheDb topMenuStore）；
 * 2. 绘制面板 Ribbon JSON 持久化（mcMoreModelPanelCacheDb panelStore）；
 * 3. 特性面板脚本缓存（内存 moreModelPropertyCache + 持久化 moreModelPropertyJsonCache）；
 * 4. McGeoModelUIExchange 单例快照 + 并发 init Promise；
 * 5. McGeoModelUIExchange 单例当前加载的 6 条内部引用（强制下次 init 重新走接口请求 + parse/assemble）。
 * @returns 各缓存条目删除的计数汇总（便于问题排查）
 */
export declare const clearGeoModelPanelMenuCache: () => Promise<{
    topMenu: number;
    panelJson: number;
    property: number;
}>;
/**
 * 注册"打开更多模型配置面板"命令，并绑定 McGeoModelUIExchange 单例事件回调 + 启动时恢复已添加的模型菜单
 * @description 1. 启动 restoreMoreModelDefMenu：从 mcMoreModelPanelCacheDb 读取"已添加到当前菜单"的模型，重新挂到 TopMenu；
 * 2. 调用 bindUIExchangeEvents 订阅 drawPanelOpen/drawPanelClosed 事件，统一由核心侧 DRAWGEOMODEL 命令控制面板开关；
 * 3. 将 OPENMOREMODELDEFAULTSETTING（旧面板打开入口）+ CLEARGEOLOGYTOPMENUCACHE（清顶部菜单缓存）两个命令注册为 McCore 编辑命令，向后兼容。
 */
export declare const installMoreModelDefaultSetting: () => void;
