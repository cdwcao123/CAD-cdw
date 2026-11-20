import { McReturnStatus } from '../../mc/mcReturnStatus';
import { McDbSymbolTable } from '../mcDbSymbolTable';
import { McDbGroup } from './mcDbGroup';
import { McDbObjectId } from '../types/type';
export declare class McDbGroupTable extends McDbSymbolTable<McDbGroup> {
    #private;
    protected readonly _type: string;
    protected static readonly _className: string;
    add(group: McDbGroup): McReturnStatus<McDbObjectId>;
    addEntityRefToGroup(entityId: McDbObjectId, groupId: McDbObjectId): boolean;
    isEntityInAnyGroup(entityId: McDbObjectId): boolean;
    removeEntityFromAllGroup(entityId: McDbObjectId): boolean;
    removeEntityRefFromGroup(entityId: McDbObjectId, groupId: McDbObjectId): boolean;
    removeGroup(groupID: McDbObjectId, bRemoveEntity?: boolean): McReturnStatus<string>;
    remove(groupName: string, bRemoveEntity?: boolean): McReturnStatus<string>;
    getGroupsOfEntity(entityId: McDbObjectId): McDbGroup[];
    redraw2D(): void;
    redraw3D(): void;
    destroy2d(): void;
    destroy3d(): void;
}
