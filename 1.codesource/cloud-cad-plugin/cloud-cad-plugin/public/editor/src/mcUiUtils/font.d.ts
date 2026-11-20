import { McCore, McTextSymbols } from 'McCore';
import { Options } from '../mcUiMain';
declare const getMtcpStyle: (core: McCore) => Options[];
declare const getMtcpFont: () => Promise<Options[]>;
declare const getMtcpRowSpacing: () => Options[];
declare const getMtcpBasePointStyle: () => Options[];
declare const getMtcptHorizontalStyle: () => Options[];
declare const getMtcpTextDirection: () => Options[];
declare const getMtcpFontSymbol: () => {
    label: string;
    value: McTextSymbols;
}[];
declare const getMtcpBigFont: () => Promise<Options[]>;
declare const getTextVerticalModeStyle: () => Options[];
export { getMtcpStyle, getMtcpFont, getMtcpRowSpacing, getMtcpBasePointStyle, getMtcptHorizontalStyle, getMtcpTextDirection, getMtcpFontSymbol, getMtcpBigFont, getTextVerticalModeStyle, };
