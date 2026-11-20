import { McEngine } from '../../mcCore';
import { McGeVector2 } from '../../mcGe';
import { GsHAlignType, GsVAlignType } from '../../mcGs/types/enum';
export declare class McPrMessagePanel {
    fontSize: number;
    fontColor: string;
    focusFontColor: string;
    text: HTMLSpanElement;
    box: HTMLElement;
    isVisible: boolean;
    engine: McEngine;
    hAlignType: GsHAlignType;
    vAlignType: GsVAlignType;
    position: McGeVector2;
    constructor(engine: McEngine, msg: string);
    adjustInputWidth(): void;
    setMessage(msg: string): void;
    getMessage(): string;
    setFontSize(size: number): void;
    getFontSize(): number;
    getVisible(): boolean;
    updatePosition(x: number, y: number): void;
    getHAlignType(): GsHAlignType;
    setHAlignType(hAlignType: GsHAlignType): void;
    getVAlignType(): GsVAlignType;
    setVAlignType(vAlignType: GsVAlignType): void;
    show(): this | undefined;
    hide(): this | undefined;
}
