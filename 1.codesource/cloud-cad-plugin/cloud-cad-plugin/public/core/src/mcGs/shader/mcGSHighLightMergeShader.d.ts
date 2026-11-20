declare const McGsHighLightMergeShader: {
    uniforms: {
        viewWidth: {
            type: string;
            value: number;
        };
        viewHeight: {
            type: string;
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export { McGsHighLightMergeShader };
