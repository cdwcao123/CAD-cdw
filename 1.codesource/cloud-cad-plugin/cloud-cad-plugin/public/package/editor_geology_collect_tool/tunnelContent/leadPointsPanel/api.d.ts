export declare const requestJson: (url: string, init?: RequestInit) => Promise<any>;
export declare const xaylApi: {
    getDicts: (code: string) => Promise<{
        data: any[];
    }>;
};
export declare const coreGeologyCollectTool: {
    tunnelTopoDealOne: (tunnel: any, sourceTunnel: any, dealType: number) => Promise<any>;
};
