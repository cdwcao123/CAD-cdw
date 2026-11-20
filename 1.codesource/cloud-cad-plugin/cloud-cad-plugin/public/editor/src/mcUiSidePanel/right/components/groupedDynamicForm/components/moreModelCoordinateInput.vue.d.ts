type __VLS_Props = {
    modelValue: Record<string, unknown> | null | undefined;
    prop: any;
    disabled?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: Record<string, unknown>) => any;
    "update:modelValue": (val: Record<string, unknown>) => any;
    pick: (val: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: Record<string, unknown>) => any) | undefined;
    "onUpdate:modelValue"?: ((val: Record<string, unknown>) => any) | undefined;
    onPick?: ((val: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
