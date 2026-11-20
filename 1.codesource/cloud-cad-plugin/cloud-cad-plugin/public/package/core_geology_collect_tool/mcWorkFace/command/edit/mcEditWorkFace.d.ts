import { McCore } from 'McCore';
import { McDbWorkFace } from '../../entity/mcDbWorkFace';
/**
 * 编辑工作面起采线或终采线
 * @param core 核心实例
 * @param targetWorkFace 目标工作面实体，如果未传入则进入选择工作面模式
 * @param editStartLine 是否编辑起采线，默认为 true
 * @returns 编辑结果
 */
export declare function editWorkFaceFootageLine(core: McCore, targetWorkFace: McDbWorkFace | undefined, editStartLine?: boolean): Promise<null | undefined>;
