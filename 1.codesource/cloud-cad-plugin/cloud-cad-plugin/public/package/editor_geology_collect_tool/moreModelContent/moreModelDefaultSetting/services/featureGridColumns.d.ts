import { LayoutColumn, LayoutPair, LayoutRows, PopupColumn, PopupColumnMovePayload, BuildTopMenuLayoutOptions, BuildPopupLayoutOptions, BuildRibbonPanelLayoutOptions } from '../types/type';
/**
 * Ribbon 面板布局构建
 * @description 将字段/样式"对（label + control）"排列为顶部菜单布局：
 * - buildTopMenuLayout：首屏完整展示（属性按 1~3 列自适应，样式单列）；
 * - buildPopupLayout：鼠标悬浮浮层布局（column/grid/row 三种模式）；
 * 注：label 不再追加全角占位符，宽度由组件自适应。
 */
/** 属性配置区最多展示的列数。 */
export declare const maxAttrColumns = 3;
/** 单列首屏最多展示的表单项数（与 Ribbon 行高 78px、菜单高 26px 对应）。 */
export declare const maxColumnVisibleItems = 3;
/**
 * 将字段对按“行优先”顺序分布到列中。
 * 例如 7 个字段、3 列 -> [f1,f4,f7] / [f2,f5] / [f3,f6]，
 * 保证同一行的字段从左到右按原顺序排布。
 * @param pairs 字段对列表
 * @param columnCount 目标列数
 * @returns 分列结果
 */
export declare const distributePairsIntoColumns: (pairs: LayoutPair[] | undefined, columnCount: number) => LayoutColumn[];
/**
 * 计算密集可见布局的列数
 * @param itemCount 字段条数
 * @returns 列数：条数 <= 单列上限时取 min(3, 条数)，否则按每列上限向上取整并限制在 1~3
 */
export declare const getDenseVisibleColumnCount: (itemCount: number) => number;
/**
 * 构建密集可见列（首屏完整展示用）
 * @param pairs 字段对列表
 * @param columnCount 目标列数
 * @param maxItemsPerColumn 单列最大条数
 * @returns 布局列数组
 */
export declare const buildDenseVisibleColumns: (pairs: LayoutPair[] | undefined, columnCount: number, maxItemsPerColumn?: number) => LayoutColumn[];
/**
 * 将列数据切成“首屏 + 展开行”，返回 Ribbon 布局行数组。
 * rows[rowIndex][columnIndex] 为第 columnIndex 列在第 rowIndex 屏的字段数组；
 * 空数组用于占位，保持展开行与首屏列结构一致。
 * @param columns 布局列
 * @param maxItems 单列最大条数
 * @param options 选项（compactOverflowRows：是否压缩溢出行为后续行）
 * @returns 布局行数组
 */
export declare const chunkColumnsIntoRows: (columns: LayoutColumn[] | undefined, maxItems?: number, { compactOverflowRows }?: {
    compactOverflowRows?: boolean | undefined;
}) => LayoutRows;
/**
 * 顶部完整展示布局（要素内容可以完整放入顶部菜单时使用）：
 * - 属性按字段数量自适应 1~3 列；
 * - 样式始终单独占一列，排在属性列之后；
 * - 每列首屏最多展示 maxColumnVisibleItems 项，超出部分进入后续行。
 * @param options 布局选项
 * @returns 顶部布局行
 */
export declare const buildTopMenuLayout: ({ attrPairs, stylePairs, attrColumns, styleColumns, compactOverflowRows, }?: BuildTopMenuLayoutOptions) => LayoutRows;
/**
 * 构建弹层布局
 * @description 支持三种模式：
 * - column：按段落顺序纵向排列；
 * - grid：连续网格排布；
 * - row：按行分列排布。
 * @param options 布局选项（attrPairs/stylePairs/popupColumns/popupSections 等）
 * @returns 弹层布局行
 */
export declare const buildPopupLayout: ({ attrPairs, stylePairs, popupColumns, popupSections, popupLayoutMode, popupColumnsPerRow, }?: BuildPopupLayoutOptions) => LayoutRows;
/**
 * 组装更多模型顶部面板布局：
 * - usePopup=false：顶部完整展示布局；
 * - usePopup=true：要素名称入口的浮层布局。
 */
export declare const buildRibbonPanelLayout: ({ attrPairs, stylePairs, attrColumns, styleColumns, compactOverflowRows, usePopup, popupColumns, popupSections, popupLayoutMode, popupColumnsPerRow, }?: BuildRibbonPanelLayoutOptions) => LayoutRows;
/**
 * 对弹层密集尾部行执行列均衡
 * @description 当列数 >= 3 且列高差异较大时，把尾部等长标签组整体搬移到较短列，
 * 保证首屏"密集尾部行"视觉平衡。
 * @param columns 弹层列
 * @param onMove 移动回调（可选）
 * @returns 均衡后的列
 */
export declare const rebalancePopupColumnsForDenseTailRows: (columns: PopupColumn[] | undefined, onMove?: ((payload: PopupColumnMovePayload) => void) | undefined) => PopupColumn[];
