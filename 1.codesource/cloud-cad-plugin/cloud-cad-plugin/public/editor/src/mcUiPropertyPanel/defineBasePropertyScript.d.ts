import { McDbEntity } from 'McCore';
import { GroupType, GroupParams } from './type/mcPropertyManager';
export declare class ReadOnlyBaseProperty<T extends McDbEntity> {
    name: string;
    groups: Map<string, GroupType<T>>;
    constructor(name?: string);
    private initBaseProperty;
    addGroup(config: GroupParams): GroupType<T>;
}
