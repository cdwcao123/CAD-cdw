import { DraggableProps } from '../types/interface';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        root: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<DraggableProps, {
    root: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<DraggableProps> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    root: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
