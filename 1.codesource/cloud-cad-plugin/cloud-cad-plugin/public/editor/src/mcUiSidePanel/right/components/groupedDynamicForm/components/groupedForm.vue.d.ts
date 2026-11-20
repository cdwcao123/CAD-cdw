type __VLS_Props = {
    groups: Map<string, any>;
    modelValue: Record<string, any>;
    entityIds: any;
    propertyManager?: any;
    commandManager: any;
    database: any;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (propKey: string, value: any) => any;
    "update:modelValue": (val: Record<string, any>) => any;
    "property-update-state": (active: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((propKey: string, value: any) => any) | undefined;
    "onUpdate:modelValue"?: ((val: Record<string, any>) => any) | undefined;
    "onProperty-update-state"?: ((active: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    formRef: unknown;
}, any>;
export default _default;
