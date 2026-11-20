import { McPluginInfo, McCore } from 'McCore';
import * as types from './types';
export declare const info: McPluginInfo;
export declare const requires: string[];
declare const editorGeologyCollectToolApi: {
    /** 抽采设计作为采集工具子模块安装，共用插件生命周期。 */
    drainage: import("./drainageContent/types").EditorDrainageDesignApi;
    /** 地层和钻孔 API；命令仍在插件 install 阶段注册。 */
    stratum: {
        openStratumPanel: () => Promise<void>;
    };
    drillHole: {
        openDrillHoleDataManage: () => Promise<string | boolean | undefined>;
        openDrawDrillHole: () => Promise<unknown>;
        openBatchDrawDrillHole: () => Promise<unknown>;
        openColumnTemplateDataConfig: () => Promise<unknown>;
        openDrillHoleFileFormatManager: () => Promise<string | boolean | undefined>;
        openDrillHoleTemplateManager: () => Promise<string | false | undefined>;
        openDrillHoleDataSync: typeof import("./drillHoleContent/dataSync/config").openDrillHoleDataSync;
    };
    StratumVertexSourceType: typeof types.StratumVertexSourceType;
    StratumDataSourceFilter: typeof types.StratumDataSourceFilter;
    StratumVertexSessionState: typeof types.StratumVertexSessionState;
};
export type EditorGeologyCollectToolApi = typeof editorGeologyCollectToolApi;
/**
 * 安装编辑器地质采集插件。
 * @param core 当前编辑器内核实例，当前安装过程无需访问图纸。
 * @returns 采集工具及抽采设计、地层、钻孔子模块 API。
 */
export declare function install(core: McCore): EditorGeologyCollectToolApi;

import type { EditorGeologyCollectTool } from './index';

declare module 'McCore' {
  interface McPluginApiMap {
    editorGeologyCollectTool: EditorGeologyCollectTool;
  }
}

export {};
