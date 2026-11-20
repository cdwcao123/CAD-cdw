import { McCore } from 'McCore/mcCore';
import { Component } from 'vue';
import { ToolTipContents } from '../../mcUiCommon';
import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
import { TopMenuAnchorPlacement, TopMenuDisplayType, TopMenuIconSize, TopMenuSeparatorType, TopMenuType } from './enum';
import { SearchSourceType, TopMenuColumn, TopMenuLayout } from './type';
export interface BaseNode {
    label: string;
    key: string;
    className?: string;
    component?: {
        name: string;
        props?: any;
    };
    icon?: string;
    iconSize?: TopMenuIconSize;
}
export interface NodeModule extends BaseNode {
    children: Map<string, TopNodeJson>;
}
export interface NodeModuleDefine extends BaseNode {
    children: TopNodeJsonDefine[];
}
export interface TopNodeJson extends BaseNode {
    closePanelCallback?: () => Promise<boolean>;
    children: Map<string, TopNodeJsonItem>;
    layout: TopMenuLayout;
}
export interface TopNodeJsonDefine extends BaseNode {
    children?: TopMenuLayout;
}
export interface TopMenuChildGroup {
    key: string;
    label: string;
    separatorType: TopMenuSeparatorType;
    child: TopMenuColumn;
    className?: string;
}
export interface TopMenuAnchorPosition {
    anchorKey: string;
    placement: TopMenuAnchorPlacement;
}
export interface TopMenuRemoveModuleOptions {
    activateModuleKey?: string | null;
}
export interface TopNodeJsonItem extends Omit<BaseNode, 'component'> {
    desc: string;
    value: any;
    type: TopMenuType;
    displayType: TopMenuDisplayType;
    active?: boolean;
    component?: Component | string;
    componentProps?: Record<string, unknown>;
    placeholder?: string;
    controlWidth?: number | string;
    maxlength?: number;
    clearable?: boolean;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    unit?: string;
    controls?: boolean;
    options?: Item[];
    menuOptions?: MenuItem[];
    dropdownActionOnly?: boolean;
    selectAction?: (core: McCore) => any;
    action?: string;
    needCore?: boolean;
    actionFun?: Function;
    disabled?: boolean;
    activeMenuKey?: string[];
    detailToolTip?: ToolTipContents[];
    searchable?: boolean;
    searchAlias?: string[];
    searchText?: string;
    searchWeight?: number;
    noAuthority?: boolean;
}
export interface Item {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
    action: string;
}
export interface TabBarPages {
    key: string;
    name: string;
    icon: string;
    desc?: string;
    component: Component;
}
export interface TopFeatureSearchItem {
    id: string;
    key: string;
    label: string;
    desc?: string;
    pathText: string;
    sourceType: SearchSourceType;
    searchable: boolean;
    searchWeight: number;
    searchText: string;
    searchAlias: string[];
    action?: string;
    actionFun?: Function;
    value?: any;
    disabled?: boolean;
    needCore?: boolean;
    moduleKey?: string;
    rawItem: MenuItem | TopNodeJsonItem;
}
