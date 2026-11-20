declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    modelValue: {
        type: (NumberConstructor | StringConstructor)[];
        default: string;
    };
    disabled: BooleanConstructor;
    readonly: BooleanConstructor;
    prop: {
        type: ObjectConstructor;
        default: undefined;
    };
    currentIndex: {
        type: NumberConstructor;
        default: number;
    };
    getOptions: {
        type: FunctionConstructor;
        default: undefined;
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    pick: (...args: any[]) => void;
    commit: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelValue: {
        type: (NumberConstructor | StringConstructor)[];
        default: string;
    };
    disabled: BooleanConstructor;
    readonly: BooleanConstructor;
    prop: {
        type: ObjectConstructor;
        default: undefined;
    };
    currentIndex: {
        type: NumberConstructor;
        default: number;
    };
    getOptions: {
        type: FunctionConstructor;
        default: undefined;
    };
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onPick?: ((...args: any[]) => any) | undefined;
    onCommit?: ((...args: any[]) => any) | undefined;
}>, {
    readonly: boolean;
    disabled: boolean;
    modelValue: string | number;
    currentIndex: number;
    getOptions: Function;
    prop: Record<string, any>;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
