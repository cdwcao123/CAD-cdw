import { ColorRepresentation } from '../utils';
import { Color } from './../math/Color';
import { MaterialParameters, Material } from './Material';
export interface LineBasicMaterialParameters extends MaterialParameters {
    color?: ColorRepresentation | undefined;
    fog?: boolean | undefined;
    linewidth?: number | undefined;
    linecap?: string | undefined;
    linejoin?: string | undefined;
}

export class LineBasicMaterial extends Material {
    constructor(parameters?: LineBasicMaterialParameters);

    
    type: string;

    
    color: Color;

    
    fog: boolean;

    
    linewidth: number;

    
    linecap: string;

    
    linejoin: string;

    setValues(parameters: LineBasicMaterialParameters): void;
}
