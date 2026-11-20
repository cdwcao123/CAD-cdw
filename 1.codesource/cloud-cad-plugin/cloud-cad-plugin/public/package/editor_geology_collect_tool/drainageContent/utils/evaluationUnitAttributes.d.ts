import type { DrainageServerEvaluationUnit, EvaluationUnitDetailData } from '../types/interface';
import type { EvaluationUnitCoreApi } from '../types/type';
/**
 * 将线上评价单元的煤种、瓦斯来源字典转换为实体参数及详情文本。
 * @param record 线上原始记录，煤种采用 1～3 字典键，瓦斯来源采用 1～5 字典键。
 * @param api 已就绪的 Core 插件公开枚举，不通过运行时源码导入获取。
 * @returns 已映射的实体参数及服务器展示文本；接口未提供的工作面类型不以实体默认值代替显示。
 */
export declare function readEvaluationUnitAttributes(record: DrainageServerEvaluationUnit, api: EvaluationUnitCoreApi): Pick<EvaluationUnitDetailData, 'workFaceType' | 'gasType' | 'coalType' | 'serverAttributes'>;
