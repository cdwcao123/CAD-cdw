import { ICurveRenderableParamsEx, McGeVector3, McGsComplexCurveRender, McGsRenderable, McGsRendererBase } from 'McCore';
/**
 * 地质模型管线渲染类
 * @description 通用类，给外部使用的地质模型管线渲染类提供实现
 */
export declare class McGsGeoPipeLineRender extends McGsComplexCurveRender {
    /** 渲染实体接口 */
    render(): boolean;
    /**
     *  根据coords 和render 渲染曲线，可用于继承自curve的实体类型渲染曲线
     * @param coords 曲线坐标
     * @param needHandleBlockMatrix 需要最后处理块矩阵，默认false
     * @returns
     */
    renderCurve(coords: McGeVector3[], needHandleBlockMatrix?: boolean, closed?: boolean): boolean;
    /**
     *  处理带线型的线类别的render返回renderable
     * @param render 要处理的render
     * @param params 线参数
     * @returns 返回构建的renderable
     */
    protected getSpaceLineRenderableWithLineType(render: McGsRendererBase, params: ICurveRenderableParamsEx): McGsRenderable[];
}
