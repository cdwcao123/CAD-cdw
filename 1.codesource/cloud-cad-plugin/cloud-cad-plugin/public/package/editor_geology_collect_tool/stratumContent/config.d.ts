/**
 * 打开地层管理侧边面板并刷新当前矿井的地层列表。
 * 加载失败时 store 会清空旧数据，本函数负责向用户显示错误提示。
 *
 * @returns 面板打开且本次数据加载处理完成后解决的 Promise。
 */
export declare const openStratumPanel: () => Promise<void>;
/** 地层子模块 API，复用顶部菜单的面板入口。 */
export declare const editorStratumApi: {
    openStratumPanel: () => Promise<void>;
};
export type EditorStratumApi = typeof editorStratumApi;
/** 注册地层管理命令并返回子模块 API；同一插件生命周期内应只安装一次。 */
export declare const installStratumContent: () => EditorStratumApi;
