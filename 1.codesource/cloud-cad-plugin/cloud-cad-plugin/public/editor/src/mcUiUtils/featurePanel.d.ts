export declare const updateTypeOptions: (typeCountMap: Map<string, number>, firstEntityType: string | null, showNumber?: boolean) => {
    entityTypeOptions: {
        label: string;
        value: string;
    }[];
    selectedEntityType: string;
};
export declare const getMaterialType: () => {
    value: string;
    label: string;
}[];
