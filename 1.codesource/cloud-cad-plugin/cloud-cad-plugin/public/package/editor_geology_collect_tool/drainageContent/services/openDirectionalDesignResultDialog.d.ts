import type { DirectionalDesignResultSession, DirectionalDesignResultSheet } from '../types/interface';
export { createDirectionalDesignResultSheets } from './createDirectionalDesignResultSheets';
/**
 * 打开定向钻结果内弹框，切换 Sheet 时高亮对应钻孔；重复打开时恢复底部默认尺寸。
 * @param sheets 来自设计结果或既有钻孔的工作表；为空时仅提示未生成钻孔。
 * @param session 智能设计生成的临时实体会话；查看既有钻孔详情时不传。
 * @returns 无返回值，弹框在当前画布作用域内展示；编辑用于当前快照、轨迹图及导出，不回写实体。
 * @throws 已有未结束的临时设计会话时再次传入设计会话，抛错要求先保存或取消。
 */
export declare function openDirectionalDesignResultDialog(sheets: DirectionalDesignResultSheet[], session?: DirectionalDesignResultSession): void;
