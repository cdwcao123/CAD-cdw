import { type NodeModuleDefine } from 'McEditor';
import { type McDbChamberUIExchangeInstance } from '@/utils/pluginApi';
export declare const chamberDefaultSettingModuleKey = "ChamberDefaultSettingPanel";
export declare const chamberDefaultSettingPanelKey = "chamberDefaultSettingBasic";
export declare const createChamberDefaultSettingModule: (exchange: McDbChamberUIExchangeInstance, onClose: () => void) => NodeModuleDefine;
export declare const syncChamberDefaultSettingPanel: (exchange: McDbChamberUIExchangeInstance) => void;
