import { McGeMatrix4, McGePoint, McGeVector3 } from 'McCore';
import { McDbDrillSite } from '../entity/mcDbDrillSite';
import { McAlongLayoutType, McBoreholePurpose, McBoreholeType, McCoalType, McGasSource, McWorkFaceType } from './enum';
/**
 * 钻孔的轨迹数据
 */
interface McBoreholePath {
    /**深度，单位米*/
    depth: number;
    /** 方位角，单位度*/
    heading: number;
    /** 倾角，单位度*/
    tilt: number;
}
/**
 * 钻孔的渲染几何数据
 */
interface McBoreholeGeometry {
    /**坐标*/
    coord: McGePoint;
    /** 是否为煤层*/
    isCoal: boolean;
    /** 是否为原始轨迹点*/
    isKey: boolean;
}
/**
 * 钻孔的分支轨迹数据
 */
interface McBoreholeBranch {
    /**轨迹数据*/
    paths: McBoreholePath[];
    /**分支起点坐标*/
    position: McGeVector3;
}
/**
 * 钻孔的穿透煤层数据
 */
interface McDrillCoalData {
    /**煤层名称*/
    name: string;
    /**煤层编码*/
    code: string;
    /**煤层厚度，单位米*/
    thickness: number;
    /**见煤深度，单位米*/
    inCoalLength: number;
}
/**
 * 顺层孔设计参数
 */
interface McAlongParameter {
    /**孔径，单位米*/
    radius: number;
    /**抽采半径，单位米*/
    range: number;
    /**孔深，单位米*/
    length: number;
    /**离地高度，单位米*/
    heightToGround: number;
    /**水平间距，单位米*/
    hSpace: number;
    /**垂直间距，单位米*/
    vSpace: number;
    /**布孔方式*/
    type: McAlongLayoutType;
    /**起始组号*/
    maxGroup: number;
    /**组内孔数*/
    groupNumber: number;
    /**加密范围，单位米*/
    faultRange: number;
    /**加密系数*/
    patching: number;
    /**是否压茬设计*/
    crossDesign: boolean;
    /**压茬长度*/
    crossRange: number;
}
/**
 * 穿层孔设计参数
 */
interface McThroughParameter {
    /**孔径，单位米*/
    radius: number;
    /**抽采半径，单位米*/
    range: number;
    /**巷道两侧预抽采范围，总体范围应该是area*2 + 巷道宽度，单位米*/
    area: number;
    /**工作面走向方向上的终孔间距，单位米*/
    hSpace: number;
    /**工作面倾向方向上的终孔间距，单位米*/
    vSpace: number;
    /**走向方向上的开孔间距，单位米*/
    hOpenSpace: number;
    /**倾向方向上的开孔间距，单位米*/
    vOpenSpace: number;
    /**从巷道往钻场内部延伸多远开始打孔（往钻场内方向的第一排钻孔距离巷道侧帮的距离），单位米*/
    openDeepSpace: number;
    /**第一排孔是否在侧帮墙上*/
    firstOnWall: boolean;
    /**钻孔分组的起始组号*/
    maxGroup: number;
    /**起始钻场号*/
    siteStartNumber: number;
    /**遇到断层时的加密系数，默认1不加密*/
    patching: number;
    /**识别到范围内有断层时进行加密处理*/
    faultRange: number;
    /**钻孔出煤长度*/
    coalPassLength: number;
    /**煤层底板位置*/
    coalBotHeight: number;
    /**倾向角度，单位度*/
    coalTilt: number;
    /**煤厚*/
    coalThickness: number;
}
/**
 * 单个抽采钻孔设计参数
 */
interface McSingleParameter {
    /**孔径，单位米*/
    radius: number;
    /**抽采半径，单位米*/
    range: number;
    /**孔号*/
    id: string;
    /**用途；空字符串表示面板初始状态尚未选择用途。*/
    purpose: McBoreholePurpose | '';
    /**是否为设计孔*/
    isDesign: boolean;
    /**类型*/
    type: McBoreholeType;
    /**开孔位置离地高度，单位米*/
    heightToGround: number;
}
/**
 * 单个抽采定向钻孔设计参数
 */
interface McSingleDirectionalParameter {
    /**孔径，单位米*/
    radius: number;
    /**抽采半径，单位米*/
    range: number;
    /**孔号*/
    id: string;
    /**用途；空字符串表示面板初始状态尚未选择用途。*/
    purpose: McBoreholePurpose | '';
    /**是否为设计孔*/
    isDesign: boolean;
    /**开孔位置离地高度，单位米*/
    heightToGround: number;
    /**单段长度，单位米*/
    segmentLength: number;
}
/**
 * 抽采钻孔设计中的记录钻场排序的数据
 */
