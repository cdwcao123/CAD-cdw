import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { LinearUnitType } from '../types/enum';
export declare class McDbDimensionStyleAlternateUnits {
    enabled: boolean;
    lengthUnits: LinearUnitType;
    stackedUnits: boolean;
    lengthPrecision: number;
    multiplier: number;
    roundOff: number;
    dimPrefix: string;
    dimSuffix: string;
    suppressLinearLeadingZeros: boolean;
    suppressLinearTrailingZeros: boolean;
    suppressZeroFeet: boolean;
    suppressZeroInches: boolean;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
}
