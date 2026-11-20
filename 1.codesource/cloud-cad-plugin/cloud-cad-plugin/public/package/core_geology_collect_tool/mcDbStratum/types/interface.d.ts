import { McDbIsoGenerateType, McDbIsoLineType, McDbStratumVertexType } from './enum';
/**
 * 地层信息接口
 */
export interface IMcDbStratum {
    /** 唯一标识(ID) */
    id: string;
    /** 地层名称 */
    name: string;
    /** 地层编码 */
    stratumCode: string;
    /** 地层类型 */
    stratumType: string;
    /** 是否标志层(0:否, 1:是) */
    isMarkLayer: number;
    /** 是否含水层(0:否, 1:是) */
    isAquifer: number;
    /** 是否隔水层(0:否, 1:是) */
    isAquiclude: number;
    /** 父级地层 */
    stratumParentCode: string;
    /** 地层顺序 */
    stratumSort: number;
    /** 地层厚度最小值 */
    stratumThicknessMin: number;
    /** 地层厚度最大值 */
    stratumThicknessMax: number;
    /** 地层厚度平均值 */
    stratumThicknessAve: number;
    /** 地层颜色 */
    stratumColor: string;
    /** 地层岩性特征 */
    formationLithology: string;
    /** 物性特征 */
    physicalCharacteristics: string;
    /** 水文地质特征 */
    hydrogeologicalCharacteristics: string;
    /** 工程地质特征 */
    engineeringGeologicalCharacteristics: string;
    /** 岩性组合 */
    lithology: string;
    /** 备注 */
    remark: string;
}
/**
 * 地层顶点接口
 */
export interface IMcDbStratumVertex {
    /** 数据源类型 */
    strType: McDbStratumVertexType;
    /** 数据源标识 */
    strSource: string;
    /** x坐标 */
    x: number;
    /** y坐标 */
    y: number;
    /** 顶板标高 */
    zTop: number;
    /** 底板标高 */
    zBottom: number;
    /** 厚度 */
    thickness: number;
}
/**
 * 等值线参数接口
 */
export interface IIsoParam {
    /** 等值线类型 */
    isoLineType: McDbIsoLineType;
    /** 等值线生成方式 */
    isoGenerateType: McDbIsoGenerateType;
    /** 等值线间距值,isoGenerateType为Interval时有效 */
    isoInterval?: number;
    /** 固定值,isoGenerateType为FixedValue时有效 */
    fixedValues?: number[];
    /** 最小值,isoGenerateType为FixedValue时有效 */
    min?: number;
    /** 最大值,isoGenerateType为FixedValue时有效 */
    max?: number;
}
