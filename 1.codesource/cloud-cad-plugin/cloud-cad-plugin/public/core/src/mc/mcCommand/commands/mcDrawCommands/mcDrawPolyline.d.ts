import { McCore } from '../../../../mcCore/mcCore';
import { McDbPolyLine } from '../../../../mcDb';
import { McGeVector3 } from '../../../../mcGe';
export declare function drawPolyline(core: McCore): Promise<McDbPolyLine | null>;
export declare function calculateArcByTangentStartEnd(prevCandidates: McGeVector3[], startPoint: McGeVector3, point: McGeVector3, isMajorArc: boolean): any;
export declare function fixAngleContinuity(startAngle: number, endAngle: number, ccw?: boolean): number;
export declare function tangentFromArcEnd(prevArc: any, length?: number): {
    x: any;
    y: any;
}[];
export declare function arcToBulgeFromGeometry(arc: any): number;
