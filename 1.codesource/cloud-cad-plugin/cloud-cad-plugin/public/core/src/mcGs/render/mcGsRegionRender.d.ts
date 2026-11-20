import { ILoopEdge } from '../../mcDb';
import { McGeVector3 } from '../../mcGe';
import { McGsComplexCurveRender } from '..';
export declare class McGsRegionRender extends McGsComplexCurveRender {
    render(): boolean;
    protected calculateCoords(edge: ILoopEdge, isClosed: boolean): McGeVector3[];
}
