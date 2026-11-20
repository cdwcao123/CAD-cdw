/**
 * 将管线实体转换为服务器可接收的数据对象
 * @param pipeline 管线实体 McDbPipeline 实例
 * @returns 标准化的管线数据对象
 */
export declare const convertPipelineToData: (pipeline: any) => any;
/**
 * 将服务器返回的管线数据转换为可用于构造 McDbPipeline 的数据结构
 * @param data 服务器管线数据
 * @returns McPipelineData 结构，可直接传给 new McDbPipeline()
 */
export declare const convertPipelineData: (data: any) => any;
/**
 *  获取图纸中所有的管线数据
 * @returns 所有的管线数据数组
 */
export declare const getAllPipelines: () => Promise<any[]>;
/**
 * 加载服务器管线数据
 * @returns 服务器管线数据
 * */
export declare const loadServerPipelines: () => Promise<{
    rows: any[];
    notice: string;
    modelId: string;
}>;
/** 本地新增数据提交服务器（SourceAdd） */
export declare const submitPipelinesToServer: (pipelines: any[]) => Promise<void>;
/** 冲突数据覆盖服务器（SourceUpdate），沿用服务器原始记录 id 做原地更新 */
export declare const updatePipelinesToServer: (pipelines: any[], serverPipelines: any[]) => Promise<void>;
export declare const deletePipelinesFromServer: (serverPipelines: any[]) => Promise<void>;
/**
 *  保存当前场景的管线采集数据到 api 接口
 */
export declare const savePipelinesMap: (onlyUpdate?: boolean) => Promise<any>;
/**
 * 更新当前图纸版本（覆盖当前版本）
 */
export declare const saveCurrentPipelineVersion: () => Promise<any>;
/**
 *  更新当前场景的缩略图
 */
export declare const updatePipelineThumbnail: (showMsg?: boolean) => Promise<any>;
/**
 * 管线数据对比（深度容差比较）
 * 本地行与服务器行均由 convertPipelineToData 归一化，结构一致，可直接比较
 */
export declare const comparePipelineData: (localData: any[], serverData: any[]) => {
    conflicts: any[];
    localAdditions: any[];
    serverAdditions: any[];
};
