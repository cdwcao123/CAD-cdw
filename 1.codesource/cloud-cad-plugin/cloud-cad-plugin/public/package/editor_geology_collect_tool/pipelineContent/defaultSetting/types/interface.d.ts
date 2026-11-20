import type { McColor } from 'McCore';
/**
 * 管线默认设置表单
 * @param name 管线名称
 * @param wallDistance 管壁距离
 * @param bottomDistance 底部距离
 * @param raiseHeight 提升高度
 * @param section 管截面
 * @param radius 管半径
 * @param width 管宽度
 * @param height 管高度
 * @param type 管类型
 * @param layer 管层
 * @param color 管颜色
 * @param direction 管方向
 */
export interface PipelineDefaultSettingForm {
    name: string;
    wallDistance: number;
    bottomDistance: number;
    raiseHeight: number;
    section: number;
    radius: number;
    width: number;
    height: number;
    type: number;
    layer: string;
    color: McColor | string;
    direction: number;
    elevation: number;
}
