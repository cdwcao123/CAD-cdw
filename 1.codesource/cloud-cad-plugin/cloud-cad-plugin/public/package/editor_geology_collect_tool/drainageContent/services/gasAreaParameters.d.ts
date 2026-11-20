import { McExposureTime } from '../types/enum';
import type { EvaluationUnitCoreApi } from '../types/type';
import type { McCoalType, McWorkFaceType } from '@/core_geology_collect_tool/mcDrainageBorehole/types/enum';
import type { McGasAreaParameter } from '@/core_geology_collect_tool/mcDrainageBorehole/types/interface';
export declare const gasAreaExposureOptions: readonly [{
    readonly value: McExposureTime.Days25;
    readonly label: "25";
    readonly days: 25;
}, {
    readonly value: McExposureTime.Days50;
    readonly label: "50";
    readonly days: 50;
}, {
    readonly value: McExposureTime.Days100;
    readonly label: "100";
    readonly days: 100;
}, {
    readonly value: McExposureTime.Days160;
    readonly label: "160";
    readonly days: 160;
}, {
    readonly value: McExposureTime.Days200;
    readonly label: "200";
    readonly days: 200;
}, {
    readonly value: McExposureTime.Days250;
    readonly label: "250";
    readonly days: 250;
}, {
    readonly value: McExposureTime.Days300;
    readonly label: "≥300";
    readonly days: 300;
}, {
    readonly value: McExposureTime.Unexposed;
    readonly label: "无暴露";
    readonly days: 0;
}];
export declare function getGasAreaEquivalentWidth(coalType: McCoalType, exposure: McExposureTime, api: EvaluationUnitCoreApi): number;
/**
 * 创建 Editor 评价单元初始参数，暴露时间按 Core 契约使用天数。
 * @param api 已加载的 Core 插件枚举与评价单元能力。
 * @param workFaceType 工作面类型；省略时使用回采模式。
 * @returns 独立的参数对象，工作面日产量保存字典 Key 的字符串形式，默认选中第一档。
 */
export declare function createGasAreaParameters(api: EvaluationUnitCoreApi, workFaceType?: McWorkFaceType): McGasAreaParameter;
