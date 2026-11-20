import { McCore, McGeVector2 } from 'McCore';
/**
 * 选线绘制管线
 * @param core 核心对象
 * @returns Promise<void>
 * @author yangwl
 */
export declare function drawPipe(core: McCore): Promise<null | undefined>;
/**
 * 计算点到直线的最小距离（无限长直线）
 * @param p 目标点
 * @param a 直线上一点
 * @param b 直线上另一点（用于确定方向）
 * @returns 点到直线的垂直距离
 */
export declare function distancePointToLine(p: McGeVector2, a: McGeVector2, b: McGeVector2): number;
