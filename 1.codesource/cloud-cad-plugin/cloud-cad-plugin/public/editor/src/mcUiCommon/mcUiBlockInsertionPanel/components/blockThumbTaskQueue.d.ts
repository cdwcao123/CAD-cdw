type BlockThumbItem = {
    id: any;
    type: 'McDbBlock';
    data: string;
};
export declare function getBlockThumbMapByQueue(core: any, items: BlockThumbItem[]): Promise<Map<any, string>>;
export declare function getSingleBlockThumbByQueue(core: any, item: BlockThumbItem): Promise<string>;
export {};
