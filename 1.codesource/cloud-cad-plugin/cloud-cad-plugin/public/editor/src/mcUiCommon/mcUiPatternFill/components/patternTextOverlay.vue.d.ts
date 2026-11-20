type __VLS_Props = {
    modelValue: number;
    type?: 'transparency' | 'angle';
    min?: number;
    max?: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    "update:modelValue": (value: number) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {
    type: "transparency" | "angle";
    min: number;
    max: number;
    modelValue: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    wrapper: HTMLDivElement;
    previewBg: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
