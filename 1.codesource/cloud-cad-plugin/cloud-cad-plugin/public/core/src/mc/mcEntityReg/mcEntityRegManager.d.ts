import { EntityRegInfo } from '../types/interface';
export declare class McEntityRegManager {
    #private;
    constructor();
    isInternalEntity(className: string): boolean;
    getLayerMask(className: string): number;
    _regRuntimeClass(info: EntityRegInfo): void;
    static getInstance(): McEntityRegManager;
    registerEntityClass(entityRegInfo: EntityRegInfo): void;
    createEntity(className: string, ...args: any[]): any;
    createRunTimeClassInstance(className: string, ...args: any[]): any;
    getEntityClassName(className: string): string;
    unregisterClass(className: string): void;
    getList(): Map<string, EntityRegInfo>;
    has(name: string): boolean;
    get(name: string): EntityRegInfo | undefined;
}
export declare const mcEntityRegManager: McEntityRegManager;
