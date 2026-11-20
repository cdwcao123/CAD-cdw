import type { BoreholeDetailData, DirectionalSyncTrajectory } from '../types/interface';
/**
 * 序列化定向钻主孔和分支，扩展 JSON 保持 Core CAD 坐标，不套用服务器 Coord 的历史轴序。
 * @param data 已从实体公开接口复制的设计或实际钻孔快照。
 * @returns 写入 Field4（设计）或 Field3（实际）的轨迹 JSON。
 */
export declare function serializeDirectionalSyncTrajectory(data: BoreholeDetailData): string;
/**
 * 解析新的定向钻轨迹字段；只有空字段才允许调用方读取旧记录。
 * @param value Field3 或 Field4 的 JSON；null、undefined、空字符串表示尚未保存新格式。
 * @param field 用于错误定位的服务器字段名。
 * @returns 完整主孔及分支轨迹；空字段返回 undefined。
 * @throws 非空字段不是约定 JSON，或包含无效轨迹、分支起点时抛出含字段名的错误。
 */
export declare function parseDirectionalSyncTrajectory(value: string | null | undefined, field: 'Field3' | 'Field4'): DirectionalSyncTrajectory | undefined;
