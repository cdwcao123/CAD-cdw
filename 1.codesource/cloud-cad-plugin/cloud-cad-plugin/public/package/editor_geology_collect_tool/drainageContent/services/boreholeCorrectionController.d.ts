import type { BoreholeCorrectionController } from '../types/interface';
/**
 * 管理参数分组弹框、Core 修正计算及设计平面图与修正平面图预览；重复打开、关闭及换图均使旧异步请求失效。
 * @returns 打开和关闭两步修正会话的控制器，不再安装临时 Ribbon 参数模块。
 */
export declare function createBoreholeCorrectionController(): BoreholeCorrectionController;
