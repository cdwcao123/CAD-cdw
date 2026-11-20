import { McDbPipelineDrawStylePropertyEvent, McDbPipelineDrawStylePropertyType as PropertyType } from '../types/enum';
import { McDbPipelineDrawStyleChangeFun, McDbPipelineDrawStylePanelFun, McDbPipelineDrawStyleProperty as Property } from '../types/type';
/**
 * 巷道绘制样式类
 */
export declare class McDbPipelineDrawStyle {
    /** 单例实例 */
    private static _instance;
    /**
     * 获取McDbTunnelDrawStyle实例
     * @returns McDbTunnelDrawStyle实例
     */
    static get instance(): McDbPipelineDrawStyle;
    /** 巷道绘制样式改变事件<UI注册> */
    protected contextStyleChangeFun: McDbPipelineDrawStyleChangeFun | undefined;
    /** 巷道绘制样式面板事件<UI注册> */
    protected contextStylePanelFun: McDbPipelineDrawStylePanelFun | undefined;
    /** 巷道绘制样式改变事件<内部使用> */
    protected contextStyleChangeFunInternal: McDbPipelineDrawStyleChangeFun | undefined;
    /** 巷道绘制样式面板退出事件 */
    protected contextStyleUIPanelQuitFun: McDbPipelineDrawStylePanelFun | undefined;
    /** 样式属性列表 */
    protected properties: Map<PropertyType, Property>;
    /**
     * 默认构造
     * 私有
     */
    protected constructor();
    /**
     * 初始化样式属性
     * @description 初始化样式属性并添加到属性列表中，子类可重载该方法以添加更多样式属性
     */
    protected initStyle(): void;
    /**
     * 设置样式属性
     * 该方法由<前端页面>修改属性时调用
     * @param property 语义块样式属性
     */
    setContextStyleProperty(property: Property): void;
    /**
     * 设置样式属性
     * 该方法由<内核>修改属性时调用
     * @param property 语义块样式属性
     */
    setContextStylePropertyInternal(property: Property): void;
    /**
     * 获取样式属性
     * @param properties 属性列表
     * @returns 样式属性列表
     * @example
     * 列表为空时返回所有属性
     * const properties = McDbTunnelDrawStyle.instance.getTunnelStyleProperties([]);
     */
    getPipelineStyleProperties(properties?: PropertyType[]): Property[];
    /**
     * 获取指定属性
     * @param propertyType 属性类型
     * @returns 样式属性
     */
    getPipelineStyleProperty(propertyType: PropertyType): Property | undefined;
    /**
     * 添加样式面板事件回调
     * 用于通知<内核>退出编辑状态
     * @param callback 回调方法，取消回调参数传入undefined
     */
    setContextStyleUIPanelQuitFun(callback: McDbPipelineDrawStylePanelFun | undefined): void;
    /**
     * 添加样式面板事件回调
     * 用于通知<前端页面>打开/关闭样式面板
     * 前端样式页面调用
     * @param callback 回调方法，取消回调参数传入undefined
     */
    setContextStylePanelFun(callback: McDbPipelineDrawStylePanelFun | undefined): void;
    /**
     * 用于通知内核退出文本编辑
     * 前端样式页面调用
     */
    quitEdit(): void;
    /**
     * 发送面板开关事件
     * @param event 板开关事件
     */
    emitPropertyEvent(event: McDbPipelineDrawStylePropertyEvent): void;
    /**
     * 通知UI更新一组属性
     * @param properties 属性列表
     */
    updateContextStyleProperty(property: PropertyType): void;
    /**
     * 设置样式属性改变回调<UI注册>
     * @param callback 回调方法，取消回调参数传入undefined
     */
    setContextStyleChangeFun(callback: McDbPipelineDrawStyleChangeFun | undefined): void;
    /**
     * 设置样式属性改变回调<内部使用>
     * @param callback 回调方法，取消回调参数传入undefined
     */
    setContextStyleChangeFunInternal(callback: McDbPipelineDrawStyleChangeFun | undefined): void;
    /**
     * 通知工具更新属性
     * @param properties 属性列表
     */
    updateContextStylePropertyInternal(property: PropertyType): void;
}
