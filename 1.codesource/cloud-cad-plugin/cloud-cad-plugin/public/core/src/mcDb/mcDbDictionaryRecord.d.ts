import { McMcdFiler } from '../mc/mcLoaders/mcMcdFiler';
import { McMctfFiler } from '../mc/mcLoaders/mcMctfFiler';
import { McDbObject } from './mcDbObject';
export declare class McDbDictionaryRecord extends McDbObject {
    protected readonly _type: string;
    protected static readonly _className: string;
    protected name: string;
    constructor(name?: string);
    getName(): string;
    setName(name: string): void;
    mctfInFields(fields: McMctfFiler): void;
    mctfOutFields(fields: McMctfFiler): void;
    mcdInFields(fields: McMcdFiler): void;
    mcdOutFields(fields: McMcdFiler): void;
}
