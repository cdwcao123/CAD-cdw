import { MenuItem } from '../type/interface';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    isFirst: {
        type: BooleanConstructor;
        default: boolean;
    };
    item: {
        type: () => MenuItem;
        default: () => {};
    };
    activeMenuKey: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    isFirst: {
        type: BooleanConstructor;
        default: boolean;
    };
    item: {
        type: () => MenuItem;
        default: () => {};
    };
    activeMenuKey: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>> & Readonly<{}>, {
    item: MenuItem;
    activeMenuKey: unknown[];
    isFirst: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
export default _default;
