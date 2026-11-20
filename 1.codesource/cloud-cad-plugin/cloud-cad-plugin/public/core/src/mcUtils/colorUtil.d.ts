import { McColor } from '../mc/mcColor';
import { McColorIndex } from '../mc/types/enum';
import { ThemeColorConfig } from '../mc/types/interface';
export declare function isValidTransparency(value: number): boolean;
declare function generateElementColors(primaryColor: string): ThemeColorConfig;
export declare function generateRandomColor(excludeIndices?: McColorIndex[]): McColor;
export { generateElementColors, };
