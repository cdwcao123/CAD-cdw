import type { DirectionalDesignExportOptions, DirectionalDesignResultSheet } from '../types/interface';
/**
 * 将全部定向钻设计结果创建为一个 Office Kit 工作簿。
 * @param sheets 当前编辑会话的完整 Sheet 列表；单元格及附图读取同一份已联动计算的快照，不回读实体。
 * @param options 附图选项；参数导出和反演模板设置 includeTrajectory 为 false。
 * @returns 可直接下载的 XLSX 字节；D～J 使用参考公式并缓存当前值，孔口 E～J 保留初值；启用附图时末尾添加静态轨迹图。
 * @throws 启用附图且图表所需孔深或相对 Z 未填写完整时抛错；工作簿写入异常继续抛出。
 */
export declare function createDirectionalDesignWorkbook(sheets: DirectionalDesignResultSheet[], options?: DirectionalDesignExportOptions): Promise<Uint8Array>;
/**
 * 整体导出并下载定向钻设计结果。
 * @param sheets 当前结果面板的完整 Sheet 列表。
 * @param options 附图和下载文件名前缀，省略时导出含轨迹图的设计结果。
 * @returns 下载触发后完成；生成失败时将 Office Kit 异常继续抛给调用组件。
 */
export declare function downloadDirectionalDesignWorkbook(sheets: DirectionalDesignResultSheet[], options?: DirectionalDesignExportOptions): Promise<void>;
