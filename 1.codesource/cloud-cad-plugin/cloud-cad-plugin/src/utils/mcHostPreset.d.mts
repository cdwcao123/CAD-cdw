import type { UserConfig } from 'vite';

/** standardCAD 宿主预设的项目路径、资源位置与生产模块映射选项。 */
export interface McHostPresetOptions {
  /** 项目根目录的绝对路径。 */
  appRoot: string;
  /** 当前是否执行生产构建。 */
  isBuild: boolean;
  /** SDK 资源目录相对项目根目录的位置。 */
  distRootRelative?: string;
  /** 未指定输出目录时使用的应用目录名。 */
  outputDirName?: string;
  /** 构建输出目录相对项目根目录的位置。 */
  outDirRelative?: string;
  /** 是否在生产 HTML 中注入 import map。 */
  injectImportMap?: boolean;
  /** 自定义生产模块路径映射，路径相对发布入口。 */
  importMap?: {
    /** npm 模块名或 SDK 名称到静态资源入口的映射。 */
    imports: Record<string, string>;
  };
}

/**
 * 创建标准 SDK 宿主配置。
 * @param options 项目路径、SDK 资源目录及构建模式。
 * @returns 可与页面配置合并的 Vite 配置。
 * @throws npm 框架入口缺失时抛出文件读取错误。
 */
export declare const createMcHostPreset: (options: McHostPresetOptions) => UserConfig;
