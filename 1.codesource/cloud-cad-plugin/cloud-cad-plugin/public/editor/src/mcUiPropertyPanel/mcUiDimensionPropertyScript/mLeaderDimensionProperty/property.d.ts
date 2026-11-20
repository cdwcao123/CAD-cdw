import { McDbMLeaderDimension } from 'McCore';
import { DynamicBool } from '../../type/mcProperty';
import { GroupPropertyType } from '../../type/mcPropertyManager';
type MLeaderGroupPropertyType = GroupPropertyType<McDbMLeaderDimension> & {
    isShow?: DynamicBool;
};
export declare const mLeaderPropertyPanelScript: Map<string, MLeaderGroupPropertyType>;
export {};
