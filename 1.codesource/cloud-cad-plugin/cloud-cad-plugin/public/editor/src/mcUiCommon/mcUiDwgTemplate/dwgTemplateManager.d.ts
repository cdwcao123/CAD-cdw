import { TemplateInfo } from './types/interface';
export declare class McUiDwgTemplateManager {
    templateList: TemplateInfo[];
    currentTemplate: TemplateInfo;
    constructor();
    getTemplate(): void;
    deleteTemplate(id: string): void;
    setCurrentTemplate(data: TemplateInfo): void;
    upload(): void;
    download(): void;
    preview(): void;
    modify(): void;
    delete(): void;
}
export declare const dwgTemplateManager: McUiDwgTemplateManager;
