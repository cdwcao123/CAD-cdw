import { Component } from 'vue';
import { viewDisplayType } from '../../mcUiMain/types/enum';
import { DialogPosition, DialogScope, JustifyContent } from './type';
export interface DialogData {
    confirm?: () => boolean | Promise<boolean>;
    cancel?: () => void;
}
export interface DialogConfig {
    id: string;
    title: string;
    visible?: boolean;
    titleIcon?: {
        icon: string;
        label?: string;
        color?: string;
        title?: string;
        action: (data?: any) => void;
        class?: string;
    }[];
    content: string | ContentComponent;
    toBody?: boolean;
    scope?: DialogScope;
    width?: string;
    height?: string;
    bringTo?: boolean;
    showClose?: boolean;
    minimizable?: boolean;
    minimized?: boolean;
    minimizedRestorePosition?: DialogPosition;
    maximizable?: boolean;
    maximized?: boolean;
    showFooter?: boolean;
    showDefaultBtn?: boolean;
    position?: 'center' | 'top' | 'right' | 'bottom' | 'left' | {
        x: number;
        y: number;
    };
    customClass?: string;
    skinClass?: string;
    closeOnClickOutside?: boolean;
    showConfirm?: boolean;
    onConfirm?: (data?: any) => any;
    confirmText?: string;
    showCancel?: boolean;
    onCancel?: (data?: any) => any;
    cancelText?: string;
    beforeClose?: () => boolean | Promise<boolean>;
    onClose?: () => void;
    draggable?: boolean;
    showMask?: boolean;
    btns?: {
        label: string;
        action: (data?: any) => void;
        class?: string;
    }[];
    padding?: number;
    titleInnerPadding?: string;
    innerPadding?: string;
    escClose?: boolean;
    zIndex?: number;
    footerAlign?: 'left' | 'center' | 'right';
    footerContent?: JustifyContent;
    changeData?: (data?: any) => void;
    dialogType?: viewDisplayType;
    commonFn?: (data?: any) => void;
    isAsync?: boolean;
    resolveFunc?: (bool: boolean) => any;
    rejectFunc?: (data?: any) => any;
}
export interface ContentComponent {
    component: Component | string;
    props?: object;
}
export interface DialogInputConfig {
    label: string;
    placeholder?: string;
    type: 'text' | 'number' | 'password' | 'textarea';
    rules?: any[];
    min?: number;
    max?: number;
    step?: number;
}
