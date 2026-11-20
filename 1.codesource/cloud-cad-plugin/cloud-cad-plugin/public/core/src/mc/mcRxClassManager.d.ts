interface IMcRxClassInfo {
    className: string;
    classLabel: string;
    baseClassName: string;
}
export declare class McRxClassRegistry {
    private static classInfos;
    static register(className: string, classLabel: string, baseClassName?: string): void;
    static get(className: string): IMcRxClassInfo | undefined;
}
export declare abstract class McRxClass {
    protected abstract readonly _type: string;
    protected static readonly _className: string;
    protected abstract readonly _baseClassName: string;
    isA(): string;
    static desc(): string;
}
export {};
