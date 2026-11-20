import { McDbTable } from 'McCore';
import { GroupPropertyType } from '../type/mcPropertyManager';
export declare const tablePropertyPanelScript: Map<string, GroupPropertyType<McDbTable>>;
export declare const tableObjectPropertyPanelScript: Map<string, GroupPropertyType<McDbTable>>;
export declare const createTextContentGroup: (contentIndexes: number[]) => GroupPropertyType<McDbTable>;
export declare const createBlockContentGroup: (entity: McDbTable, contentIndexes: number[]) => GroupPropertyType<McDbTable>;
export declare const createMultipleContentGroups: (entity: McDbTable) => GroupPropertyType<McDbTable>[];
