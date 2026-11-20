import { IMcGeVector4, McGsRendererBase } from 'McCore';
import { McDbWorkFace } from '../entity/mcDbWorkFace';
/**
 * 工作面实体渲染类
 */
export declare class McGsWorkFaceRender extends McGsRendererBase {
    /** 渲染实体接口 */
    render(): boolean;
    /**
   * 构建工作面模型数据
   * @param {McDbWorkFace} workFace 工作面实体
   * @returns {IMcGeVector4[][]} 工作面分段后的模型数据
   */
    static buildMeshData(workFace: McDbWorkFace): {
        front: IMcGeVector4[];
        back: IMcGeVector4[];
        mid: IMcGeVector4[];
    };
}
