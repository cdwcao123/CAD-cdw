import type { DrainageStraightBoreholeCategory } from '../types/type';
/** 打开钻场反演面板。 @returns 面板打开后结束。 */
export declare const openDrillSiteReverseDialog: () => void;
/**
 * 打开普通钻孔反演面板。
 * @param category 所属孔型，省略时使用通用反演面板。
 * @returns 面板打开后结束。
 */
export declare const openDrillReverseDialog: (category?: DrainageStraightBoreholeCategory) => void;
