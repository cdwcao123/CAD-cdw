/**
 * 将 Core 的开孔位置说明拆成保存接口实际接收的测点、方向和距离字段。
 * @param value “测点名称前/后距离米”格式的开孔位置；空字符串或“未定义”表示未记录。
 * @returns 保存字段，RefPointName 保留完整说明及原始小数格式；OpeningPosition 为只读展示字段。
 * @throws 非空位置说明不符合 Core 绘孔输出格式时抛出错误，避免只保存部分信息。
 */
export declare function createServerOpeningFields(value: string): Record<string, unknown>;
