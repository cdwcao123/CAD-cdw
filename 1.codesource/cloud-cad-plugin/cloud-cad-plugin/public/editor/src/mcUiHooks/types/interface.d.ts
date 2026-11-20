import { TranslateParams } from 'McCore';
export interface UseI18nResult {
    t: (key: string, params?: TranslateParams) => string;
    setLanguage: (language: string) => Promise<void>;
    getLanguage: () => string;
    reload: () => Promise<void>;
}
