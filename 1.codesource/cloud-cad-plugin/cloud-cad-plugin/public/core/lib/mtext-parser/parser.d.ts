export declare enum TokenType {
    NONE = 0,
    WORD = 1,
    STACK = 2,
    SPACE = 3,
    NBSP = 4,
    TABULATOR = 5,
    NEW_PARAGRAPH = 6,
    NEW_COLUMN = 7,
    WRAP_AT_DIMLINE = 8,
    PROPERTIES_CHANGED = 9
}
export interface FactorValue {
    value: number;
    isRelative: boolean;
}
export interface Properties {
    underline?: boolean;
    overline?: boolean;
    strikeThrough?: boolean;
    aci?: number | null;
    rgb?: RGB | null;
    align?: MTextLineAlignment;
    fontFace?: FontFace;
    capHeight?: FactorValue;
    widthFactor?: FactorValue;
    charTrackingFactor?: FactorValue;
    oblique?: number;
    paragraph?: Partial<ParagraphProperties>;
}
export interface ChangedProperties {
    command: string | undefined;
    changes: Properties;
    depth: number;
}
export type TokenData = {
    [TokenType.NONE]: null;
    [TokenType.WORD]: string;
    [TokenType.STACK]: [string, string, string];
    [TokenType.SPACE]: null;
    [TokenType.NBSP]: null;
    [TokenType.TABULATOR]: null;
    [TokenType.NEW_PARAGRAPH]: null;
    [TokenType.NEW_COLUMN]: null;
    [TokenType.WRAP_AT_DIMLINE]: null;
    [TokenType.PROPERTIES_CHANGED]: ChangedProperties;
};
export declare enum MTextLineAlignment {
    BOTTOM = 0,
    MIDDLE = 1,
    TOP = 2
}
export declare enum MTextParagraphAlignment {
    DEFAULT = 0,
    LEFT = 1,
    RIGHT = 2,
    CENTER = 3,
    JUSTIFIED = 4,
    DISTRIBUTED = 5
}
export declare enum MTextStroke {
    NONE = 0,
    UNDERLINE = 1,
    OVERLINE = 2,
    STRIKE_THROUGH = 4
}
export type RGB = [number, number, number];
export type FontStyle = 'Regular' | 'Italic';
export interface FontFace {
    family: string;
    style: FontStyle;
    weight: number;
}
export interface ParagraphProperties {
    indent: number;
    left: number;
    right: number;
    align: MTextParagraphAlignment;
    tabs: (number | string)[];
}
export declare function rgb2int(rgb: RGB): number;
export declare function int2rgb(value: number): RGB;
export declare function escapeDxfLineEndings(text: string): string;
export declare function hasInlineFormattingCodes(text: string): boolean;
export declare function getFonts(mtext: string, removeExtension?: boolean): Set<string>;
export interface MTextParserOptions {
    yieldPropertyCommands?: boolean;
    resetParagraphParameters?: boolean;
}
export declare class MTextParser {
    private scanner;
    private ctxStack;
    private continueStroke;
    private yieldPropertyCommands;
    private resetParagraphParameters;
    private inStackContext;
    constructor(content: string, ctx?: MTextContext, options?: MTextParserOptions);
    private decodeMultiByteChar;
    private pushCtx;
    private popCtx;
    private parseStacking;
    private parseProperties;
    private getPropertyChanges;
    private parseAlign;
    private parseHeight;
    private parseWidth;
    private parseCharTracking;
    private parseFloatValueOrFactor;
    private parseOblique;
    private parseAciColor;
    private parseRgbColor;
    private extractFloatExpression;
    private extractIntExpression;
    private extractExpression;
    private parseFontProperties;
    private parseParagraphProperties;
    private consumeOptionalTerminator;
    parse(): Generator<MTextToken>;
}
export declare class TextScanner {
    private text;
    private textLen;
    private _index;
    constructor(text: string);
    get currentIndex(): number;
    get isEmpty(): boolean;
    get hasData(): boolean;
    get(): string;
    consume(count?: number): void;
    peek(offset?: number): string;
    find(char: string, escape?: boolean): number;
    get tail(): string;
    isNextSpace(): boolean;
    consumeSpaces(): number;
}
export declare class MTextColor {
    private _aci;
    private _rgbValue;
    constructor(color?: number | RGB | null);
    get aci(): number | null;
    set aci(value: number | null);
    get rgb(): RGB | null;
    set rgb(value: RGB | null);
    get isRgb(): boolean;
    get isAci(): boolean;
    get rgbValue(): number | null;
    set rgbValue(val: number | null);
    copy(): MTextColor;
    toObject(): {
        aci: number | null;
        rgb: RGB | null;
        rgbValue: number | null;
    };
    equals(other: MTextColor): boolean;
}
export declare class MTextContext {
    private _stroke;
    continueStroke: boolean;
    color: MTextColor;
    align: MTextLineAlignment;
    fontFace: FontFace;
    private _capHeight;
    private _widthFactor;
    private _charTrackingFactor;
    oblique: number;
    paragraph: ParagraphProperties;
    get capHeight(): FactorValue;
    set capHeight(value: FactorValue);
    get widthFactor(): FactorValue;
    set widthFactor(value: FactorValue);
    get charTrackingFactor(): FactorValue;
    set charTrackingFactor(value: FactorValue);
    get aci(): number | null;
    set aci(value: number);
    get rgb(): RGB | null;
    set rgb(value: RGB | null);
    get italic(): boolean;
    set italic(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get underline(): boolean;
    set underline(value: boolean);
    get strikeThrough(): boolean;
    set strikeThrough(value: boolean);
    get overline(): boolean;
    set overline(value: boolean);
    get hasAnyStroke(): boolean;
    private _setStrokeState;
    copy(): MTextContext;
}
export declare class MTextToken {
    type: TokenType;
    ctx: MTextContext;
    data: TokenData[TokenType];
    constructor(type: TokenType, ctx: MTextContext, data: TokenData[TokenType]);
}
