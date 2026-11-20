import { McObject } from './mcObject';
import { IEventType } from './types/interface';
declare class McEventReactor<T extends IEventType> extends McObject {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    on<K extends keyof T>(key: K, fn: T[K], index?: number, obstruct?: boolean): void;
    once<K extends keyof T>(key: K, fn: T[K], index?: number, obstruct?: boolean): void;
    onImp<K extends keyof T>(key: K, fn: T[K], once: boolean, index?: number, obstruct?: boolean): void;
    emit<K extends keyof T>(key: K, ...args: Parameters<T[K]>): Array<ReturnType<T[K]>>;
    emitAsync<K extends keyof T>(key: K, ...args: Parameters<T[K]>): Promise<Array<Awaited<ReturnType<T[K]>>>>;
    off<K extends keyof T>(key: K, fn: T[K]): void;
    clearEvents(): void;
}
export { McEventReactor };
