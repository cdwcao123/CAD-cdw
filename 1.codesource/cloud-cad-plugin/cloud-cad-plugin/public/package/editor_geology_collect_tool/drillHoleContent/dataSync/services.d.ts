import type { DrillHoleSyncComparison, DrillHoleSyncRow } from './types';
export declare function loadServerDrills(): Promise<DrillHoleSyncRow[]>;
export declare function loadLocalDrills(): DrillHoleSyncRow[];
export declare function compareDrills(local: DrillHoleSyncRow[], server: DrillHoleSyncRow[]): DrillHoleSyncComparison;
export declare function createServerDrill(row: DrillHoleSyncRow): Promise<void>;
export declare function updateServerDrill(row: DrillHoleSyncRow): Promise<void>;
export declare function removeServerDrill(row: DrillHoleSyncRow): Promise<void>;
export declare function removeLocalDrill(row: DrillHoleSyncRow): void;
export declare function importServerDrill(row: DrillHoleSyncRow, replace?: boolean): Promise<any>;
