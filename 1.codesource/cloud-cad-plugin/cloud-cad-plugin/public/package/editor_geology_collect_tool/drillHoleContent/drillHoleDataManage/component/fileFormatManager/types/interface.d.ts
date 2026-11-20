/** 钻孔数据文件格式配置。 */
export interface DrillHoleFileFormatConfig {
    /** 格式名称，在格式管理器内唯一。 */
    name: string;
    /** 数据首行的 Excel 行号，表头不属于数据行。 */
    dataStartRow: number;
    /** 参与导入和预览的属性字段，数组顺序对应 Excel 从左到右的列顺序。 */
    displayFields: string[];
    /** @deprecated 旧版文本格式分隔符，仅供读取历史内存配置；新弹框不再写入。 */
    delimiter?: 'tab' | 'semicolon' | 'comma' | 'space' | 'other';
    /** @deprecated 旧版自定义分隔符，新弹框不再写入。 */
    otherDelimiter?: string;
    /** @deprecated 旧版连续分隔符规则，新弹框不再写入。 */
    treatContinuousDelimiterAsOne?: boolean;
    /** @deprecated 旧版空格清理规则，新弹框不再写入。 */
    trimSides?: boolean;
    /** @deprecated 旧版字段位置映射，新弹框使用有序 `displayFields`。 */
    mappings?: Array<{
        /** 属性字段名称。 */
        target: string;
        /** 旧版文件字段位置，如“字段1”。 */
        field: string;
    }>;
}
/** 文件格式穿梭框中的一个属性字段。 */
export interface DrillHoleFileFormatFieldOption {
    /** 写入配置和解析结果的字段键。 */
    key: string;
    /** 穿梭框及预览表头显示的字段名称。 */
    label: string;
    /** 未选择示例文件时用于模板内容表格的数据行示例。 */
    sampleValue?: string;
}
/** 文件格式详情弹框保存的数据。 */
export interface DrillHoleFileFormatSaveData {
    /** 数据首行的 Excel 行号。 */
    dataStartRow: number;
    /** 从左到右排列的字段键。 */
    displayFields: string[];
}
/** 文件格式管理器中的列表行。 */
export interface FileFormatRow {
    /** 格式名称。 */
    name: string;
    /** 是否为当前导入格式。 */
    isCurrent?: boolean;
    /** 格式的完整配置；尚未配置详情时为空。 */
    config?: DrillHoleFileFormatConfig;
}
