import type { ThroughHoleDrawResult } from '../types/interface';
import type { DrainageStraightBoreholeCategory, DrawHoleController, EvaluationUnitMode, ThroughHoleMode } from '../types/type';
import type { McDbDrainageBorehole, McDbGasArea } from '@/core_geology_collect_tool/mcDrainageBorehole';
import type { NodeModuleDefine } from 'McEditor';
/** 评价单元复用穿层孔会话：等待当前 Core、获取已安装插件、打开面板并启动绘制。 */
export declare function createEvaluationUnitController(mode: EvaluationUnitMode, openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void): DrawHoleController<McDbGasArea>;
/**
 * 创建单孔面板控制器，默认参数按抽采单孔约定初始化。
 * @param openPanel 挂载并激活面板，返回是否成功。
 * @param closePanel 移除参数面板并返回抽采菜单。
 * @param category 菜单所属孔型，默认顺层孔；同时限定初始类型和面板可选类型。
 * @returns 返回单个钻孔或 null 的异步会话控制器。
 */
export declare function createDrawHoleController(openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void, category?: DrainageStraightBoreholeCategory): DrawHoleController;
/** editor 提供定向钻面板参数，调用 Core 绘制接口并复用关闭、Esc、换图的会话清理。 */
export declare function createDirectionalHoleController(openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void): DrawHoleController;
/**
 * 创建顺层面板控制器，打开后立即启动 Core 顺层绘制 API。
 * @param openPanel 挂载并激活面板，返回是否成功。
 * @param closePanel 移除参数面板并返回抽采菜单。
 * @returns 返回钻孔集合或 null 的异步会话控制器；空集合表示本次没有生成钻孔。
 */
export declare function createAlongHoleController(openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void): DrawHoleController<McDbDrainageBorehole[]>;
/**
 * 创建穿层孔面板控制器，钻场和巷道模式共享参数事件并调用各自的 Core 绘制 API。
 * @param mode 当前穿层孔模式，决定参数面板及 Core 绘制入口。
 * @param openPanel 挂载并激活面板，返回是否成功。
 * @param closePanel 移除参数面板并返回抽采菜单。
 * @returns 统一返回钻孔、钻场实体集合；巷道模式的 sites 为空数组，取消时返回 null。
 */
export declare function createThroughHoleController(mode: ThroughHoleMode, openPanel: (panel: NodeModuleDefine) => boolean, closePanel: () => void): DrawHoleController<ThroughHoleDrawResult>;
