import { McEngine } from '../../mcCore';
import { McDbHelix } from '../../mcDb';
import { McGeVector3 } from '../../mcGe/mcGeVector3';
import { McGsComplexCurveRender } from '..';
export declare class McGsHelixRender extends McGsComplexCurveRender {
    static getCurvePath(dbHelix: McDbHelix, engine?: McEngine | undefined, segments?: number): McGeVector3[];
    render(): boolean;
}
