import { McMeshFontData } from '../../mcFontManager';
import { McFontInfo } from '../../../mcCore/types/interface';
import { ShxFontData } from '../../../../lib/shx-parser/fontData';
export interface IndexSchema {
    name: string;
    keyPath: string | string[];
    options?: IDBIndexParameters;
}
export interface StoreSchema {
    name: string;
    keyPath?: string | string[];
    autoIncrement?: boolean;
    indexes?: IndexSchema[];
}
export interface McCacheDbConfig {
    dbName?: string;
    version?: number;
    stores?: StoreSchema[];
    log?: boolean;
}
export interface FontDataDb extends McFontInfo {
    content?: ShxFontData | McMeshFontData | null;
    updateTime?: number;
}
export interface ClipboardDataItem {
    type: string;
    blob: Blob;
}
export interface ClipboardDataDb {
    order: number;
    item: ClipboardDataItem;
}
