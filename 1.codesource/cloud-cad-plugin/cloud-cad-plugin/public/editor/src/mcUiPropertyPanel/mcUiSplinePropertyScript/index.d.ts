import { McDbSpline } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
import { PropertyType } from '../type/mcProperty';
export declare class SplinePropertyScript extends BasePropertyScript<McDbSpline> {
    constructor(name: string, entity: McDbSpline);
    getEntitysProperty(property: PropertyType<McDbSpline>, entity?: McDbSpline, oldProperty?: PropertyType<McDbSpline>, useResolvedValue?: boolean): PropertyType<McDbSpline>;
    initLineGroup(entity: McDbSpline): void;
    setProperty(entity: McDbSpline, oldEntityProperty: BasePropertyScript<McDbSpline>): void;
}
