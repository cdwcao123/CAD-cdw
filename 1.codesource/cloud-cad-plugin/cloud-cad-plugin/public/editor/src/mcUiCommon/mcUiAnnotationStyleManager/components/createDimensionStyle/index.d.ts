import { McColor, McDbDimStyle } from 'McCore';
declare function applyDetailsToDimStyle(details: any, dimStyle: McDbDimStyle): void;
declare function applyDimStyleToDetails(dimStyle: McDbDimStyle, details: any): void;
declare function useMcColorBinding(colorObj: McColor | undefined): import('vue').WritableComputedRef<string, string>;
export { applyDetailsToDimStyle, applyDimStyleToDetails, useMcColorBinding };
