import { type NodeModuleDefine } from 'McEditor';
import type { DirectionalDesignPanelActions, DirectionalDesignPanelParameters } from '../types/interface';
import '../styles/directionalDesignPanel.css';
/**
 * 创建截图对应的定向钻智能设计 Ribbon 参数面板。
 * 控件维护参数快照，边界、钻场和设计操作交给调用方调用 Core 公开接口。
 * @param parameters 面板初始参数。
 * @param onChange 任一可编辑参数确认后的完整参数回调。
 * @param actions 绘制边界、绘制钻场、开始设计和关闭面板的操作集合。
 * @returns 可由顶部菜单管理器直接挂载的参数模块定义。
 */
export declare function createDirectionalDesignParameterModule(parameters: DirectionalDesignPanelParameters, onChange: (parameters: DirectionalDesignPanelParameters) => void, actions: DirectionalDesignPanelActions): NodeModuleDefine;
