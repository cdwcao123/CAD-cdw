import type { DrainageDesignResultRow, DrainageDrawingContext } from '../types/interface';
import type { McDbDrainageBorehole } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 使用当前实体参数及保留的施工记录组织钻孔反演模板字段。
 * @param context 当前图纸的关联实体，用于调用钻场、巷道公开 API。
 * @param drill 当前图纸的钻孔实体。
 * @param row 通过 Core 实体 API 采集的参数行，孔径为直径米值。
 * @returns 模板导出字段，角度单位为度、长度单位为米，未记录的信息保持空白。
 */
export declare function createBoreholeExportValues(context: DrainageDrawingContext, drill: McDbDrainageBorehole, row: DrainageDesignResultRow): Record<string, string | number>;
