import { McDbRasterImage } from 'McCore';
import { BasePropertyScript } from '../basePropertyScript';
export declare class RasterImagePropertyScript extends BasePropertyScript<McDbRasterImage> {
    constructor(name: string, entity: McDbRasterImage);
    initLineGroup(entity: McDbRasterImage): void;
}
