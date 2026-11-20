import { BasePropertyScript } from 'McEditor';
import type { McDbChamberInstance } from '@/utils/pluginApi';
/** 硐室特性面板脚本，负责装配硐室实体的全部业务属性分组。 */
export declare class ChamberPropertyScript extends BasePropertyScript<McDbChamberInstance> {
    /**
     * 创建硐室特性面板脚本。
     * @param name 实体类型名称。
     * @param entity 当前选中的硐室实体。
     */
    constructor(name: string, entity: McDbChamberInstance);
    /**
     * 初始化硐室业务属性分组。
     * @param entity 当前选中的硐室实体。
     */
    private initChamberGroup;
}
export default ChamberPropertyScript;
