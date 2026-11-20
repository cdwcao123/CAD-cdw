import { TopMenuMutationErrorCode } from './enum';
import { TopMenuChildGroup, TopNodeJsonItem } from './interface';
import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
export type MenuType = 'text' | 'dropdown' | 'select' | 'checkbox' | 'input' | 'switch';
export type DisflxType = 'flexRow' | 'flexColumn';
export type TopMenuInlineGroup = TopNodeJsonItem[];
export type TopMenuGridColumn = TopNodeJsonItem[];
export type TopMenuGrid = TopMenuGridColumn[];
export type TopMenuColumnItem = TopNodeJsonItem | TopMenuChildGroup | TopMenuInlineGroup | TopMenuGrid;
export type TopMenuColumn = TopMenuColumnItem[];
export type TopMenuRowItem = TopNodeJsonItem | TopMenuChildGroup | TopMenuColumn;
export type TopMenuRow = TopMenuRowItem[];
export type TopMenuLayout = TopMenuRow[];
export type TopModuleActivationGuard = (currentModuleKey: string, targetModuleKey: string) => boolean | Promise<boolean>;
export type TopCommandActivationGuard = (item: MenuItem | TopNodeJsonItem) => boolean | Promise<boolean>;
export type TopMenuMutationResult = {
    ok: true;
} | {
    ok: false;
    code: TopMenuMutationErrorCode;
    message: string;
    path?: Array<string | number>;
};
export type TopMenuLayoutValidationResult = {
    ok: true;
    items: TopNodeJsonItem[];
} | {
    ok: false;
    code: TopMenuMutationErrorCode.INVALID_LAYOUT | TopMenuMutationErrorCode.TOOL_KEY_REQUIRED | TopMenuMutationErrorCode.TOOL_EXISTS;
    message: string;
    path: Array<string | number>;
};
export type SearchSourceType = 'module' | 'topTool' | 'fileMenu';
