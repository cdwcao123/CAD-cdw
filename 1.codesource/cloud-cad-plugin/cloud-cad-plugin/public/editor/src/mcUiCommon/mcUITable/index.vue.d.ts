import { Column } from './types/interface';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: Partial<Record<string, (_: {
        row: any;
        index: any;
        isEditing: boolean;
        column: Column;
        endEdit: () => void;
        cellValue: any;
    }) => any>>;
    refs: {
        tableRef: unknown;
        editInputRef: unknown[];
    };
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    data: {
        type: ArrayConstructor;
        default: () => never[];
    };
    columns: {
        type: () => Column[];
        required: true;
    };
    editMode: {
        type: StringConstructor;
        default: string;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    highlightId: {
        type: StringConstructor;
        default: string;
    };
    selectedId: {
        type: StringConstructor;
        default: string;
    };
    shiftRangeSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowRangeSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowResizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    headerRowResizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowHeights: {
        type: () => number[];
        default: () => never[];
    };
    headerRowHeight: {
        type: NumberConstructor;
        default: number;
    };
    minRowHeight: {
        type: NumberConstructor;
        default: number;
    };
    selectedRows: {
        type: () => any[];
        default: () => never[];
    };
    batchLoading: {
        type: BooleanConstructor;
        default: boolean;
    };
    batchSize: {
        type: NumberConstructor;
        default: number;
    };
}>, {
    startEdit: (rowIndex: number, prop: string, isFocus: boolean) => Promise<void>;
    endEdit: () => void;
    setCurrentRowById: (id: string) => void;
    resetBatchLoading: () => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "row-select": (...args: any[]) => void;
    "cell-dblclick": (...args: any[]) => void;
    "edit-change": (...args: any[]) => void;
    "cell-edit": (...args: any[]) => void;
    "row-resize": (...args: any[]) => void;
    "header-row-resize": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    data: {
        type: ArrayConstructor;
        default: () => never[];
    };
    columns: {
        type: () => Column[];
        required: true;
    };
    editMode: {
        type: StringConstructor;
        default: string;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    highlightId: {
        type: StringConstructor;
        default: string;
    };
    selectedId: {
        type: StringConstructor;
        default: string;
    };
    shiftRangeSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowRangeSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowResizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    headerRowResizable: {
        type: BooleanConstructor;
        default: boolean;
    };
    rowHeights: {
        type: () => number[];
        default: () => never[];
    };
    headerRowHeight: {
        type: NumberConstructor;
        default: number;
    };
    minRowHeight: {
        type: NumberConstructor;
        default: number;
    };
    selectedRows: {
        type: () => any[];
        default: () => never[];
    };
    batchLoading: {
        type: BooleanConstructor;
        default: boolean;
    };
    batchSize: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{
    "onRow-select"?: ((...args: any[]) => any) | undefined;
    "onCell-dblclick"?: ((...args: any[]) => any) | undefined;
    "onEdit-change"?: ((...args: any[]) => any) | undefined;
    "onCell-edit"?: ((...args: any[]) => any) | undefined;
    "onRow-resize"?: ((...args: any[]) => any) | undefined;
    "onHeader-row-resize"?: ((...args: any[]) => any) | undefined;
}>, {
    height: string;
    data: unknown[];
    selectedId: string;
    selectedRows: any[];
    highlightId: string;
    rowRangeSelection: boolean;
    editMode: string;
    shiftRangeSelection: boolean;
    rowResizable: boolean;
    headerRowResizable: boolean;
    rowHeights: number[];
    headerRowHeight: number;
    minRowHeight: number;
    batchLoading: boolean;
    batchSize: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    tableRef: unknown;
    editInputRef: unknown[];
}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
