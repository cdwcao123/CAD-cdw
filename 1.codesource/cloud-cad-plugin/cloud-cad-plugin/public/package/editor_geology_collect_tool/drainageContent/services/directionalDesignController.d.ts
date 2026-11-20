import type { DirectionalDesignController } from '../types/interface';
import type { NodeModuleDefine } from 'McEditor';
/**
 * 创建定向钻设计会话，以 Core 的绘制、拾取和计算接口驱动参数面板。
 * @param openPanel 挂载或刷新本会话的参数面板，返回挂载结果。
 * @param closePanel 移除参数面板并返回抽采菜单。
 * @returns 会话的打开和关闭入口；关闭或换图后不回填异步结果。
 */
export declare function createDirectionalDesignController(openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void): DirectionalDesignController;
