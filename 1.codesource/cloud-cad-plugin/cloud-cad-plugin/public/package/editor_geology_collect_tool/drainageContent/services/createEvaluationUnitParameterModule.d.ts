import { type NodeModuleDefine } from 'McEditor';
import '../styles/evaluationUnitPanel.css';
import type { EvaluationUnitPanelParameters } from '../types/interface';
import type { EvaluationUnitCoreApi, EvaluationUnitMode } from '../types/type';
export declare const evaluationUnitModuleKey = "drainageEvaluationUnitPanel";
/**
 * 创建回采区域或巷道条带区域的面板初值。
 * @param mode 绘制模式，决定使用回采区域或巷道条带区域的默认参数。
 * @param api 当前图纸已加载的评价单元 Core 插件公开 API。
 * @returns 独立的面板参数；巷道两侧宽度默认 15 米，暴露时间转换为面板字典键。
 */
export declare const createEvaluationUnitParameters: (mode: EvaluationUnitMode, api: EvaluationUnitCoreApi) => EvaluationUnitPanelParameters;
/** 更新暴露时间对应的等值宽度，保留手动输入的储量。 */
export declare function recalculateEvaluationUnitParameters(parameters: EvaluationUnitPanelParameters, api: EvaluationUnitCoreApi): EvaluationUnitPanelParameters;
/**
 * 创建评价单元 Ribbon 参数配置。
 * 回采区域与巷道条带区域都支持规则与不规则布局切换。
 * @param parameters 当前评价单元参数；回采模式的 altitude 为底板标高，单位米，允许负值。
 * @param onClose 关闭当前参数面板并结束绘制的回调。
 * @param onChange 字段更新后提交完整参数快照的回调。
 * @param onRegularChange 规则图形开关变化后重建布局的回调。
 * @param api 当前图纸已加载的评价单元 Core 插件公开 API。
 * @returns 绑定参数更新回调的顶部 Ribbon 模块配置。
 */
export declare const createEvaluationUnitParameterModule: (parameters: EvaluationUnitPanelParameters, onClose: () => void, onChange: (parameters: EvaluationUnitPanelParameters) => void, onRegularChange: (regular: boolean) => void, api: EvaluationUnitCoreApi) => NodeModuleDefine;
