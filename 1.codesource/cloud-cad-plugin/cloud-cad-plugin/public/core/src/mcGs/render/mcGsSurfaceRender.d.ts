import { McDbSurface } from '../../mcDb/entity/mcDbSurface';
import { McGeVector3, McGeVector4 } from '../../mcGe';
import { McGsComplexCurveRender } from './mcGsComplexCurveRender';
export declare class McGsSurfaceRender extends McGsComplexCurveRender {
    fade: boolean;
    private sourcePointList;
    private indices;
    private renderBoundary;
    private renderHoles;
    private renderIsoPoints;
    render(): boolean;
    pickPoint(point: McGeVector3, bReturnClosestPt?: boolean): McGeVector3[] | undefined;
    getSourcePointList(): McGeVector4[];
    getIndices(): number[];
    getBoundary(): number[];
    getHoles(): number[][];
    getIsoPoints(): McGeVector3[][];
    createIso(dbSurface: McDbSurface): McGeVector3[][] | undefined;
    private getIsoPts;
}
