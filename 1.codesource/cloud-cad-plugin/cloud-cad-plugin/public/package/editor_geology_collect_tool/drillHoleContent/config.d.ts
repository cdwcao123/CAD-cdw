import { openDrillHoleDataSync } from './dataSync/config';
/** 钻孔子模块 API，复用顶部菜单的业务入口。 */
export declare const editorDrillHoleApi: {
    openDrillHoleDataManage: () => Promise<string | boolean | undefined>;
    openDrawDrillHole: () => Promise<unknown>;
    openBatchDrawDrillHole: () => Promise<unknown>;
    openColumnTemplateDataConfig: () => Promise<unknown>;
    openDrillHoleFileFormatManager: () => Promise<string | boolean | undefined>;
    openDrillHoleTemplateManager: () => Promise<string | false | undefined>;
    openDrillHoleDataSync: typeof openDrillHoleDataSync;
};
export type EditorDrillHoleApi = typeof editorDrillHoleApi;
export declare const registerPropertyScripts: () => void;
/** 安装钻孔业务命令并返回子模块 API。 */
export declare function installDrillHoleContent(): EditorDrillHoleApi;
