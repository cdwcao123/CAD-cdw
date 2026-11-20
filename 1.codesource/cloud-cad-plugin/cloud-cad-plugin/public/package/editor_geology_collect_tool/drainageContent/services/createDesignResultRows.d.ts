import type { DrainageDesignResultRow } from '../types/interface';
import type { McDbDrainageBorehole, McDbDrillSite } from '@/core_geology_collect_tool/mcDrainageBorehole';
import type { McCore } from 'McCore';
/**
 * 将智能设计 API 返回的钻孔转换成公共结果表快照，仅访问实体公开读取方法。
 * @param core 设计结果所属图纸的 Core，用钻孔记录的巷道编码查询巷道实体名称。
 * @param drills 插件返回的完整钻孔列表；不扫描其他实体，不重复入库。
 * @param sites 钻场模式本次设计返回的钻场；省略时结果行不建立钻场删除关联。
 * @returns 与实体一一对应的结果行；未记录的见煤、止煤深度显示为空。
 */
export declare function createDesignResultRows(core: McCore, drills: McDbDrainageBorehole[], sites?: McDbDrillSite[]): DrainageDesignResultRow[];
