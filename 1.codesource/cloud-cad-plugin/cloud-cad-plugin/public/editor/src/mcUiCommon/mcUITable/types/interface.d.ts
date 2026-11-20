export interface Column {
    type?: 'selection' | 'index';
    prop: string;
    label: string;
    width?: number;
    minWidth?: number;
    fixed?: string;
    align?: string;
    index?: number | ((index: number) => number);
    showOverflowTooltip?: boolean;
    disableFocus?: boolean;
    max?: number;
    min?: number;
    step?: number;
    editable?: boolean;
    edit?: boolean;
    editType?: string;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    maxlength?: number;
    showWordLimit?: boolean;
    multiple?: boolean;
    options?: {
        label: string;
        value: string;
        disabled?: boolean;
    }[];
    filterable?: boolean;
    slot?: string;
    reserveSelection?: boolean;
}
export interface LegacyTableOption {
    value: number | string;
    label: string;
    [key: string]: number | string;
}
export interface LegacyTableColumnProps {
    column: any;
    type: 'select' | 'input' | 'date';
    label: string;
    property: string;
    render?: 'component' | 'slot';
    options?: LegacyTableOption[] | ((row: any, column: any) => LegacyTableOption[]);
    row: any;
    modelValue: any;
    attr?: {
        type?: string;
        optionlabel?: string;
        optionValue?: string;
        allowCreate?: boolean;
        onPropValChange?: Function;
        precision?: number;
        number?: string;
        maxlength?: number;
        format?: string;
        valueFormat?: string;
        max?: number;
        min?: number;
    };
    readonly?: boolean;
}
export interface LegacyTableDemoRow {
    id: number;
    uiEdit?: boolean;
    ignoreList?: string[];
    readonlyKeyList?: string[];
    errorList?: string[];
    [key: string]: unknown;
}
export interface LegacyTableDemoInstance {
    validate: (row: LegacyTableDemoRow) => {
        isValidate: boolean;
        errorMsg: string[];
        errorColList: string[];
    };
}
