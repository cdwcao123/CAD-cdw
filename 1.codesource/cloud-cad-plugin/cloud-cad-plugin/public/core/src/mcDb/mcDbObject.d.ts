import { McMcdFiler, McMctfFiler, McXData } from '../mc';
import { McObject } from '../mc/mcObject';
import { McDbObjectEventType, McDbObjectId } from './types/type';
export declare abstract class McDbObject extends McObject {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    _objectId: McDbObjectId;
    _xData: McXData | null;
    constructor();
    get objectId(): string;
    on(eventName: keyof McDbObjectEventType, callback: (data: any) => void): void;
    once(eventName: keyof McDbObjectEventType, callback: (data: any) => void): void;
    emit(eventName: keyof McDbObjectEventType, data?: any): void;
    off(eventName: keyof McDbObjectEventType, callback: (data: any) => void): void;
    setObjectId(value: string): void;
    get xData(): McXData | null;
    setXData(value: McXData): void;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): void;
    mcdOutFields(fields: McMcdFiler): void;
    clone(): this;
    copy(source: this): this;
}
