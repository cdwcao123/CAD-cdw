import { ErrorStatus } from './types/enum';
export declare class McReturnStatus<T> {
    status: ErrorStatus;
    data: T | string;
    msg: string;
    constructor(data?: T | string, status?: ErrorStatus, msg?: string);
    static res(status?: ErrorStatus): McReturnStatus<string>;
    static resBoolean(res: boolean): McReturnStatus<boolean>;
    static eTrue(): McReturnStatus<boolean>;
    static eFalse(status?: ErrorStatus, msg?: string): McReturnStatus<boolean>;
    static eOk(): McReturnStatus<string>;
    isOk(): boolean;
}
