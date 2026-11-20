import { McCore } from '../../mcCore';
export type SearchItem = {
    label: string;
    value: any;
};
export interface SearchOptions {
    container: HTMLElement | string;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    placeholder?: string;
}
export declare class McSearchCommandPanel {
    private container;
    private data;
    private width;
    private height;
    private left;
    private top;
    private placeholder;
    private wrapper;
    private input;
    private dropdown;
    private resultsList;
    private currentResults;
    private currentFocusIndex;
    private isOpen;
    private outsideClickHandler;
    private core;
    constructor(core: McCore, options: SearchOptions, keyWord?: string);
    private render;
    private filterData;
    computeMatchScore(query: string, target: string): number;
    levenshteinDistance(a: string, b: string): number;
    private renderDropdown;
    private clearHighlight;
    private addHighlightToItem;
    private highlightCurrentItem;
    private scrollToHighlight;
    private selectItem;
    private closeDropdown;
    private handleKeydown;
    private handleInput;
    private handleOutsideClick;
    private attachEvents;
    destroy(): void;
}
