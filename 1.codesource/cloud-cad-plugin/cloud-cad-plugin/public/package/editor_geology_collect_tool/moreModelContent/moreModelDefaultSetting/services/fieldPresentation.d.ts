import { MoreModelProp } from '../types/type';
/**
 * 判断属性是否为几何类字段
 * @description 几何字段按控件类型（geometry/coord/coordinate）或
 * key/name/label 关键词（几何/坐标/起点/终点/半径/角度等）识别。
 * @param prop 属性对象
 * @returns 是否为几何字段
 */
export declare const isGeometryProp: (prop: MoreModelProp | null | undefined) => boolean;
/**
 * 获取属性可见标签
 * @param prop 属性对象
 * @param dynamicLabel 动态标签兜底（取不到 name/label 时使用）
 * @returns 可见标签；几何字段无标签时返回"坐标"，否则返回空字符串
 */
export declare const getVisiblePropLabel: (prop: MoreModelProp | null | undefined, dynamicLabel?: unknown) => string;
/**
 * 解析属性在顶部菜单中应使用的控件类型
 * @param prop 属性对象
 * @param forceTextInput 是否强制按文本输入框处理（几何字段默认强制）
 * @returns 控件类型字符串（如 input/number/select/textarea/color/linetype/lineweight 等）
 */
export declare const resolveTopMenuFieldType: (prop: MoreModelProp | null | undefined, forceTextInput?: boolean) => string;
