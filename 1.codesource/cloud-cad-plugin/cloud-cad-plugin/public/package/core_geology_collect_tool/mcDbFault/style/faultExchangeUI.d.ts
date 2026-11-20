import { McUIExchangeBase } from 'McCore';
import { IMcFaultProperty } from '../types/interface';
/**
 * 硐室实体与用户界面交互管理类，单例类
 */
export declare class McDbFaultUIExchange extends McUIExchangeBase<IMcFaultProperty> {
    /**
     * 单例实例
     */
    private static instance;
    /**
     * 获取单例实例
     */
    static getInstance(): McDbFaultUIExchange;
    private constructor();
}
