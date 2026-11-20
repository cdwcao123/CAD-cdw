import { McColor } from 'McCore';
import type { BoreholeDetailData, DrainageDetailView, DrillSiteDetailData, EvaluationUnitDetailData } from '../types/interface';
import type { McDbDrainageBorehole, McDbDrillSite, McDbGasArea } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 从钻场公开接口读取独立快照；复制坐标，避免表格和临时预览持有正式实体的数组。
 * @param entity 当前图纸的钻场实体。
 * @returns 独立的钻场详情快照；保留巷道关联标识，另行读取名称用于展示。
 */
export declare function readDrillSiteDetail(entity: McDbDrillSite): DrillSiteDetailData;
/**
 * 从钻孔公开接口读取详情快照；孔深在展示时累计轨迹段，避免依赖渲染缓存。
 * @param entity 当前图纸的钻孔实体。
 * @returns 独立的钻孔属性、坐标及主孔轨迹快照；定向钻同时包含全部分支起点和分段。
 */
export declare function readBoreholeDetail(entity: McDbDrainageBorehole): BoreholeDetailData;
/**
 * 从评价单元公开接口读取独立同步快照。
 * @param entity 当前图纸的评价单元实体。
 * @returns 名称、类型和边界坐标快照，不持有正式实体坐标。
 */
export declare function readEvaluationUnitDetail(entity: McDbGasArea): EvaluationUnitDetailData;
/**
 * 转换钻场详情视图；预览工厂只创建未入库实体，少于三个边界点时不绘制。
 * @param data 本地或服务器钻场详情快照。
 * @returns 属性、坐标表及创建临时预览实体的工厂。
 */
export declare function createDrillSiteDetailView(data: DrillSiteDetailData): DrainageDetailView;
/**
 * 转换钻孔详情视图；临时实体复用 Core 的轨迹和煤层渲染，不重写方位角、倾角计算。
 * @param data 本地或服务器钻孔详情快照。
 * @param previewColor 临时预览的整体颜色；缺省时沿用钻孔实体默认样式。
 * @returns 属性、轨迹表及创建临时预览实体的工厂。
 */
export declare function createBoreholeDetailView(data: BoreholeDetailData, previewColor?: McColor): DrainageDetailView;
/**
 * 转换评价单元详情视图；预览实体使用同步快照创建，不加入正式图纸。
 * @param data 本地或服务器评价单元详情。
 * @returns 属性、边界坐标和临时预览实体工厂。
 */
export declare function createEvaluationUnitDetailView(data: EvaluationUnitDetailData): DrainageDetailView;
