import type { EditorDrainageDesignApi } from './types';
/**
 * 安装抽采设计模块，统一登记全局系统变量、特性脚本和业务命令。
 * @returns 抽采模块 API，供采集工具统一对外暴露。
 */
export declare function installDrainageContent(): EditorDrainageDesignApi;
