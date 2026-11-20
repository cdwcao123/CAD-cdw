/**
 * 打开钻孔数据管理器；已有窗口恢复可见，列表可通过刷新按钮重新请求。
 * @returns 公共弹框创建结果，无 Editor 时返回 false
 */
export declare const openDrillHoleDataManage: () => Promise<string | boolean | undefined>;
/**
 * 注册钻孔数据管理器命令。
 * @returns 无返回值
 */
export declare function installDrillHoleDataManage(): void;
