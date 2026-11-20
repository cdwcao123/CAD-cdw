
export class Source {
    
    constructor(data: any);

    
    data: any;

    
    set needsUpdate(value: boolean);

    
    uuid: string;

    
    version: number;

    
    toJSON(meta: any): any;

    readonly isTexture: true;
}
