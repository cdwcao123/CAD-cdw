import type { StratumDataSourceRow } from '../types';
/**
 * 打开顶点新增或修改弹框。
 *
 * @param row 待修改的数据源行；为空时按新增模式初始化。
 * @param onSubmit 弹框确认后接收完整数据源行的回调。
 */
export declare const openStratumVertexConfigDialog: (row: StratumDataSourceRow | undefined, onSubmit?: (row: StratumDataSourceRow) => void) => void;
/** 打开“巷道生成等值线”配置弹框。 */
export declare const openStratumTunnelContourDialog: () => void;
/** 打开“采集等值线”配置弹框，并注入当前默认采集条件。 */
export declare const openStratumCollectContourDialog: () => void;
/**
 * 打开实体类型多选弹框。
 *
 * @param modelValue 当前选中的实体类型名称集合。
 * @param onSubmit 确认后接收新集合的回调。
 */
export declare const openStratumEntityTypeDialog: (modelValue: string[], onSubmit?: (values: string[]) => void) => void;
/**
 * 打开图层选择弹框。
 *
 * @param modelValue 当前图层名称。
 * @param onSubmit 确认后接收所选图层名称的回调。
 */
export declare const openStratumLayerSelectDialog: (modelValue: string, onSubmit?: (layerName: string) => void) => void;
