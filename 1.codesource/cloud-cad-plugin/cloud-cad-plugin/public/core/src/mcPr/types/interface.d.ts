import { McDbEntity, McDbGrip, McDbGroup, MCEntityStretchPoints } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { McPrErrorStatus } from './enum';
declare class McPrResultStatus {
    status: McPrErrorStatus;
    data?: any;
    key?: string;
    constructor(status?: McPrErrorStatus, data?: any, key?: string);
}
declare class McPrPointResult extends McPrResultStatus {
    point?: McGeVector3;
    entity?: McDbEntity;
    child?: McDbEntity;
    gripPoints?: McGeVector3[];
    gripName?: string;
    constructor(status: McPrErrorStatus, point?: McGeVector3, entity?: McDbEntity, key?: string, data?: any);
}
declare class McPrEntityResult extends McPrResultStatus {
    point?: McGeVector3;
    entities?: McDbEntity[];
    grip?: McDbGrip;
    groups?: McDbGroup[];
    indexPoints?: Map<string, MCEntityStretchPoints[]>;
    isVolume?: boolean;
    constructor(status: McPrErrorStatus, entities?: McDbEntity[], grip?: McDbGrip, groups?: McDbGroup[], point?: McGeVector3, key?: string, data?: any);
}
declare class McPrAngleResult extends McPrResultStatus {
    point?: McGeVector3;
    angle?: number;
    constructor(status: McPrErrorStatus, angle?: number, point?: McGeVector3, key?: string, data?: any);
}
declare class McPrDistanceResult extends McPrResultStatus {
    point?: McGeVector3;
    distance?: number;
    constructor(status: McPrErrorStatus, distance?: number, point?: McGeVector3, key?: string, data?: any);
}
declare class McPrTextResult extends McPrResultStatus {
    point?: McGeVector3;
    text?: string;
    constructor(status: McPrErrorStatus, text?: string, point?: McGeVector3, key?: string, data?: any);
}
declare class McPrNumberResult extends McPrResultStatus {
    point?: McGeVector3;
    number?: number;
    constructor(status: McPrErrorStatus, number?: number, point?: McGeVector3, key?: string, data?: any);
}
export { McPrResultStatus, McPrPointResult, McPrEntityResult, McPrAngleResult, McPrDistanceResult, McPrTextResult, McPrNumberResult, };
