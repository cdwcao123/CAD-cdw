type __VLS_Props = {
    modelValue: number | string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: number) => any;
    input: (val: number) => any;
    "update:modelValue": (val: number) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: number) => any) | undefined;
    onInput?: ((val: number) => any) | undefined;
    "onUpdate:modelValue"?: ((val: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
