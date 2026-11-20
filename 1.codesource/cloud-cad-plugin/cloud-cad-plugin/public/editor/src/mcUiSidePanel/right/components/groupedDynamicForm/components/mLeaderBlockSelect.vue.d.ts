type __VLS_Props = {
    modelValue?: string;
    disabled?: boolean;
    placeholder?: string;
    prop?: {
        key?: string;
    };
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: string) => any;
    "update:modelValue": (val: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: string) => any) | undefined;
    "onUpdate:modelValue"?: ((val: string) => any) | undefined;
}>, {
    placeholder: string;
    disabled: boolean;
    modelValue: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
