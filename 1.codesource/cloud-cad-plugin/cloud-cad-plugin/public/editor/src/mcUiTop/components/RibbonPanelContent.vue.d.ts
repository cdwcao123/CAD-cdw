import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
import { TopNodeJson, TopNodeJsonItem } from '../type/interface';
import { TopMenuLayout } from '../type/type';
type __VLS_Props = {
    rows: TopMenuLayout;
    module: TopNodeJson;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (item: TopNodeJsonItem, value: unknown) => any;
    action: (item: TopNodeJsonItem) => any;
    menuSelect: (item: TopNodeJsonItem, option: MenuItem | MenuItem[]) => any;
    dropdownState: (open: boolean) => any;
    authorityDenied: (item: TopNodeJsonItem) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: TopNodeJsonItem, value: unknown) => any) | undefined;
    onAction?: ((item: TopNodeJsonItem) => any) | undefined;
    onMenuSelect?: ((item: TopNodeJsonItem, option: MenuItem | MenuItem[]) => any) | undefined;
    onDropdownState?: ((open: boolean) => any) | undefined;
    onAuthorityDenied?: ((item: TopNodeJsonItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
