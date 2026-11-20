import type { DrainageReverseMode } from '../types/type';
/**
 * 打开画布内部底部的参数弹框；钻场与钻孔分别复用自己的实例。
 * @param mode 参数对象类型；省略时保持原钻孔参数入口行为。
 * @returns 发起打开弹框或恢复已有弹框的显示状态。
 */
export declare function openDrillParameterDialog(mode?: DrainageReverseMode): void;
/**
 * 由钻场参数菜单打开相同布局的只读参数表及反演模板导出入口。
 * @returns 发起打开或恢复已有钻场参数弹框后结束。
 */
export declare function openDrillSiteParameterDialog(): void;
