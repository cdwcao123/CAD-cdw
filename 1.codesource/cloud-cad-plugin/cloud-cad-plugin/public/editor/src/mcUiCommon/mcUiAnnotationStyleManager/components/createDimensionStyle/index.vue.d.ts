import { McDbDimStyle } from 'McCore';
type __VLS_Props = {
    step: number;
    isAdd: boolean;
    selectedStyle?: McDbDimStyle;
    dialogId?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    cancel: (...args: any[]) => void;
    changeData: (...args: any[]) => void;
    done: (...args: any[]) => void;
    "update:form": (...args: any[]) => void;
    "update:details": (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: ((...args: any[]) => any) | undefined;
    onChangeData?: ((...args: any[]) => any) | undefined;
    onDone?: ((...args: any[]) => any) | undefined;
    "onUpdate:form"?: ((...args: any[]) => any) | undefined;
    "onUpdate:details"?: ((...args: any[]) => any) | undefined;
}>, {
    dialogId: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
