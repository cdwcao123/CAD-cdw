export declare class McUiDwgTemplateManager {
    templateList: any[];
    currentTemplate: any;
    constructor();
    getTemplate(): void;
    setCurrentTemplate(data: any): void;
    upload(): void;
    download(): void;
    preview(): void;
    modify(): void;
    delete(): void;
}
export declare const dwgTemplateManager: McUiDwgTemplateManager;
