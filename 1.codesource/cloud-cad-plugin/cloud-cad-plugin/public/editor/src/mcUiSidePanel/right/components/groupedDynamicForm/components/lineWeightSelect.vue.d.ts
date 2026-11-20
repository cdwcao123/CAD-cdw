type __VLS_Props = {
    modelValue?: number | string;
    disabled?: boolean;
    getOptions?: () => {
        label: string;
        value: any;
    }[];
    placeholder?: string;
    appdendTo?: string;
    disabledLineWeight?: number | string | (number | string)[];
    entity?: {
        getRealLineWeight?: () => number;
    } | null;
    entities?: {
        getRealLineWeight?: () => number;
    }[] | null;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: number | string;
    entity: {
        getRealLineWeight?: () => number;
    } | null;
    entities: {
        getRealLineWeight?: () => number;
    }[] | null;
    getOptions: () => {
        label: string;
        value: any;
    }[];
    disabledLineWeight: number | string | (number | string)[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
