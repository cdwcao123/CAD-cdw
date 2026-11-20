import { McCore } from 'McCore';
/**
 * 打断管线
 * @param core 内核实例
 * @returns
 */
export declare function breakPipeline(core: McCore): Promise<null | undefined>;
/**
 * 添加元件
 * @param core 内核实例
 * @returns
 */
export declare function addCompnent(core: McCore): Promise<null | undefined>;
/**
 * 连接管线
 * @param core 内核实例
 * @returns
 */
export declare function connectPipeline(core: McCore): Promise<null | undefined>;
/**
 * 合并管线
 * @param core 内核实例
 * @returns
 */
export declare function mergePipeline(core: McCore): Promise<null | undefined>;
