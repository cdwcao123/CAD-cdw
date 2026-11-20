import { McDbMLeaderStyle } from 'McCore';
type __VLS_Props = {
    details: McDbMLeaderStyle | Record<string, any>;
    activeTabName?: string;
    initialPreviewUrl?: string;
    dialogSessionId?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    changeData: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeData?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
