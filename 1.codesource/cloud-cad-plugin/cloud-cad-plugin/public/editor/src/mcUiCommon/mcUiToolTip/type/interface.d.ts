import { PlacementType, TriggerType } from './type';
export interface ToolTipContents {
    text?: string;
    imgUrl?: string;
    desc?: string;
    isDelay?: boolean;
}
export interface ToolTipProps {
    contents?: ToolTipContents[];
    cmdAsName?: string;
    title?: string;
    delay?: number;
    delayImage?: number;
    offset?: {
        x: number;
        y: number;
    };
    placement?: PlacementType;
    trigger?: TriggerType;
}
