/**
 * 钻孔导入支持的属性字段。
 *
 * 字段名称同时是 Excel 解析后记录的键，必须与 `createImportedDrillRecord` 读取的名称保持一致。
 */
export declare const drillHoleFileFormatFields: readonly ["钻孔代码", "钻孔名称", "矿井编码", "孔口X", "孔口Y", "孔口Z", "见煤点标高", "煤厚", "孔半径", "终孔深度", "位置", "描述", "开工日期", "竣工日期", "负责人", "钻孔类型", "第一勘探线", "第二勘探线", "地层倾角", "终孔层位", "测井深度", "测井日期", "最终斜度", "是否矿内孔", "是否斜孔", "施工目的", "施工单位", "钻机名称", "技术员", "记录员", "水文员", "测井员", "测井解释员", "底板校正X", "底板校正Y", "底板校正Z", "穿过地层", "穿过煤层", "关联文件"];
/**
 * 按显示字段顺序把 Excel 单元格值映射为钻孔属性记录。
 * @param displayFields 已配置的显示字段，顺序对应 Excel 从左到右的列。
 * @param values 当前 Excel 行从左到右的单元格文本。
 * @returns 以属性字段名称为键的行记录；没有配置的多余单元格会被忽略。
 */
export declare function buildDrillHoleFileFormatRow(displayFields: readonly string[], values: readonly string[]): Record<string, string>;
/**
 * 移动单个显示字段并返回新的排序，不修改传入数组。
 * @param fields 当前显示字段顺序。
 * @param field 待移动的字段名称。
 * @param offset -1 表示上移，1 表示下移。
 * @returns 移动后的字段顺序；字段不存在或已到边界时返回内容相同的新数组。
 */
export declare function moveDrillHoleDisplayField(fields: readonly string[], field: string, offset: -1 | 1): string[];
