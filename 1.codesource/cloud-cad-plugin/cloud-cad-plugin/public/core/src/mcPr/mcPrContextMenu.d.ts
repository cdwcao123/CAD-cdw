import { McCore, McEngine } from '../mcCore';
import { McGeVector3 } from '../mcGe';
import { McPrMessagePanel, McPrBase } from '.';
import { McPrResultStatus } from './types/interface';
export declare class McPrContextMenu extends McPrBase {
    position: McGeVector3;
    protected selectMenuName: string;
    protected selectMenuKeyWord: string;
    protected itemWidth: number;
    protected messagePanel: McPrMessagePanel | null;
    protected defaultMenu: string;
    constructor(mcCore: McCore, defaultMessage?: string, defaultPoint?: McGeVector3);
    protected initContextMenu(): void;
    protected createItem(contextMenu: HTMLElement, itemName: string, itemKey: string): void;
    protected clear(): void;
    setDefaultMenu(menu: string): void;
    setPosition(position: McGeVector3): void;
    finished(status: McPrResultStatus): void;
    run(): Promise<McPrResultStatus>;
    stop(): void;
    handleMouseUp: (event: MouseEvent, engine: McEngine) => void;
    handleMouseWheel: (event: WheelEvent, engine: McEngine) => void;
    handleMouseMove(event: MouseEvent, engine: McEngine): void;
    handleKeyDown: (event: KeyboardEvent, engine: McEngine) => void;
}
