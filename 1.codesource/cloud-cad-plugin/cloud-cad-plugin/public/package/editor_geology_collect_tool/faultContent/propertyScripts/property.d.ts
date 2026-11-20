import { GroupPropertyType } from 'McEditor';
import { type McDbFaultInstance } from '@/utils/pluginApi';
type McDbFault = McDbFaultInstance;
declare const loadFaultStratumOptions: () => Promise<void>;
export { loadFaultStratumOptions };
/** 断层属性面板脚本 */
export declare const faultProperties: Map<string, GroupPropertyType<McDbFault>>;
