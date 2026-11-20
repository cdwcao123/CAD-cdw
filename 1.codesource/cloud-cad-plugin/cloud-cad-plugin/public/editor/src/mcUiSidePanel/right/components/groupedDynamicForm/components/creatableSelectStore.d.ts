import { CreatableSelectOption } from '../../../../types/interface';
export declare const sameCreatableSelectOptionValue: (left: any, right: any) => boolean;
export declare const mergeCreatableSelectOptions: (base: CreatableSelectOption[], extras: CreatableSelectOption[]) => CreatableSelectOption[];
export declare const getCreatableSelectOptions: (cacheKey: string) => CreatableSelectOption[];
export declare const appendCreatableSelectOptions: (cacheKey: string, extras: CreatableSelectOption[]) => void;
