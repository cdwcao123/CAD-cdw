type __VLS_Props = {
    modelValue?: any;
    options?: any[];
    disabled?: boolean;
    placeholder?: string;
    loadOptions?: (() => Promise<any[]> | any[]) | null;
    normalizeValue?: ((value: any, options?: any[]) => any) | null;
    prop?: any;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: string[]) => any;
    "update:modelValue": (value: string[]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: string[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
