import { type GroupPropertyType } from 'McEditor';
import { type McDbChamberInstance } from '@/utils/pluginApi';
type McDbChamber = McDbChamberInstance;
/** 硐室属性分组，按定义顺序装配到特性面板。 */
export declare const chamberProperties: Map<string, GroupPropertyType<McDbChamber>>;
export {};
