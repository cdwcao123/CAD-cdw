import { Ref } from 'vue';
export interface McUiSidePanelState {
    activePanel: Ref<string | undefined>;
    panels: Ref<Map<string, string>>;
}
export interface FieldSchema {
    key: string;
    label: string;
    type: 'input' | 'number' | 'select' | 'switch' | 'color';
    value: any;
    options?: Array<{
        label: string;
        value: any;
        color?: string;
    }>;
    disabled?: boolean;
    readonly?: boolean;
    visible?: boolean;
}
export interface GroupSchema {
    title: string;
    fields: FieldSchema[];
    collapsed?: boolean;
}
export interface PanelDefinitions {
    key: string;
    label: string;
    component?: any;
}
export interface LineTypeOption {
    label: string;
    value: string;
    preview: 'solid' | 'dashed' | 'dotted' | 'double' | 'none' | string;
}
export type CadColorSource = 'byLayer' | 'byBlock' | 'byForeground' | 'aci' | 'eNull' | 'rgb';
export interface CreatableSelectOption {
    label: string;
    value: any;
}
