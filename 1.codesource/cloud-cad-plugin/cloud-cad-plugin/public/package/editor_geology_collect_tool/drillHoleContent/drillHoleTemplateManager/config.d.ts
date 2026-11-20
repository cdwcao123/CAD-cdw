/**
 * 打开钻孔模板管理器，列表直接同步当前图纸的 Core 样式表。
 * @returns 公共弹框标识；没有 Editor 时返回 false
 */
export declare const openDrillHoleTemplateManager: () => Promise<string | false | undefined>;
/**
 * 注册模板管理命令，并接入当前图纸的样式表列表同步。
 * @returns 无返回值
 */
export declare function installDrillHoleTemplateManager(): void;
