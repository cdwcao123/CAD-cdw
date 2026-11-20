import { McRGB } from '../../mc';
import { IMcGeVector4 } from '../../mcGe';
import { McGsMeshRenderable, McGsRendererBase } from '..';
export declare class McGsPrismRenderable extends McGsMeshRenderable {
    constructor(renderBase: McGsRendererBase, coords: IMcGeVector4[][], alpha?: number, color?: McRGB);
}
