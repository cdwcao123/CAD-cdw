/**
 * 模型样式符号类型
 */
declare enum GeoModelStyleType {
    None = 0,
    Point = 1,
    Line = 2,
    Polygon = 3,
    Raster = 4,
    Text = 5
}
/**
 * 几何类型
 * @description 用于描述要素的几何类型
 * @enum {string}
 */
declare enum McGeoGeometryType {
    None = "None",
    Point = "Point",
    MultiPoint = "MultiPoint",
    Line = "Line",
    MultiLine = "MultiLine",
    Polygon = "Polygon",
    MultiPolygon = "MultiPolygon",
    Tin = "Tin"
}
/**
 * 线型
 */
declare enum StrokeType {
    POLYLINE = 0,
    LINE = 1,
    CURVE = 2,
    WALL = 3,
    PIPELINE = 4
}
/**
 * 线型属性
 * @description 用于描述线型的属性，包括名称、值和文本描述
 * @type {Record<string, { name: string, value: number, text: string}>}
 */
declare const StrokeTypeProperties: Record<string, {
    name: string;
    value: number;
    text: string;
}>;
/**
 * 形状
 */
declare enum WellKnownName {
    CIRCLE = 0,
    SQUARE = 1,
    TRIANGLE = 2,
    STAR = 3,
    CROSS = 4,
    X = 5,
    SPHERE = 6,
    CUBE = 7,
    TETRAHEDRON = 8,
    OCTAHEDRON = 9,
    CYLINDER = 10,
    PIPELINE = 11,
    PATCH = 12
}
/**
 * 形状属性
 * @description 用于描述形状的属性，包括名称、值和文本描述
 * @type {Record<string, { name: string, value: number, text: string}>}
 */
declare const wellKnownNameProperties: Record<string, {
    name: string;
    value: number;
    text: string;
}>;
/**
 * 坐标类型
 */
declare enum PrismBuildType {
    /** 顶板标高及统一厚度 */
    TOPANDSAMELENGTH = 0,
    /** 顶板标高及厚度 */
    TOPANDLENGTH = 1,
    /** 底板标高及统一厚度 */
    BOTTOMANDSAMELENGTH = 2,
    /** 底板标高及厚度 */
    BOTTOMANDLENGTH = 3,
    /** 顶、底板标高 */
    TOPANDBOTTOM = 4
}
/**
 * 要素类型
 * @description 用于描述要素的类型，包括几何要素和非几何要素
 * @enum {string}
 */
declare enum FeatureType {
    None = "\u672A\u77E5\u8981\u7D20",
    Geometric = "\u51E0\u4F55\u8981\u7D20",
    NonGeometric = "\u975E\u51E0\u4F55\u8981\u7D20"
}
/**
 * 地质视图类型
 * @description 用于描述地质视图的类型，包括CAD、2D和3D视图，类型可相互组合使用逗号(,)分隔
 * @enum {string}
 */
declare enum McGeoViewType {
    ViewCAD = "CAD",
    View2D = "2D",
    View3D = "3D"
}
/**
 * 地质模型绘制样式面板事件
 */
declare enum McDbGeoModelDrawStylePropertyEvent {
    /** 打开面板 */
    GeoModelOpenPanel = 0,
    /** 关闭面板 */
    GeoModelClosePanel = 1,
    /** 重启地质模型绘制 */
    GeoModelDrawRestart = 2
}
export { GeoModelStyleType, StrokeType, StrokeTypeProperties, PrismBuildType, FeatureType, McGeoGeometryType, McGeoViewType, WellKnownName, wellKnownNameProperties, McDbGeoModelDrawStylePropertyEvent, };
