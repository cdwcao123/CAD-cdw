import { LinePropertyScript } from '../mcUiLinePropertyScript';
import { DynamicBool, PropertyType } from './mcProperty';
export type entityPropertyType = LinePropertyScript;
export interface GroupParams {
    key: string;
    name: string;
}
export interface GroupType<T> extends GroupParams {
    property: Map<string, PropertyType<T>>;
}
export interface GroupPropertyType<T> extends GroupParams {
    property: PropertyType<T>[];
}
export interface RemoveGroupParams {
    key: string;
    properties: string[];
}
export interface AddPropertyParams<T> {
    groupKey: string;
    property: PropertyType<T>;
}
export interface GroupAllType<T> extends GroupParams {
    property: PropertyType<T>[];
    entityPropertys?: Map<string, Map<string, PropertyType<T>>>;
}
export interface MergePropertyResult {
    groups: Map<string, GroupType<any>>;
    entityIds: Set<string> | null;
}
export interface MergeProperty {
    property: Map<string, PropertyType<any>>;
    entityIds: Set<string>;
}
export type FeaturePanelLayout = 'single' | 'tabs';
export type FeaturePanelSectionType = 'groups' | 'custom';
export interface FeaturePanelHeaderConfig {
    showClose?: boolean;
    showRename?: boolean;
    showDelete?: boolean;
}
export interface FeaturePanelSectionBase {
    key: string;
    label?: string;
    isShow?: DynamicBool;
}
export interface FeaturePanelGroupsSection extends FeaturePanelSectionBase {
    type: 'groups';
    groupKeys?: string[];
}
export interface FeaturePanelCustomSection extends FeaturePanelSectionBase {
    type: 'custom';
    renderer: string;
    props?: Record<string, any>;
}
export type FeaturePanelSection = FeaturePanelGroupsSection | FeaturePanelCustomSection;
export interface FeaturePanelConfig {
    layout?: FeaturePanelLayout;
    header?: FeaturePanelHeaderConfig;
    sections: FeaturePanelSection[];
    defaultSectionKey?: string;
}
