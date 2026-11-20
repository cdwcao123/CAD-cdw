import { McDbMTextContextStyleProperty, McColor } from 'McCore';
import { MtcpStyleDefinition } from './interface';
export type MultiTextStyleType = Omit<McDbMTextContextStyleProperty, 'propertyType'> & {
    propertyType: string;
};
export type MtcpColorValue = McColor | string | number;
export type MtcpFormState = Omit<MtcpStyleDefinition, 'mtcpColor' | 'mtcpBackColor'> & {
    mtcpColor: MtcpColorValue;
    mtcpBackColor: MtcpColorValue;
};
export type MtcpPropertyKey = Extract<keyof MtcpFormState, string>;
export type BooleanPropertyKey = {
    [K in MtcpPropertyKey]: MtcpFormState[K] extends boolean ? K : never;
}[MtcpPropertyKey];
export type MenuPropertyKey = 'mtcpSymbol';
export type ColorPropertyKey = 'mtcpColor' | 'mtcpBackColor';
export type McDbTextStyleBinding = {
    font: string;
    widthFactor: number;
    italicAngle: number;
};
