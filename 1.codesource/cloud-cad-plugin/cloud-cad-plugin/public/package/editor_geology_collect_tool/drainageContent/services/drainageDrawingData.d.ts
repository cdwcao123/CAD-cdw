import type { DrainageBoreholeParameterRow, DrainageDrawingContext, DrainageReversePlan, DrainageReverseRow } from '../types/interface';
import type { DrainageDrillValueMode, DrainageReverseMode, DrainageSiteAnchor, DrainageStraightBoreholeCategory } from '../types/type';
/** 等待并固定当前图纸，插件构造器仅从该 Core 获取，避免插件相互打包。 */
export declare function resolveDrainageDrawing(drawingKey?: any): Promise<DrainageDrawingContext>;
/**
 * 从当前图纸读取钻孔参数，孔径从半径米转换成直径毫米。
 * @param context 已绑定图纸的真实钻孔上下文。
 * @returns 含图纸 key 和实体 objectId 的参数行，供行点击安全定位。
 */
export declare function collectDrainageParameters(context: DrainageDrawingContext): DrainageBoreholeParameterRow[];
/**
 * 按导入模式校验每行数据并创建未入库实体，钻孔实际参数模式按孔号执行反演规则。
 * @param context 当前图纸的实体快照及插件 API。
 * @param rows 待生成图形的 Excel 行，包含读取阶段的错误信息。
 * @param mode 导入钻场或钻孔。
 * @param valueMode 钻孔使用的参数类型；实际参数模式可附带生成设计孔。
 * @param siteAnchor 钻场沿巷道定位时以中心或起点作为距离基准。
 * @param category 钻孔菜单所属孔型；限定 Excel 类型及已有孔匹配范围，省略时保留通用导入。
 * @returns 当前菜单内每行一个计划，包含新建或更新数据及该行错误；其他孔型直接跳过，不修改正式图纸。
 */
export declare function prepareDrainageReverse(context: DrainageDrawingContext, rows: DrainageReverseRow[], mode: DrainageReverseMode, valueMode: DrainageDrillValueMode, siteAnchor: DrainageSiteAnchor, category?: DrainageStraightBoreholeCategory): DrainageReversePlan[];
/**
 * 整批新增或更新反演图形，失败时清理本批次新增实体并恢复本批次更新前的数据。
 * @param context 生成计划时绑定的图纸及 Core。
 * @param plans 已校验成功的表格行及其全部新实体。
 * @returns 全部目标写入完成，已有设计孔保持不变。
 * @throws 存在错误行、图纸切换、正在执行命令、入库或回滚失败时抛出错误。
 */
export declare function saveDrainageReverse(context: DrainageDrawingContext, plans: DrainageReversePlan[]): Promise<void>;
