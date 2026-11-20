import { ColorSpace, DisplayP3ColorSpace, LinearSRGBColorSpace, SRGBColorSpace } from '../constants';
import { Color } from './Color';
export function SRGBToLinear(c: number): number;

export function LinearToSRGB(c: number): number;

export namespace ColorManagement {
    
    let enabled: boolean;

    
    let workingColorSpace: ColorSpace;

    function convert(
        color: Color,
        sourceColorSpace: typeof SRGBColorSpace | typeof LinearSRGBColorSpace | typeof DisplayP3ColorSpace,
        targetColorSpace: typeof SRGBColorSpace | typeof LinearSRGBColorSpace | typeof DisplayP3ColorSpace,
    ): Color;

    function fromWorkingColorSpace(
        color: Color,
        targetColorSpace: typeof SRGBColorSpace | typeof LinearSRGBColorSpace,
    ): Color;

    function toWorkingColorSpace(
        color: Color,
        sourceColorSpace: typeof SRGBColorSpace | typeof LinearSRGBColorSpace,
    ): Color;
}
