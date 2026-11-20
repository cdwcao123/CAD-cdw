interface ColorConfig {
    primary: string;
    primaryLight3: string;
    primaryLight5: string;
    primaryLight7: string;
    primaryLight8: string;
    primaryLight9: string;
    primaryDark2: string;
}
declare function generateElementColors(primaryColor: string): ColorConfig;
declare function applyElementColors(primaryColor: string): void;
declare function generateCSSVariables(primaryColor: string): string;
export { generateElementColors, applyElementColors, generateCSSVariables };
