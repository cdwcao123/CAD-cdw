import { McRGB } from '../../mc';
import { McGePoint, McGeVector3 } from '../../mcGe';
import { McGsMeshRenderable, McGsRendererBase } from '..';
export declare class McGsWallRenderable extends McGsMeshRenderable {
    constructor(renderBase: McGsRendererBase, coords: McGePoint[][] | McGeVector3[][], height: number, alpha?: number, color?: McRGB);
}
