import { StratumDataSourceFilter, StratumVertexSourceType, type StratumDataSourceRow, type StratumLinkVertexData, type StratumModel, type StratumModifiedVertexSource } from '../../types';
/**
 * 将接口返回的数据源名称转换为来源编码。
 * 服务端历史数据同时存在“见煤点”和“探煤点”名称，二者按同一来源兼容。
 *
 * @param name 接口返回的 `strType`。
 * @returns 对应的来源类型；未知名称返回 undefined，避免错误归类。
 */
export declare const resolveStratumVertexSourceType: (name: string) => StratumVertexSourceType | undefined;
/**
 * 解析修改原始点后生成的自定义顶点标识。
 * 标识尾段是原顶点的完整 `strSource`，不是原始数据 ID。
 *
 * @param sourceName 顶点的 `strSource`。
 * @returns 原始点来源及标识；不符合衍生点格式时返回 undefined。
 */
export declare const parseModifiedVertexSource: (sourceName: string) => StratumModifiedVertexSource | undefined;
/**
 * 为原始点的修改副本生成自定义 `strSource`。
 * 最后一段直接使用原顶点的完整 `strSource`，不使用本地行 Id。
 *
 * @param sourceType 原顶点来源类型编码。
 * @param originalStrSource 原顶点的 `strSource`。
 * @returns 例如 `N14-1-3d53` 的修改副本编码。
 */
export declare const createModifiedVertexSource: (sourceType: StratumVertexSourceType, originalStrSource: string) => string;
/**
 * 对当前来源结果执行无需请求服务端的会话状态筛选。
 *
 * @param rows 当前来源查询返回的顶点行。
 * @param filter 当前筛选类型。
 * @param selectedIds 当前会话勾选的稳定行标识集合。
 * @returns 与筛选条件匹配的顶点行。
 */
export declare const filterStratumDataSourceRows: (rows: StratumDataSourceRow[], filter: StratumDataSourceFilter, selectedIds: ReadonlySet<string>) => StratumDataSourceRow[];
/**
 * 将工作顶点集合转换为地层对象 `vertexInfo` 使用的接口字段。
 *
 * @param rows 当前地层准备保存的全部顶点。
 * @returns 可直接 JSON 序列化到 `vertexInfo` 的顶点数组。
 */
export declare const toStratumLinkVertexData: (rows: StratumDataSourceRow[]) => StratumLinkVertexData[];
/**
 * 根据工作顶点集合生成 `refineCoord` 坐标结构。
 * 当前没有额外细化点，因此第一项为空；第二项与 `vertexInfo` 顺序一致。
 *
 * @param rows 当前地层准备保存的全部顶点。
 * @returns `[[], [[x, y, zTop, zBottom], ...]]` 坐标结构。
 */
export declare const toStratumRefineCoord: (rows: StratumDataSourceRow[]) => number[][][];
/**
 * 加载指定地层的关联顶点并转换成数据源表格行。
 * MineCode 使用当前工作区 AreaCode，与巷道同步一致；来源编码由下拉框传入，isTop 暂固定为 0。
 *
 * @param model 当前地层模型，使用其地层编码发起查询。
 * @param sourceType 当前查询的数据来源编码，默认查询当前地层原始数据。
 * @returns 映射后的数据源行。
 * @throws 工作区缺少矿井编码、HTTP 请求失败或服务端业务码异常时透传错误。
 */
export declare const loadStratumDataSourceRows: (model: StratumModel, sourceType?: StratumVertexSourceType) => Promise<StratumDataSourceRow[]>;
