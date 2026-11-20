import { NumberFieldSpec } from './type/enum';
export declare const drawGrip: (entity: any, index: number, position: any) => void;
export declare const clearGrip: () => void;
export declare const normalizeNumber: (val: any, spec: NumberFieldSpec) => number;
export declare const checkPrecisionLimit: (val: string | number, spec: NumberFieldSpec) => boolean;
