import { McCore } from '../mcCore';
import { CoreConvertFileType, CoreExportFileType } from './types/enum';
import { ExportDrawingPdfOptions, ExportDrawingSvgOptions, ExportPrintedImageOptions } from './types/interface';
export declare class McFileService {
    exportDrawingFileToOtherBlob(file: File, outformat: CoreExportFileType, wh: {
        w: number;
        h: number;
    }): Promise<Blob>;
    convertDrawingFileToOtherDrawingBlob(file: File | Blob, fileType: CoreConvertFileType, bcompress?: boolean): Promise<Blob>;
    openLocalDrawingToMcdBuffer(file?: File): Promise<ArrayBuffer | undefined | string>;
    openCloudDrawingToMcdBuffer(data: string): Promise<ArrayBuffer | undefined | string>;
    loadLocalDrawingIntoCore(core?: McCore): Promise<"不支持的文件类型" | undefined>;
    loadCloudDrawingIntoCore(url: string, core?: McCore): Promise<string | undefined>;
    saveAsDrawingFileAction(core: McCore, fileType: CoreConvertFileType): Promise<void>;
    convertOtherDrawingToMcdBuffer(file: File, inFileType: CoreConvertFileType): Promise<ArrayBuffer | undefined>;
    exportDrawingAction(core: McCore, fileType: CoreExportFileType, options: ExportDrawingSvgOptions, fileName: string): Promise<void>;
    exportDrawingPdfByServerAction(core: McCore, options: ExportDrawingPdfOptions, fileName: string): Promise<void>;
    exportPrintedImageAction(core: McCore, fileType: CoreExportFileType, options: ExportPrintedImageOptions): Promise<void>;
}
export declare const mcFileService: McFileService;
