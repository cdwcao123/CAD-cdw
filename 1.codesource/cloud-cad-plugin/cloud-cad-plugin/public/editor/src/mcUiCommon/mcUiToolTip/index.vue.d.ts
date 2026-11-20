import { ToolTipContents, ToolTipProps } from './type/interface';
import { PlacementType } from './type/type';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
        tooltip?(_: {}): any;
    };
    refs: {
        wrapperRef: HTMLDivElement;
        tooltipRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<ToolTipProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<ToolTipProps> & Readonly<{}>, {
    title: string;
    offset: {
        x: number;
        y: number;
    };
    placement: PlacementType;
    delay: number;
    contents: ToolTipContents[];
    trigger: import('./type/type').TriggerType;
    cmdAsName: string;
    delayImage: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    wrapperRef: HTMLDivElement;
    tooltipRef: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
