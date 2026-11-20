import { McColor } from '../../mc/mcColor';
import { McTextSymbols, McViewType } from '..';
declare const defaultMcCoreOption: {
    readonly viewType: McViewType.e2D;
    readonly loadEnv: "editor";
    readonly isSync: true;
    readonly view2dBackgroundColor: McColor;
    readonly view3dBackgroundColor: McColor;
};
declare const placeholder: string;
declare const specialCharEncoding: Record<string, string>;
declare const mtextSymbolsProperties: Record<McTextSymbols, {
    value: number;
    name: string;
    unicodeString: string;
}>;
export { defaultMcCoreOption, placeholder, specialCharEncoding, mtextSymbolsProperties, };
