import { LineBasicMaterial, LineBasicMaterialParameters } from './LineBasicMaterial';
export interface LineDashedMaterialParameters extends LineBasicMaterialParameters {
    scale?: number | undefined;
    dashSize?: number | undefined;
    gapSize?: number | undefined;
}

export class LineDashedMaterial extends LineBasicMaterial {
    constructor(parameters?: LineDashedMaterialParameters);

    
    type: string;

    
    scale: number;

    
    dashSize: number;

    
    gapSize: number;
    readonly isLineDashedMaterial: true;

    setValues(parameters: LineDashedMaterialParameters): void;
}
