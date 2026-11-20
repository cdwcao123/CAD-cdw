import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { McDbSymbolTableRecord } from '../mcDbSymbolTableRecord';
import { MaterialGeoType } from '../types/enum';
export declare class McDbMaterial extends McDbSymbolTableRecord {
    protected readonly _type: string;
    protected static readonly _className: string;
    geoType: MaterialGeoType;
    constructor(geoType?: MaterialGeoType, name?: string, desc?: string, isReNameable?: boolean);
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
}
