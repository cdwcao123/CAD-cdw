import { BasePropertyScript, type GroupPropertyType } from 'McEditor';
import type { McDbGasArea } from '@/core_geology_collect_tool/mcDrainageBorehole';
/**
 * 创建评价单元的业务属性和几何数据，直接读写实体已保存的各项参数。
 * @param entity 当前评价单元，用于读取所在图纸的工作面选项和单选时的真实钻孔关联。
 * @returns 属性及几何数据分组；几何分组由注册脚本限制为单选显示。
 */
export declare function createGasAreaProperties(entity: McDbGasArea): GroupPropertyType<McDbGasArea>[];
/** 评价单元特性面板，展示业务参数及单体边界几何数据。 */
export declare class GasAreaPropertyScript extends BasePropertyScript<McDbGasArea> {
    /**
     * 装配评价单元字段；坐标通过单体列表弹框展示，不参与多实体聚合。
     * @param name 实体类型名称。
     * @param entity 当前选中的评价单元。
     */
    constructor(name: string, entity: McDbGasArea);
}
