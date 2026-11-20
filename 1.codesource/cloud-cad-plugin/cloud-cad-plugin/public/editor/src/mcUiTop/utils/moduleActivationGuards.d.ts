import { TopModuleActivationGuard } from '../type/type';
export declare class TopModuleActivationGuardRegistry {
    private readonly guards;
    private requestSequence;
    private requestQueue;
    set(key: string, guard: TopModuleActivationGuard): void;
    delete(key: string): void;
    clear(): void;
    run(currentModuleKey: string, targetModuleKey: string, activate: () => void): Promise<boolean>;
}
