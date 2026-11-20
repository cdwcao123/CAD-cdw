import type { DrillHoleSourceFields, GisDrillRecord } from '../drillHoleDataManage/types';
export interface DrillHoleSyncRow extends DrillHoleSourceFields {
    entity?: any;
}
export interface DrillHoleSyncComparison {
    conflicts: DrillHoleSyncRow[];
    localAdditions: DrillHoleSyncRow[];
    serverAdditions: DrillHoleSyncRow[];
}
export interface DrillHoleSyncDetail {
    local?: DrillHoleSyncRow;
    server?: DrillHoleSyncRow;
    type: 'local' | 'server' | 'conflict';
}
export type DrillHoleServerRecord = GisDrillRecord;
