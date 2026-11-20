type __VLS_Props = {
    modelValue: any;
    prop: any;
    currentIndex?: number;
    disabled?: boolean;
    placeholder?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: number) => any;
    "update:modelValue": (val: number) => any;
    pick: (val: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: number) => any) | undefined;
    "onUpdate:modelValue"?: ((val: number) => any) | undefined;
    onPick?: ((val: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
