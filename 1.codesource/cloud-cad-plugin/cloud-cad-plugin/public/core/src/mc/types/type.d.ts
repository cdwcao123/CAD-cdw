import { McSystemVal } from '../mcSystemVar';
import { EntityRegInfo, KeyBindingChangeEvent, KeyBindingWithCore, KeyBindingWithoutCore, TaskProgressArgs, WorkerErrorResponse, WorkerSuccessResponse } from './interface';
type WhateverFunc = (...args: any[]) => any;
type RuntimeClassRegInfo = EntityRegInfo;
type McSysValEventType = {
    sysValChanged: (name: (keyof McSystemVal) | string, oldValue: any, newValue: any) => void;
    sysValWillChanger: (name: (keyof McSystemVal) | string, oldValue: any) => void;
    sysValDeleted: (name: (keyof McSystemVal) | string) => void;
};
type PrimitiveType = string | number | boolean | symbol | null | undefined | bigint;
type PrimitiveTypeWithoutUndefined = string | number | boolean | symbol | null | bigint;
type JSONValue = PrimitiveType | {
    [key: string]: JSONValue;
} | JSONValue[];
type JSONValueWithoutUndefined = PrimitiveTypeWithoutUndefined | {
    [key: string]: JSONValueWithoutUndefined;
} | JSONValueWithoutUndefined[];
type JSONMap = Map<string, PrimitiveType | {
    [key: string]: JSONValue;
} | JSONValue[]>;
type TaskProgressEvent = {
    taskProgress: (info: Partial<TaskProgressArgs>) => void;
};
export type WorkerInput = string | ArrayBuffer;
export type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;
type KeyBinding = KeyBindingWithCore | KeyBindingWithoutCore;
type KeyBindingManagerListener = {
    keyBindingChanged: (event: KeyBindingChangeEvent) => void;
};
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type NotificationAction = 'confirm' | 'reject' | 'cancel';
type PluginPackageKind = 'module' | 'style';
type PluginLoadProgressStage = 'idle' | 'manifest' | 'validate' | 'loading' | 'installing' | 'init' | 'done' | 'error';
type PluginLoadErrorStage = 'fetch' | 'parse' | 'order' | 'resource' | 'import' | 'install' | 'init';
type PluginVueComponentLoader = () => Promise<unknown>;
type StartupView = {
    type: 'editor';
} | {
    type: 'custom-page';
    componentKey: string;
    pageKey: string;
};
type LayerIsolationState = {
    isOff: boolean;
    isFrozen: boolean;
};
type DrawingConvertResponse = Blob | ArrayBuffer | string | Record<string, any> | null | undefined;
export type LanguageMessages = Record<string, string>;
export type LanguageChangeListener = (language: string) => void;
export type TranslateParams = Record<string, string | number>;
export type { TaskProgressEvent, WhateverFunc, McSysValEventType, JSONMap, JSONValue, PrimitiveType, PrimitiveTypeWithoutUndefined, JSONValueWithoutUndefined, KeyBinding, KeyBindingManagerListener, NotificationType, NotificationAction, PluginPackageKind, PluginLoadProgressStage, PluginLoadErrorStage, PluginVueComponentLoader, StartupView, LayerIsolationState, RuntimeClassRegInfo, DrawingConvertResponse, };
