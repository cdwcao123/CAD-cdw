export interface MlCharacterMapDialogProps {
    dialogId: string;
    fontOptions: {
        label: string;
        value: string;
    }[];
    initialFont?: string;
}
declare const _default: import('vue').DefineComponent<MlCharacterMapDialogProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    changeData: (...args: any[]) => void;
}, string, import('vue').PublicProps, Readonly<MlCharacterMapDialogProps> & Readonly<{
    onChangeData?: ((...args: any[]) => any) | undefined;
}>, {
    initialFont: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
