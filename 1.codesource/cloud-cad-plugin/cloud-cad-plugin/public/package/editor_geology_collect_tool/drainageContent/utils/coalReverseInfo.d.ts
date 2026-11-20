/**
 * 将地层反演说明中的厚度统一显示为两位小数，保留煤层名称和见止煤深度。
 * @param info 已生成的反演说明，允许包含当前会话中尚未格式化的厚度；无内容时传空字符串。
 * @returns 厚度保留两位小数的展示文本；未匹配说明和空文本保持原样。
 */
export declare function formatCoalReverseInfo(info: string): string;
