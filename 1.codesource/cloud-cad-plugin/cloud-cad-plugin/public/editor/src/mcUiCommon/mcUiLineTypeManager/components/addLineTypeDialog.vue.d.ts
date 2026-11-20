import { IMcDbLineType } from 'McCore';
type __VLS_Props = {
    selectedFile: string;
    lineTypes: IMcDbLineType[];
    source?: 'builtin' | 'external';
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeData: (value: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeData?: ((value: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    upload: unknown;
}, HTMLDivElement>;
export default _default;
