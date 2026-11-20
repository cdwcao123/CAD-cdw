export interface Column {
    prop: string;
    label: string;
    width?: number;
    minWidth?: number;
    fixed?: string;
    align?: string;
    disableFocus?: boolean;
    max?: number;
    min?: number;
    step?: number;
    editable?: boolean;
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
}
