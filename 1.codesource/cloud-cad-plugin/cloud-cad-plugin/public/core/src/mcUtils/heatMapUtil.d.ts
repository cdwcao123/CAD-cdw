import { HeatmapConfig, HeatmapData } from '../mcDb/types/interface';
export declare class HeatMapCreator {
    create(config: HeatmapConfig, data: HeatmapData[]): string | undefined;
    dataURItoBlob(dataURI: string): Blob;
}
