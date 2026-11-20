import { McDbCustomEntity, McDbLayer } from '../mcDb';
import { McReturnStatus } from './mcReturnStatus';
export declare class McTransparency {
    #private;
    static get byLayer(): McTransparency;
    static get byBlock(): McTransparency;
    static get default(): McTransparency;
    constructor();
    constructor(value: number);
    validateValue(): boolean;
    get isByLayer(): boolean;
    get isByBlock(): boolean;
    getValue(): number;
    getRealValue(layer?: McDbLayer, block?: McDbCustomEntity): number;
    setValue(val: number): McReturnStatus<string>;
    toThree(layer?: McDbLayer, block?: McDbCustomEntity): number;
    static fromThree(normalized: number): McTransparency;
    clone(): McTransparency;
    equals(other: McTransparency): boolean;
    toString(): string;
}
