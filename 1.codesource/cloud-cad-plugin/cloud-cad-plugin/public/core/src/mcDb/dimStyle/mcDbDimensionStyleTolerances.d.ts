import { McMcdFiler } from '../../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../../mc/mcLoaders/mcMctfFiler';
import { DimensionStyleTolerancesDisplayMethod, DimensionStyleTolerancesVerticalPlacement } from '../types/enum';
export declare class McDbDimensionStyleTolerances {
    displayMethod: DimensionStyleTolerancesDisplayMethod;
    upperLimit: number;
    lowerLimit: number;
    verticalPlacement: DimensionStyleTolerancesVerticalPlacement;
    precision: number;
    suppressLinearLeadingZeros: boolean;
    suppressLinearTrailingZeros: boolean;
    suppressZeroFeet: boolean;
    suppressZeroInches: boolean;
    alternatePrecision: number;
    altSuppressLinearLeadingZeros: boolean;
    altSuppressLinearTrailingZeros: boolean;
    altSuppressZeroFeet: boolean;
    altSuppressZeroInches: boolean;
    mctfInFields(fields: McMctfFiler): Promise<void>;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): Promise<void>;
    mcdOutFields(fields: McMcdFiler): void;
}
