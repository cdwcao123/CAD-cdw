import { ComputedRef, Ref } from 'vue';
import { BottomMenuItem, corrdinate } from './type/interface';
export declare class McUiBottomManager {
    private static instance;
    private readonly menus;
    readonly menuList: ComputedRef<BottomMenuItem[]>;
    readonly position: Ref<corrdinate>;
    private constructor();
    static getInstance(): McUiBottomManager;
    readonly addMenu: (config: BottomMenuItem, index?: number) => void;
    readonly removeBottomMenu: (key: string) => void;
    readonly updateBottomMenu: (config: Partial<BottomMenuItem>) => void;
    readonly updatePosition: (coord: corrdinate) => void;
    readonly getBottomMenu: (key: string) => BottomMenuItem | undefined;
    readonly hasBottomMenu: (key: string) => boolean;
    readonly clear: () => void;
}
export declare const mcUiBottomManager: McUiBottomManager;
