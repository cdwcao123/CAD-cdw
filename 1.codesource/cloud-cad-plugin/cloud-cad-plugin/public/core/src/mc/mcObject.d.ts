export declare abstract class McObject {
    protected abstract readonly _type: string;
    protected static readonly _className: string;
    isA(): string;
    static desc(): string;
}
