import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
import { MenuType } from '../../mcUiTop/type/type';
export interface BottomMenuItem extends MenuItem {
    active?: boolean;
    controlType?: MenuType;
    divider?: boolean;
}
export interface corrdinate {
    x: number | string;
    y: number | string;
    z: number | string;
}
