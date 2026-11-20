import { McDbBlock } from 'McCore';
import type { McDbPlaneTemplateStyle } from '@/core_geology_collect_tool/mcGeoDrill/template';
/**
 * 仅用于 Editor 弹框的临时块，直接引用模板定义并交由二维预览引擎渲染。
 * 不注册运行时类、不加入图纸数据库，也不向正式块定义表添加记录。
 */
export declare class DrillHoleTemplatePreviewBlock extends McDbBlock {
    /** 当前预览模板，仅用于读取几何；McDbBlock 重建时会克隆子实体。 */
    private readonly templateStyle;
    /**
     * 创建临时模板块，沿用属性定义中的中文文字内容和文字高度。
     * @param style 要预览的钻孔模板
     */
    constructor(style: McDbPlaneTemplateStyle);
    /**
     * 向块的公共渲染流程提供模板定义，不查询正式块定义表。
     * @returns 当前预览所引用的模板
     */
    getBlockDef(): McDbPlaneTemplateStyle;
}
