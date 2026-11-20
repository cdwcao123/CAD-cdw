import { McGsComplexCurveRender } from './mcGsComplexCurveRender';
export declare class McGsPyramidRender extends McGsComplexCurveRender {
    private shapeEditing;
    private shapeEditingMeshRenderables;
    highLight(): void;
    hover(isMerge?: boolean): void;
    render(): boolean;
    private renderMesh;
    setShapeEditing(editing: boolean): void;
    dispose(): void;
}
