import type { DirectionalDesignResultSheet } from '../types/interface';
import type { McDbDrainageBorehole } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 将 Core 返回的钻孔转换为结果工作表，主支与分支按 Core 轨迹段逐点展示。
 * @param boreholes Core 返回或已保存的真实钻孔实体。
 * @param designDate 智能设计日期，格式 YYYY-MM-DD；查看既有钻孔时省略。
 * @returns 每孔一个原始 Sheet；另存分支实际起点用于导出还原，D～J 仍由结果面板初始化。
 */
export declare function createDirectionalDesignResultSheets(boreholes: McDbDrainageBorehole[], designDate?: string): DirectionalDesignResultSheet[];
