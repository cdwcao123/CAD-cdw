import { Layer } from '../../mcUiLayerSelect/components/mcUiLayerItem/type/interface';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    isOpactiy: {
        type: BooleanConstructor;
        default: boolean;
    };
    list: {
        type: () => Layer[];
        default: () => never[];
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    selectedId: {
        type: StringConstructor;
        default: string;
    };
    selectedIds: {
        type: () => string[];
        default: () => never[];
    };
}>, {
    startNameEdit: (rowId: string) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    clickRow: (...args: any[]) => void;
    rowChange: (...args: any[]) => void;
    "row-select": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    isOpactiy: {
        type: BooleanConstructor;
        default: boolean;
    };
    list: {
        type: () => Layer[];
        default: () => never[];
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    selectedId: {
        type: StringConstructor;
        default: string;
    };
    selectedIds: {
        type: () => string[];
        default: () => never[];
    };
}>> & Readonly<{
    onClickRow?: ((...args: any[]) => any) | undefined;
    onRowChange?: ((...args: any[]) => any) | undefined;
    "onRow-select"?: ((...args: any[]) => any) | undefined;
}>, {
    list: Layer[];
    height: string;
    selectedId: string;
    isOpactiy: boolean;
    selectedIds: string[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    editableTableRef: unknown;
    nameInputRef: unknown;
}, HTMLDivElement>;
export default _default;
