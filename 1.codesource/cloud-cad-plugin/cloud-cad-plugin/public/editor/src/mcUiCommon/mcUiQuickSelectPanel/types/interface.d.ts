import { McDbEntity } from 'McCore';
import { PropertyType } from '../../../mcUiPropertyPanel';
export interface QuickSelectPanelFormData {
    applyTo: number;
    objectType: string;
    property: string;
    operator: string;
    value: any;
    applyMethod: number;
    addToSelection: boolean;
}
export interface QuickSelectPanelPropertyOptions extends PropertyType<McDbEntity> {
    operator: string;
}
