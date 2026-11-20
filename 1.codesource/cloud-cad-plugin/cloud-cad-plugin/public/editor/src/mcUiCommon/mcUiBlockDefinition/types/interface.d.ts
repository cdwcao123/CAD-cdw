export interface FormState {
    blockName: string;
    unit: string;
    base: {
        onScreen: boolean;
        pick: boolean;
        x: string;
        y: string;
        z: string;
    };
    object: {
        onScreen: boolean;
        select: boolean;
        selectedCount: number;
        mode: string;
    };
    method: {
        annotative: boolean;
        uniform: boolean;
        allowExplode: boolean;
    };
    desc: string;
}
