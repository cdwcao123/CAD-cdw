import { McDbMLeaderStyle } from 'McCore';
type __VLS_Props = {
    details: McDbMLeaderStyle | Record<string, any> | null;
    active?: boolean;
    previewUrl: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:details": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:details"?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
