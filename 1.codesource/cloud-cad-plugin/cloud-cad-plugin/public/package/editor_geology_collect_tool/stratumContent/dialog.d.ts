import type { OpenStratumEditorOptions, StratumModel } from '../types';
/**
 * 打开地层新增或修改弹框，并把内容组件的异步确认结果交给宿主管理器。
 * 返回 false 的确认结果会保留弹框，供用户修正校验或保存错误。
 *
 * @param options 编辑模式、初始模型、父级选项及保存回调。
 */
export declare const openStratumEditor: (options: OpenStratumEditorOptions) => void;
/**
 * 打开或刷新画布底部的数据源弹框，并异步加载选中地层的关联顶点。
 * 同一个固定弹框实例会被复用；加载失败时保留空表格，不关闭操作界面。
 *
 * @param model 当前选中的地层模型。
 */
export declare const openStratumDataSourceDialog: (model: StratumModel) => void;
