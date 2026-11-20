import { McUIExchangeBase } from 'McCore';
import { IMcDbChamberData } from '../entity/mcDbChamber';
/**
 * 硐室实体与用户界面交互管理类，单例类
 */
export declare class McDbChamberUIExchange extends McUIExchangeBase<IMcDbChamberData> {
    /**
     * 单例实例
     */
    private static instance;
    /**
     * 获取单例实例
     */
    static getInstance(): McDbChamberUIExchange;
    private constructor();
}
