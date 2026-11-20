import { McCore, McGeVector3 } from 'McCore';
import { IMcDbChamberData, McDbChamber } from '../mcDbChamber/entity/mcDbChamber';
import type { McGeoModelData } from '../mcGeoModel/types/interface';
/**
 * 硐室构造数据
 * @description 在 IMcDbChamberData 基础上补充内核轨迹，轨迹对应接口字段 chamber_remark
 */
export interface McChamberData extends IMcDbChamberData {
    /** 硐室轨迹 */
    path: McGeVector3[];
    /** 实体主键，取自接口 chamber_code，绘制时写入实体 objectId 以保证本地与服务器同一主键 */
    objectId: string;
}
/**
 * 硐室实体转换为地质模型数据
 * @param chamber 硐室实体 McDbChamber 实例
 * @returns 标准化的地质模型数据
 */
export declare function chamberToModel(chamber: McDbChamber): McGeoModelData;
/**
 * 地质模型数据转换为硐室构造数据
 * @param modelData 地质模型数据
 * @returns 可直接构造 McDbChamber 的数据
 */
export declare function modelToChamber(modelData: McGeoModelData): McChamberData;
/**
 * 依据接口数据在图纸中绘制硐室
 * @param core 内核实例
 * @param chamberData 硐室构造数据
 * @returns 绘制完成的硐室实体
 */
export declare function drawChamberByData(core: McCore, chamberData: McChamberData): McDbChamber | null;
