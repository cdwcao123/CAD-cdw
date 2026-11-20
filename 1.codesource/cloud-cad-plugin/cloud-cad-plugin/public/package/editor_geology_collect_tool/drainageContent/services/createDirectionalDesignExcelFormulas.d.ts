import type { DirectionalDesignResultRow } from '../types/interface';
import type { DirectionalDesignExcelFormulas } from '../types/type';
/**
 * 按参考工作簿原式生成 D～J 公式，分支起点使用直接引用，不添加查找、插值或空值判断公式。
 * @param displayRows 已插入分支分隔空行的完整结果，第一条轨迹为主支，明细从第三行开始。
 * @returns Excel 一基行号到字段公式的映射；孔口坐标保留初值，目标方位引用适配为当前布局的 I1。
 */
export declare function createDirectionalDesignExcelFormulas(displayRows: (DirectionalDesignResultRow | undefined)[]): Map<number, DirectionalDesignExcelFormulas>;
