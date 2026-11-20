import { McCore, McDbEntity, McDbObject, McPickEntityMode } from 'McCore';
import { Options } from '../../mcUiMain';
import { McUiPropertyManager } from '../../mcUiPropertyPanel/mcPropertyManager';
declare const propertyManager: McUiPropertyManager;
declare const quickSelectPreparing: import('vue').Ref<boolean, boolean>;
declare const quickSelectDataVersion: import('vue').Ref<number, number>;
declare const currentEntityList: import('vue').ShallowRef<McDbObject[] | McDbEntity[], McDbObject[] | McDbEntity[]>;
declare const applyOptions: import('vue').Ref<{
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[], Options[] | {
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[]>;
declare const propertyOptions: import('vue').Ref<{
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[], Options[] | {
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[]>;
declare const applyMethodOptions: import('vue').Ref<{
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[], Options[] | {
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[]>;
declare const calcApplyOptions: import('vue').ComputedRef<{
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: any[] | undefined;
}[]>;
declare const getPickEntity: (core: McCore, pickType?: McPickEntityMode) => Promise<McDbEntity[]>;
declare const rebuildQuickSelectPropertyCache: (entities: Iterable<McDbObject>, chunkSize?: number) => Promise<void>;
declare const getQuickSelectEntitiesByApplyTo: (applyTo: number) => Promise<McDbObject[]>;
declare const rebuildQuickSelectPropertyCacheByApplyTo: (applyTo: number) => Promise<void>;
export { currentEntityList, calcApplyOptions, propertyManager, quickSelectPreparing, quickSelectDataVersion, getQuickSelectEntitiesByApplyTo, rebuildQuickSelectPropertyCache, rebuildQuickSelectPropertyCacheByApplyTo, applyOptions, propertyOptions, applyMethodOptions, getPickEntity, };
