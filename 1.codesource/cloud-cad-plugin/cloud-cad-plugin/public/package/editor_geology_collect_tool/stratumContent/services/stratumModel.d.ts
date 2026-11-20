import type { StratumModel } from '../../types';
/**
 * 生成新增地层使用的 8 位本地随机编码。
 * 首位仅使用大小写字母，其余 7 位允许大小写字母和数字，示例：fXxaWRnb。
 *
 * @returns 符合 `/^[A-Za-z][A-Za-z0-9]{7}$/` 的地层编码。
 */
export declare const createStratumCode: () => string;
/**
 * 创建字段完整的新增地层模型，确保全量保存时不遗漏非表单契约字段。
 *
 * @param sort 新地层的初始显示顺序。
 * @param mineCode 新地层所属矿井编码。
 * @returns 带客户端 Id、随机地层编码、默认类型和审计时间的完整模型。
 */
export declare const createEmptyStratumModel: (sort: number, mineCode?: string) => StratumModel;
