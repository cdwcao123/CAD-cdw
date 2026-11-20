import { MenuItem } from '../../mcUiCommon/mcUiDropDownMenu/type/interface';
import { NodeModule, TopFeatureSearchItem } from '../type/interface';
export type { TopFeatureSearchItem } from '../type/interface';
export type { SearchSourceType } from '../type/type';
export declare const buildTopFeatureSearchIndex: (modulesMap: Map<string, NodeModule>, topToolsMap: Map<string, MenuItem>, fileMenus: MenuItem[]) => TopFeatureSearchItem[];
export declare const searchTopFeatureItems: (index: TopFeatureSearchItem[], query: string, limit?: number) => TopFeatureSearchItem[];
