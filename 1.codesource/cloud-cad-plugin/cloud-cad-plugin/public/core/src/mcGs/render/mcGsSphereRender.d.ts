import { McGsComplexCurveRender } from './mcGsComplexCurveRender';
export declare class McGsSphereRender extends McGsComplexCurveRender {
    private outlineRenderables;
    private cameraChangedHandler;
    private radiusEditing;
    private radiusEditingMeshRenderables;
    highLight(): void;
    hover(isMerge?: boolean): void;
    render(): boolean;
    private renderWireframe;
    private renderMesh;
    private getLocalViewDirection;
    private getWorldTransform;
    private toWorldCoords;
    private listenCameraChanged;
    setRadiusEditing(editing: boolean): void;
    private renderOutline;
    dispose(): void;
}
