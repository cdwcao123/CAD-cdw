import { McCore } from '../../mcCore/mcCore';
import { McRGB } from './interface';
declare const ERROR_STATUS_MESSAGE: Record<number, string>;
declare const STANDARD_COLOR_INDEX: Record<number, McRGB>;
declare const curCore: McCore | null;
export { ERROR_STATUS_MESSAGE, curCore, STANDARD_COLOR_INDEX, };
