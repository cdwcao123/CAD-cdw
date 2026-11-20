import { type McCore, type McPluginInfo } from 'McCore';
export declare const info: McPluginInfo;
export declare const requires: string[];
declare const cadSymbolDb: {};
export type CadSymbolDb = typeof cadSymbolDb;
/**
 * 安装符号库插件。
 * @param core 当前 core 实例
 */
export declare function install(core: McCore): CadSymbolDb;

import type { CadSymbolDb } from './index';

declare module 'McCore' {
  interface McPluginApiMap {
    cadSymbolDb: CadSymbolDb;
  }
}

export {};
