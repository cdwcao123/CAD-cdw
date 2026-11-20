import { Component } from 'vue';
export interface PackageConfig {
    name: string;
    key: string;
    desc?: string;
    module?: Component;
}
export interface Options {
    action?: string;
    label: string;
    value: any;
    key?: string;
    options?: Options[];
}
export interface ColorConfig extends Options {
}
export interface LoadingConfigType {
    show: boolean;
    text: string;
    progress: number;
}
export interface PrintRange {
    minx: number;
    miny: number;
    minz: number;
    maxx: number;
    maxy: number;
    maxz: number;
}
