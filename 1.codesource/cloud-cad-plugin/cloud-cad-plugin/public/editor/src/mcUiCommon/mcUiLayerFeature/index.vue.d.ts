import { Layer } from '../mcUiLayerSelect/components/mcUiLayerItem/type/interface';
declare const _default: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    filterTableRef: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('vue').ExtractPropTypes<{
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
        startNameEdit: (rowId: string) => Promise<void>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        clickRow: (...args: any[]) => void;
        rowChange: (...args: any[]) => void;
        "row-select": (...args: any[]) => void;
    }, import('vue').PublicProps, {
        list: Layer[];
        height: string;
        selectedId: string;
        isOpactiy: boolean;
        selectedIds: string[];
    }, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        editableTableRef: unknown;
        nameInputRef: unknown;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import('vue').ExtractPropTypes<{
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
        startNameEdit: (rowId: string) => Promise<void>;
    }, {}, {}, {}, {
        list: Layer[];
        height: string;
        selectedId: string;
        isOpactiy: boolean;
        selectedIds: string[];
    }> | null;
}, HTMLDivElement>;
export default _default;
