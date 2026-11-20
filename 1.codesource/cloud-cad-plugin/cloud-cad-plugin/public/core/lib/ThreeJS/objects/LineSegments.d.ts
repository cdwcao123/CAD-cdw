import { Material } from './../materials/Material';
import { Line } from './Line';
import { BufferGeometry } from '../core/BufferGeometry';

export const LineStrip: number;

export const LinePieces: number;

export class LineSegments<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[],
> extends Line<TGeometry, TMaterial> {
    constructor(geometry?: TGeometry, material?: TMaterial);

    
    type: 'LineSegments' | string;
    readonly isLineSegments: true;
}
