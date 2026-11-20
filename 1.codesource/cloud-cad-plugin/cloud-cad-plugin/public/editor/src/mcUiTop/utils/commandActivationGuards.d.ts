import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
import { TopNodeJsonItem } from '../type/interface';
import { TopCommandActivationGuard } from '../type/type';
export declare class TopCommandActivationGuardRegistry {
    private readonly guards;
    private requestSequence;
    private requestQueue;
    set(key: string, guard: TopCommandActivationGuard): void;
    delete(key: string): void;
    clear(): void;
    run(item: MenuItem | TopNodeJsonItem, activate: () => void | Promise<void>, prepare?: (isCurrent: () => boolean) => boolean | Promise<boolean>): Promise<boolean>;
}
export declare const topCommandActivationGuards: TopCommandActivationGuardRegistry;
