import { McEventReactor } from './mcEventReactor';
export type McUIExchangeEvent = {
    showPanel: () => void;
    finishPanel: (param?: unknown) => void;
    panelClosed: () => void;
    panelParamChange: (key: unknown, oldValue: unknown, newValue: unknown) => void;
    coreParamChange: (key: unknown, oldValue: unknown, newValue: unknown) => void;
    customEvent: (eventName: string, ...args: unknown[]) => void;
};
export declare enum ParamChangeEventType {
    None = 0,
    Panel = 1,
    Core = 2
}
export declare class McUIExchangeBase<T> extends McEventReactor<McUIExchangeEvent> {
    #private;
    protected constructor();
    setParams(params: T): void;
    getParam<K extends keyof T>(key: K): T[K];
    setParam<K extends keyof T>(key: K, value: T[K], eventType?: ParamChangeEventType): void;
    getParams(): T;
}
