import { LanguageChangeListener, TranslateParams } from './types/type';
export declare class McI18 {
    private static instance;
    private language;
    private messages;
    private readonly cache;
    private readonly listeners;
    private basePath;
    private revision;
    private constructor();
    static getInstance(): McI18;
    init(language?: string): Promise<void>;
    private getStoredLanguage;
    setBasePath(path: string): void;
    getBasePath(): string;
    getLanguage(): string;
    private isChinese;
    t(key: string, params?: TranslateParams): string;
    setLanguage(language: string): Promise<void>;
    reload(): Promise<void>;
    clearCache(language?: string): void;
    subscribe(listener: LanguageChangeListener): () => void;
    private loadLanguage;
    private notify;
}
export declare const i18n: McI18;
export default i18n;