interface McSiteDistanceData {
    /**距离*/
    distance: number;
    /**钻场*/
    site: McDbDrillSite;
}
/**
 * 抽采钻孔设计中的记录钻场排序的数据
 */
interface McSiteSpaceData {
    /**距离*/
    distance: number;
    /**间距*/
    space: number;
    /**是否需要加密*/
    isPatching: boolean;
    /**钻场*/
    site: McDbDrillSite | undefined;
}
/**
 * 抽采钻孔设计中的记录钻场检索信息的数据
 */
interface McSiteInfoData {
    /**索引*/
    index: number;
    /**钻场信息*/
    drills: McSiteSpaceData[];
    length: number;
    /**中心距离*/
    centerDistance: number;
    /**钻场*/
    site: McDbDrillSite | undefined;
    /**排数*/
    rows: number;
}
/**
 * 抽采评价单元参数
 */
interface McGasAreaParameter {
    /**评价单元名称 */
    name: string;
    /**所属工作面类型 */
    workFaceType: McWorkFaceType;
    /**瓦斯涌出来源 */
    gasType: McGasSource;
    /**工作面日产量 */
    workFaceDayOutput: string;
    /**达标瓦斯压力 */
    gasPressure: number;
    /**达标瓦斯含量 */
    gasContentRate: number;
    /**抽采半径 */
    range: number;
    /**计量因子 */
    measureFactor: number;
    /**煤炭储量 */
    coalReserve: number;
    /**瓦斯储量 */
    gasReserve: number;
    /**初始抽采量 */
    startReserve: number;
    /**抽采开始时间 */
    startTime: string;
    /**煤种类 */
    coalType: McCoalType;
    /**走向方向h1 */
    headH1: number;
    /**走向方向h2 */
    headH2: number;
    /**倾向方向h1 */
    tiltH1: number;
    /**倾向方向h2 */
    tiltH2: number;
    /**走向方向h1等值宽度 */
    headH1Width: number;
    /**走向方向h2等值宽度 */
    headH2Width: number;
    /**倾向方向h1等值宽度 */
    tiltH1Width: number;
    /**倾向方向h2等值宽度 */
    tiltH2Width: number;
    /**评价单元高度 */
    height: number;
    /**评价单元的底板标高，工作面回采绘制模式使用 */
    altitude: number;
    /**评价单元的宽度,巷道条带区域绘制模式使用 */
    width: number;
}
/**
 * 钻孔的渲染断面图数据
 */
interface McBoreholeSectionData {
    /**矩阵，用于转换为断面图坐标*/
    matrix: McGeMatrix4;
    min: McGeVector3;
    max: McGeVector3;
    tunnels: number[][][];
    drills: number[][][];
    designDrills: number[][][];
    workFaces: number[][][];
    axis: number[][][];
    texts: {
        position: number[];
        text: string;
        height: number;
        rotation: number;
    }[];
    drillCoals: number[][][];
    emptyDrills: number[][][];
    faults: number[][][];
    solids: number[][][];
    areas: number[][][];
    blueTexts: {
        position: number[];
        text: string;
        height: number;
        rotation: number;
    }[];
    greenTexts: {
        position: number[];
        text: string;
        height: number;
        rotation: number;
    }[];
}
/**
 * 抽采定向钻孔设计参数
 */
interface McDirectionalDesignParameter {
    /** 抽采边界，闭合多段线ID */
    drainageBoundaryId: string;
    /** 钻场实体ID */
    drillSiteId: string;
    /** 钻孔组ID，默认0 */
    drillGroup: number;
    /** 开孔间距，默认1 */
    drillStartSpace: number;
    /** 终孔间距，默认7 */
    drillEndSpace: number;
    /** 钻杆长度，默认6 */
    drillPipeLength: number;
    /** 钻孔半径，默认0.1 */
    drillRadius: number;
    /** 抽采半径，默认5 */
    range: number;
    /** 分支数量，默认4 */
    branchCount: number;
    /** 煤底标高，默认0.0 */
    coalBottomElevation: number;
    /** 煤层厚度，默认1 */
    coalThickness: number;
    /** 煤层倾角，默认0.0 */
    coalTiltAngle: number;
}
/**
 * 抽采定向钻孔设计中的钻孔终孔位置
 */
interface McDirectionalEndPosition {
    point: McGeVector3;
    tangentPoint: McGeVector3 | undefined;
}
export { McBoreholePath, McBoreholeGeometry, McAlongParameter, McSingleParameter, McThroughParameter, McSiteDistanceData, McSiteSpaceData, McSiteInfoData, McGasAreaParameter, McSingleDirectionalParameter, McBoreholeSectionData, McDrillCoalData, McBoreholeBranch, McDirectionalDesignParameter, McDirectionalEndPosition, };
