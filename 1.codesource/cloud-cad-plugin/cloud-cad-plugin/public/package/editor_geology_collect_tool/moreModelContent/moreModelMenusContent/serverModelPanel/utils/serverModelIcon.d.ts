/**
 * 服务器模型图标解析。
 *
 * 优先级：
 * 1. 模型 Type 字段（如 laneway / drill / stratum）；
 * 2. 模型名称关键字（用于 Type 为 custom 的细分模型）；
 * 3. BusinessType 业务类型（如 SW 水文类，覆盖“涌水量”等宽泛模型）；
 * 4. 兜底默认图标。
 */
/** 图标解析结果：字体图标（iconfont 类）或 SVG sprite 图标。 */
export interface ServerModelIconResult {
    kind: 'font' | 'sprite';
    /** kind=font 时为 iconfont 类名（如 iconfont iconxianxingtu）；kind=sprite 时为 SvgIcon name。 */
    value: string;
}
/** 图标面板条目：sprite 用 SvgIcon 渲染，font 用 iconfont 字体类渲染。 */
export interface ServerModelIconOption {
    key: string;
    type: 'sprite' | 'font';
}
/** 供“类型图标”选择面板使用的图标列表（与左侧树图标体系一致，去重后保留规则顺序）。 */
export declare const serverModelIconList: string[];
/**
 * 收集图标面板全部可选图标：
 * 1. SVG sprite：扫描页面中 editor 注入的 symbol（iconfont.js / xayl.js 的 mc-*、icon-*）；
 * 2. iconfont 字体类：解析 iconfont.css 中的 .iconxxx:before 规则，值为 `iconfont iconxxx`。
 */
export declare const collectServerModelIconOptions: () => ServerModelIconOption[];
/** 按名称关键字解析图标（供“当前图形模型”等本地分类复用）。 */
export declare const resolveServerModelNameIcon: (name: string) => string;
/**
 * 解析服务器模型图标：
 * 1. 接口 Icon 字段为 iconfont 字体类时直接返回（需加载 iconfont 字体）；
 * 2. 否则按 Type / 名称关键字 / BusinessType 解析为 SVG sprite 图标。
 */
export declare const resolveServerModelIcon: (model?: unknown) => ServerModelIconResult | null;
/** 默认兜底图标。 */
export declare const defaultServerModelIcon = "mc-shitu";
