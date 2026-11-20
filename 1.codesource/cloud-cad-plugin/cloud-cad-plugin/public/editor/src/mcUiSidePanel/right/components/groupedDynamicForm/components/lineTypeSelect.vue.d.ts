declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    modelValue: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
    disabled: BooleanConstructor;
    getOptions: FunctionConstructor;
    placeholder: StringConstructor;
    disabledLineType: {
        type: (ArrayConstructor | StringConstructor)[];
        default: () => never[];
    };
    deferInitialOptions: BooleanConstructor;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelValue: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
    disabled: BooleanConstructor;
    getOptions: FunctionConstructor;
    placeholder: StringConstructor;
    disabledLineType: {
        type: (ArrayConstructor | StringConstructor)[];
        default: () => never[];
    };
    deferInitialOptions: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: string | Record<string, any>;
    disabledLineType: string | unknown[];
    deferInitialOptions: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
