import type { DrillHoleFeatureClass, VirtualDrillHolePoint } from '../types';
/**
 * 按现有“校正岩层坐标”规则更新地层底板点，不修改层厚或累计厚度。
 * @param featureClass 钻探、综合或测井地层要素类，本方法直接更新其草稿几何。
 * @param point 当前钻孔孔口坐标。
 * @returns 无返回值；底板高程优先采用非零累计真厚，否则采用累计层厚或测井底板深度。
 * @throws 孔口坐标不是有限数值时抛出错误。
 */
export declare function correctDrillHoleRockCoordinates(featureClass: DrillHoleFeatureClass, point: VirtualDrillHolePoint): void;
/**
 * 为新孔口生成虚拟钻孔地层及辅助要素草稿，全程不请求服务器。
 * @param featureClasses 复制出的全部要素类；调用方传入普通对象，不传 Vue 响应式代理。
 * @param point 新钻孔的孔口坐标。
 * @param drillCode 当前新增草稿的钻孔代码，用于重绑已有的钻孔关联字段。
 * @returns 独立要素草稿；保留复制的全部厚度字段，按既有累计值校正岩层坐标，并同步孔口和地层连线。
 * @throws 校正岩层时孔口坐标无效会抛出错误，输入草稿保持不变。
 */
export declare function prepareVirtualDrillHoleFeatures(featureClasses: DrillHoleFeatureClass[], point: VirtualDrillHolePoint, drillCode: string): DrillHoleFeatureClass[];
