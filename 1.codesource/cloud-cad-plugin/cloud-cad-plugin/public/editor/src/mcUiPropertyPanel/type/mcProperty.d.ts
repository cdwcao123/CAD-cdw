import { ControlType } from './enum';
export type DynamicBoolCtx = {
    modelValue?: Record<string, any>;
    entity?: any;
    entities?: any[];
};
export type DynamicBool = boolean | ((ctx: DynamicBoolCtx) => boolean);
export interface BaseOption {
    label: string;
    value: string | number | boolean | undefined | null;
}
export interface BasePropertyType extends BaseOption {
    key: string;
    entityIds?: Set<string>;
    isIndex?: boolean;
    description?: string;
    isNeedIndex?: boolean;
    controlType: {
        type: ControlType;
        controlConfig?: Record<string, any>;
        options?: BaseOption[] | (() => BaseOption[]);
    };
}
export interface PropertyType<T> extends BasePropertyType {
    setVal?: (value: any, entity: T, index?: number) => any;
    getVal: (entity: T, index?: number) => any;
    isShow?: DynamicBool;
    isEdit?: DynamicBool;
}
export interface PropertyAllType<T> extends BasePropertyType {
    isShow?: DynamicBool;
    isEdit?: DynamicBool;
    allOldProperty?: PropertyType<T>[];
}
