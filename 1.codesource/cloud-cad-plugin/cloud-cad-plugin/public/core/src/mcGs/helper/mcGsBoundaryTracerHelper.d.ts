import { McDbEntity, IHatchLoop } from '../../mcDb';
import { McGeVector2 } from '../../mcGe';
import * as THREE from '../../../lib/ThreeJS/Three.js';
export declare class BoundaryTracerHelper extends THREE.Object3D {
    private static readonly TOLERANCE;
    static createHatchLoopsFromEntities(entities: McDbEntity[]): IHatchLoop[];
    static createSmallestHatchLoopFromEntitiesIncludePoint(entities: McDbEntity[], pt: McGeVector2): IHatchLoop[] | null;
    static getAllCloseLoopsOnlyStartOrEndConnected(entities: McDbEntity[]): {
        loop: IHatchLoop;
        area: number;
    }[];
    static filterRegionLoops(loops: {
        loop: IHatchLoop;
        area: number;
    }[]): {
        loop: IHatchLoop;
        area: number;
    }[];
    private static findInnerLoops;
    private static loopIsIncludeOtherLoop;
    private static groupByConnectedSegments;
    protected static calculatePolygonArea(polygon: McGeVector2[], bulges: number[]): number;
    private static isPointInHatchLoops;
    private static segmentEntitiesAtIntersections;
    private static findAllIntersections;
    private static splitEntityAtPoints;
    private static removeDuplicatePoints;
    private static sortPointsAlongEntity;
    private static findAllClosedBoundaries;
    private static findAllClosedBoundariesOneEntity;
    private static updateLoopWithConnectEntity;
    private static isDuplicateLoop;
    private static checkPointSequenceMatch;
    private static convertMcDbEntityToLoopEdge;
    private static convertMcGeEntityToLoopEdge;
    private static convertEllipseToEdge;
    private static convertSplineToEdge;
    private static convertPolyLineToEdge;
    private static convertMcGePolyLine2dToEdge;
    private static convertLineToEdge;
    private static convertMcGeSeg2dToEdge;
    private static convertArcToEdge;
    private static convertMcGeArcToEdge;
    private static convertCircleToEdge;
    private static convertMcGeCircleToEdge;
    private static isLoopClosed;
    private static getEdgeStartPoint;
    private static getEdgeEndPoint;
    private static convertEdgesToPointsAndBulges;
    private static calculateEdgeBulge;
    private static calculateArcBulge;
    private static calculateArcPoint;
    private static calculateEllipticArcPoint;
    private static isPointOnCircle;
    private static findConnectedEntity;
    private static pointsEqual;
    private static removeUsedEntities;
}
