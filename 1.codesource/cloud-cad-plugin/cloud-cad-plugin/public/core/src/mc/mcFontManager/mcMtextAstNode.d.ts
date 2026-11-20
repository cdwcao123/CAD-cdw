import { McDbMTextContextStyleProperty } from '../../mcDb';
import { FactorValue, FontStyle, MTextContext, MTextLineAlignment, MTextParserOptions, ParagraphProperties, RGB, TokenType } from '../../../lib/mtext-parser/parser';
export interface EditorSelection {
    start: number;
    end: number;
}
export interface McMTextLineIndex {
    index: number;
    start: number;
    end: number;
    enter: boolean;
}
export interface FontFace {
    family: string;
    style: FontStyle;
    weight: number;
}
export interface McMTextStyle {
    underline?: boolean;
    overline?: boolean;
    strikeThrough?: boolean;
    fraction?: boolean;
    superscript?: boolean;
    subscript?: boolean;
    aci?: number | null;
    rgb?: RGB | null;
    align?: MTextLineAlignment;
    fontFace?: FontFace;
    capHeight?: FactorValue;
    widthFactor?: FactorValue;
    charTrackingFactor?: FactorValue;
    oblique?: number;
    paragraph?: ParagraphProperties;
}
export declare function hasNodeStyle(node: McMTextAstNode): node is McMTextAstCharNode | McMTextAstStackNode | McMTextAstParagraphBreakNode | McMTextAstColumnBreakNode | McMTextAstWrapAtDimLineNode;
export declare function contextToStyle(ctx: MTextContext): McMTextStyle;
export declare class McMTextAstNode {
    type: TokenType;
    style: McMTextStyle;
    constructor(type?: TokenType, style?: McMTextStyle);
}
export declare class McMTextAstCharNode extends McMTextAstNode {
    value: string;
    constructor(type?: TokenType, value?: string, style?: McMTextStyle);
}
export declare class McMTextAstStackNode extends McMTextAstNode {
    numerator: string;
    denominator: string;
    divider: string;
    constructor(type?: TokenType, numerator?: string, denominator?: string, divider?: string, style?: McMTextStyle);
}
export declare class McMTextAstParagraphBreakNode extends McMTextAstNode {
    constructor(type?: TokenType, style?: McMTextStyle);
}
export declare class McMTextAstColumnBreakNode extends McMTextAstNode {
    constructor(type?: TokenType, style?: McMTextStyle);
}
export declare class McMTextAstWrapAtDimLineNode extends McMTextAstNode {
    constructor(type?: TokenType, style?: McMTextStyle);
}
export declare function parseMTextToAst(content: string, ctx?: MTextContext, options?: Omit<MTextParserOptions, 'yieldPropertyCommands'>): McMTextAstNode[];
export declare function cloneStyle(style: McMTextStyle): McMTextStyle;
export declare function serializeStyleDelta(prev: McMTextStyle | null, next: McMTextStyle): string;
export declare function buildMTextFromAst(nodes: McMTextAstNode[]): string;
export declare function inferInsertStyle(nodes: McMTextAstNode[], index: number): McMTextStyle | undefined;
export declare function replaceRangeInAst(nodes: McMTextAstNode[], start: number, count: number, text: string, style?: McMTextStyle): number;
export declare function deleteRangeInAst(nodes: McMTextAstNode[], start: number, count: number): McMTextAstNode[];
export declare function convertToContextStyle(style: McMTextStyle): McDbMTextContextStyleProperty[];
export declare function getNodeShowText(node: McMTextAstNode): string;
export declare function parseStackParts(plainText: string): {
    numerator: string;
    denominator: string;
    divider: '/' | '#' | '^';
} | null;
