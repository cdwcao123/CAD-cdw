import { McEventReactor } from '../mcEventReactor';
import { McCore, MenuEventType } from '../../mcCore';
import { McMenuAction } from './mcMenuAction';
import { McMenuGroup } from './mcMenuGroup';
export declare class McMenuManager extends McEventReactor<MenuEventType> {
    #private;
    menuGroups: Map<string, McMenuGroup>;
    currentMenuGroups: Map<string, McMenuGroup>;
    mcCore: McCore;
    constructor(mcCore: McCore);
    getMenuPanelStyle(): string;
    getMenuItemNormalStyle(): string;
    getMenuItemSelectStyle(): string;
    clearMenus(): void;
    addMenu(menuAction: McMenuGroup): boolean;
    removeMenu(name: string): void;
    getMenus(): Map<string, McMenuGroup>;
    getArrowStyle(): void;
    initMenus(): void;
    hideMenus(): void;
    showMenus(event: MouseEvent): boolean;
    execMenuAction(menuAction: McMenuAction): Promise<boolean>;
}
export declare function execMenuAction(core: McCore, menuAction: McMenuAction): Promise<boolean>;
