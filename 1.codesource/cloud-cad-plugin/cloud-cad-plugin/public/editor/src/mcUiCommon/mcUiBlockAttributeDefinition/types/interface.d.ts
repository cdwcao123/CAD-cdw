export interface FormState {
    blockName: string;
    position: {
        onScreen: boolean;
        x: number;
        y: number;
        z: number;
    };
    isInvisible: boolean;
    isConstant: boolean;
    isVerifiable: boolean;
    isPreset: boolean;
    isLockPositionInBlock: boolean;
    isMTextAttribute: boolean;
    mText: {
        style: string;
        textHeight: number;
        rotation: number;
        attachment: any;
    };
    prompt: string;
    defaultValue: string;
    tag: string;
    width: number;
}
