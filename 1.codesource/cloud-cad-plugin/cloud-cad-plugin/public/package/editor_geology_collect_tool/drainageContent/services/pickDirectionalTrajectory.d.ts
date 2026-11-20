/**
 * 从顶部菜单选取单孔，并复用定向钻设计结果的二维剖面、三维轨迹图。
 * @returns 拾取结束后打开只读轨迹快照；取消、换图或失败时不打开图表，不修改正式钻孔。
 */
export declare function pickDirectionalTrajectory(): Promise<void>;
