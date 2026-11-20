import { McGsComplexCurveRender } from './mcGsComplexCurveRender';
export declare class McGsOctahedronRender extends McGsComplexCurveRender {
    private edgeLengthEditing;
    private edgeLengthEditingMeshRenderables;
    highLight(): void;
    hover(isMerge?: boolean): void;
    render(): boolean;
    private renderMesh;
    setEdgeLengthEditing(editing: boolean): void;
    dispose(): void;
}
