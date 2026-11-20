import { AnyRecord, PanelDefinition, RibbonMenuContextOptions } from '../types/type';
export declare const buildMoreModelRibbonMenuContext: ({ entity, modelId, modelName, closePanel, refreshLayout, }: RibbonMenuContextOptions) => Promise<{
    entity: AnyRecord | null;
    modelId: string;
    modelName: string;
    module: Record<string, unknown>;
} | {
    entity: AnyRecord | null;
    modelId: string;
    modelName: string;
    module: {
        key: string;
        label: string;
        icon: string;
        children: PanelDefinition[];
    };
}>;
