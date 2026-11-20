import { McDbMTextContextStyleProperty } from 'McCore';
export type MultiTextStyleType = Omit<McDbMTextContextStyleProperty, 'propertyType'> & {
    propertyType: string;
};
export interface MtcpStyleDefinition {
    mtcpStyle: string;
    mtcpFont: string;
    mtcpHeight: number;
    mtcpRotation: number;
    mtcpColor: string;
    mtcpBackColor: string;
    mtcpBold: boolean;
    mtcpItalic: boolean;
    mtcpUnderLine: boolean;
    mtcpDeleteLine: boolean;
    mtcpOverLine: boolean;
    mtcpFraction: boolean;
    mtcpSuperscript: boolean;
    mtcpSubscript: boolean;
    mtcpLowercase: boolean;
    mtcpUppercase: boolean;
    mtcpClearWordStyle: boolean;
    mtcpRowSpacingType: number;
    mtcpRowSpacing: number;
    mtcpAttachment: number;
    mtcpFlowDirection: number;
    mtcpFormatPainter: boolean;
    mtcpClearTextFormat: boolean;
    mtcpClearParagraphFormat: boolean;
    mtcpTextField: boolean;
    mtcpSymbol: string;
    mtcpItalicAngle: number;
    mtcpLetterSpacing: number;
    mtcpWidthFactor: number;
    [key: string]: any;
}
export interface HatchGradientConfig {
    type: number;
    name: string;
    size: number;
    color1: number;
    color2: number;
    angle: number;
}
export interface DraggableProps {
    initX?: number;
    initY?: number;
    initWidth?: number;
    initHeight?: number;
    minWidth?: number;
    minHeight?: number;
    isDraggable?: boolean;
    isResizable?: boolean;
}
