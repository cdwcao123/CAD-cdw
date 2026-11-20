import { McAlongParameter, McGasAreaParameter, McSingleDirectionalParameter, McSingleParameter, McThroughParameter } from './types/interface';
import { McDrawAlongBoreholeEvent, McDrawGasAreaEvent, McDrawSingleBoreholeEvent, McDrawSingleDirectionalBoreholeEvent, McDrawThroughBoreholeEvent, McParameterChangeEvent } from './types/type';
/**
 * 抽采钻孔绘制面板事件类
 */
export declare class McDrawBoreholeEvent {
    /** 单例实例 */
    private static _instance;
    /**
       * 获取McDrawBoreholeEvent实例
       * @returns McDrawBoreholeEvent实例
       */
    static get instance(): McDrawBoreholeEvent;
    /** 绘制单个孔样式改变事件<UI注册> */
    protected drawSingleBoreholeStyleChangeEvent: McDrawSingleBoreholeEvent | undefined;
    /** 绘制顺层孔样式改变事件<UI注册> */
    protected drawAlongBoreholeStyleChangeEvent: McDrawAlongBoreholeEvent | undefined;
    /** 绘制穿层孔样式改变事件<UI注册> */
    protected drawThroughBoreholeStyleChangeEvent: McDrawThroughBoreholeEvent | undefined;
    /** 绘制评价单元样式改变事件<UI注册> */
    protected drawGasAreaStyleChangeEvent: McDrawGasAreaEvent | undefined;
    /** 绘制单个定向钻孔样式改变事件<UI注册> */
    protected drawDirectionalBoreholeStyleChangeEvent: McDrawSingleDirectionalBoreholeEvent | undefined;
    /** 参数改变事件<UI注册> */
    protected parameterChangeEvent: McParameterChangeEvent | undefined;
    /**
       * 默认构造
       * 私有
       */
    protected constructor();
    /**
       * 绘制单个抽采钻孔样式改变时的通知事件
       * 命令端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setDrawSingleBoreholeStyleChangeEvent(callback: McDrawSingleBoreholeEvent | undefined): void;
    /**
       * 触发绘制单个抽采钻孔样式改变事件(UI端触发)
       */
    emitSingleBoreholeStyleChangeEvent(parameter: McSingleParameter): void;
    /**
       * 绘制顺层钻孔样式改变时的通知事件
       * 命令端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setDrawAlongBoreholeStyleChangeEvent(callback: McDrawAlongBoreholeEvent | undefined): void;
    /**
       * 触发绘制顺层钻孔样式改变事件(UI端触发)
       * @param parameter 参数对象
       */
    emitAlongBoreholeStyleChangeEvent(parameter: McAlongParameter): void;
    /**
       * 绘制穿层钻孔样式改变时的通知事件
       * 命令端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setDrawThroughBoreholeStyleChangeEvent(callback: McDrawThroughBoreholeEvent | undefined): void;
    /**
       * 触发绘制穿层钻孔样式改变事件(UI端触发)
       * @param parameter 参数对象
       */
    emitThroughBoreholeStyleChangeEvent(parameter: McThroughParameter): void;
    /**
       * 绘制定向钻孔样式改变时的通知事件
       * 命令端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setDrawDirectionalBoreholeStyleChangeEvent(callback: McDrawSingleDirectionalBoreholeEvent | undefined): void;
    /**
       * 触发绘制定向钻孔样式改变事件(UI端触发)
       * @param parameter 参数对象
       */
    emitDirectionalBoreholeStyleChangeEvent(parameter: McSingleDirectionalParameter): void;
    /**
       * 绘制评价单元样式改变时的通知事件
       * 命令端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setDrawGasAreaStyleChangeEvent(callback: McDrawGasAreaEvent | undefined): void;
    /**
       * 触发绘制评价单元样式改变事件(UI端触发)
       * @param parameter 参数对象
       */
    emitGasAreaStyleChangeEvent(parameter: McGasAreaParameter): void;
    /**
       * 参数改变时的通知事件
       * UI端初始化调用
       * @param callback 回调方法，取消回调参数传入undefined
       */
    setParameterChangeEvent(callback: McParameterChangeEvent | undefined): void;
    /**
       * 触发参数改变事件(命令端触发)
       * @param key 参数键
       * @param value 参数值
       */
    emitParameterChangeEvent(key: string, value: any): void;
}
