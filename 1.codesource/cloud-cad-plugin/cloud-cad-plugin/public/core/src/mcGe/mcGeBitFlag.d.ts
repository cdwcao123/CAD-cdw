import { McGeVector3 } from './mcGeVector3';
export declare class McGeBitFlag {
    static kOut: number;
    static kIn: number;
    static kLeftSide: number;
    static kRightSide: number;
    static kInsideBoundary: number;
    static kOutsideBoundary: number;
    static kDown: number;
    static kUp: number;
    flag: number;
    constructor(nFlg?: number);
    getFlag(): number;
    is(nVal: number): boolean;
    isNot(nVal: number): boolean;
    isEmptyFlag(): boolean;
    isSameFlag(nVal: number): boolean;
    addFlag(nVal: number): void;
    removeFlag(nVal: number): void;
    addAssign(nVal: number): McGeBitFlag;
    minusAssign(nVal: number): McGeBitFlag;
    add(nVal: number): number;
    minus(nVal: number): number;
    setFlag(nVal: number): void;
    clearFlag(): void;
}
export declare class McGePa extends McGeBitFlag {
    dPa: number;
    constructor(pa?: number, f?: number);
    isEqual(pa: McGePa): boolean;
    isNotEqual(pa: McGePa): boolean;
    isMoreThan(pa: McGePa): boolean;
    isLessThan(pa: McGePa): boolean;
}
export declare class McGePtPa extends McGePa {
    pt: McGeVector3;
    constructor(point: McGeVector3, pa: number);
}
