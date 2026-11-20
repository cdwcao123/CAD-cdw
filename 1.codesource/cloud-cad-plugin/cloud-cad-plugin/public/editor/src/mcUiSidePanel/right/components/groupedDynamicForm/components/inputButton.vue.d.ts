import { Component } from 'vue';
type __VLS_Props = {
    modelValue?: string | number;
    buttonText?: string;
    buttonIcon?: string | Component;
    buttonType?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'text' | '';
    buttonSize?: 'large' | 'default' | 'small' | '';
    plain?: boolean;
    disabled?: boolean;
    placeholder?: string;
    gap?: number;
    prop?: any;
    currentIndex?: number;
    getOptions?: () => any[];
    onClick?: (payload: {
        value: any;
        prop: any;
        event: MouseEvent;
    }) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (value: any) => any;
    click: (payload: any) => any;
    "update:modelValue": (value: any) => any;
    pick: (value: any) => any;
    commit: (value: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: any) => any) | undefined;
    onClick?: ((payload: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
    onPick?: ((value: any) => any) | undefined;
    onCommit?: ((value: any) => any) | undefined;
}>, {
    placeholder: string;
    plain: boolean;
    disabled: boolean;
    onClick: (payload: {
        value: any;
        prop: any;
        event: MouseEvent;
    }) => void;
    modelValue: string | number;
    currentIndex: number;
    getOptions: () => any[];
    buttonText: string;
    prop: any;
    gap: number;
    buttonIcon: string | Component;
    buttonType: "default" | "primary" | "success" | "info" | "warning" | "danger" | "text" | "";
    buttonSize: "large" | "default" | "small" | "";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
