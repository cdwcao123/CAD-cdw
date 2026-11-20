import { McDbEntity } from 'McCore';
import { PropertyType } from './type/mcProperty';
import { FeaturePanelConfig, GroupType, GroupParams, AddPropertyParams } from './type/mcPropertyManager';
export declare class BasePropertyScript<T extends McDbEntity> {
    #private;
    name: string;
    entityName: string;
    groups: Map<string, GroupType<T>>;
    panelConfig?: FeaturePanelConfig;
    entityIds: Set<string>;
    constructor(name: string, entity?: T);
    setAttrKeys(keys: string[]): void;
    protected hasResolvedConstructorEntity(): boolean;
    protected initBaseProperty(entity?: T): void;
    getEntitysProperty(property: PropertyType<T>, entity?: T, oldProperty?: PropertyType<T>, useResolvedValue?: boolean): PropertyType<T>;
    protected resolvePropertyValue(property: PropertyType<T>, entity: T): any;
    addGroup(config: GroupParams): GroupType<T>;
    addProperty(config: AddPropertyParams<T>, entity: T): void;
    removeProperty(groupKey: string, propertyKey: string): void;
    setProperty(entity: T, oldEntityProperty: BasePropertyScript<T>): void;
}
