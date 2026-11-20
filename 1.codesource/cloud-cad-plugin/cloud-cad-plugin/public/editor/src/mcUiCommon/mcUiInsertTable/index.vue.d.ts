import { InsertTableFormData, InsertTableProps } from './types/interface';
declare const _default: import('vue').DefineComponent<InsertTableProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeData: (value: InsertTableFormData) => any;
    "update:modelValue": (value: InsertTableFormData) => any;
    editTableStyle: (value: string) => any;
}, string, import('vue').PublicProps, Readonly<InsertTableProps> & Readonly<{
    onChangeData?: ((value: InsertTableFormData) => any) | undefined;
    "onUpdate:modelValue"?: ((value: InsertTableFormData) => any) | undefined;
    onEditTableStyle?: ((value: string) => any) | undefined;
}>, {
    modelValue: Partial<InsertTableFormData>;
    tableStyleOptions: import('.').InsertTableOption[];
    cellStyleOptions: import('.').InsertTableOption[];
    cellStyleOptionsByTable: Record<string, import('.').InsertTableOption[]>;
    tableStyles: import('McCore').McDbTableStyle[];
    fileAccept: string;
    onEditTableStyle: (styleName: string) => void;
    hasStartingTable: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
