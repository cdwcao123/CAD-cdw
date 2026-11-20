export interface FormState {
    insertPoint: boolean;
    scale: {
        enable: boolean;
        type: string;
        x: number;
        y: number;
        z: number;
    };
    rotate: {
        enable: boolean;
        angle: number;
    };
    repeat: boolean;
    explode: boolean;
}
