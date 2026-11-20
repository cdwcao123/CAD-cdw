import { CreatableSelectOption } from '../../../../types/interface';
type __VLS_Props = {
    modelValue?: string | number | boolean | null | undefined | any[];
    disabled?: boolean;
    placeholder?: string;
    getOptions?: () => CreatableSelectOption[] | Promise<CreatableSelectOption[]>;
    multiple?: boolean;
    filterable?: boolean;
    allowCreate?: boolean;
    defaultFirstOption?: boolean;
    clearable?: boolean;
    collapseTags?: boolean;
    collapseTagsTooltip?: boolean;
    reserveKeyword?: boolean;
    cacheKey?: string;
    prop?: {
        key?: string;
    };
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    change: (val: any) => any;
    "update:modelValue": (val: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((val: any) => any) | undefined;
    "onUpdate:modelValue"?: ((val: any) => any) | undefined;
}>, {
    placeholder: string;
    multiple: boolean;
    disabled: boolean;
    modelValue: string | number | boolean | any[] | null;
    filterable: boolean;
    getOptions: () => CreatableSelectOption[] | Promise<CreatableSelectOption[]>;
    clearable: boolean;
    allowCreate: boolean;
    defaultFirstOption: boolean;
    reserveKeyword: boolean;
    collapseTags: boolean;
    collapseTagsTooltip: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
