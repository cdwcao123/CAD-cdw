import { McCore } from '../../../mcCore/mcCore';
export declare function saveAsMctf(core: McCore, isDownload?: boolean): Promise<Blob | undefined>;
export declare function saveAsMcd(core: McCore, isDownload?: boolean): Promise<Blob | undefined>;
export declare function importImage(core: McCore, file: File): Promise<void>;
export declare function importImageWithDef(core: McCore, imageDefName: string): Promise<void>;
