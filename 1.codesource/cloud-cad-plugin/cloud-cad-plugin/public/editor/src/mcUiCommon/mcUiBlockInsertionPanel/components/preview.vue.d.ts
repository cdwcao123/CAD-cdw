declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    type: {
        type: StringConstructor;
        default: string;
    };
    size: {
        type: NumberConstructor;
        default: number;
    };
    entity: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, {
    generatePreview: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    getUrl: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    type: {
        type: StringConstructor;
        default: string;
    };
    size: {
        type: NumberConstructor;
        default: number;
    };
    entity: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{
    onGetUrl?: ((...args: any[]) => any) | undefined;
}>, {
    size: number;
    type: string;
    entity: Record<string, any>;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
export default _default;
