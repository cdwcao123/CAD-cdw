import { Props, MenuItem } from './type/interface';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        trigger?(_: {}): any;
    };
    refs: {
        triggerRef: HTMLDivElement;
        dropdownRef: HTMLDivElement;
        subMenuRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Props, {
    open: () => void;
    close: () => void;
    toggle: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    menuItemClick: (item: MenuItem | MenuItem[]) => any;
    menuOpen: () => any;
    menuClose: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onMenuItemClick?: ((item: MenuItem | MenuItem[]) => any) | undefined;
    onMenuOpen?: (() => any) | undefined;
    onMenuClose?: (() => any) | undefined;
}>, {
    multiple: boolean;
    closeOnClickOutside: boolean;
    offset: number;
    placement: import('.').PlacementType;
    showArrow: boolean;
    disabled: boolean;
    menuCom: string | import('vue').Component;
    trigger: import('.').TriggerType;
    maxHeight: number;
    triggerText: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    triggerRef: HTMLDivElement;
    dropdownRef: HTMLDivElement;
    subMenuRef: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
