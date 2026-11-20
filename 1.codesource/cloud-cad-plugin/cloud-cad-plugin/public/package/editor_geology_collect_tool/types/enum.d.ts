/** 地层关联顶点接口的数据来源类型，与服务端 `LinkSourceType` 契约一致。 */
export declare enum StratumVertexSourceType {
    /** 当前地层已经关联的原始顶点。 */
    CurrentStratum = 0,
    /** 地质钻孔顶点。 */
    GeologicalDrillHole = 1,
    /** 井筒石门见煤点。 */
    ShaftCrosscutCoalPoint = 2,
    /** 掘进工作面见煤点。 */
    HeadingFaceCoalPoint = 3,
    /** 回采工作面见煤点。 */
    MiningFaceCoalPoint = 4,
    /** 自定义地层顶点。 */
    Custom = 5
}
/** 数据源下拉框中的本地会话筛选；来源类型直接使用 `StratumVertexSourceType`。 */
export declare enum StratumDataSourceFilter {
    /** 仅显示当前会话已经勾选的顶点。 */
    Selected = "selection:selected",
    /** 仅显示当前会话尚未勾选的顶点。 */
    Unselected = "selection:unselected",
    /** 仅显示已经存在修改副本、但自身仍保留的原始顶点。 */
    ModifiedOriginal = "state:modified-original",
    /** 仅显示打开弹框前服务端已经存在的修改衍生点。 */
    HistoricalModified = "state:historical-modified",
    /** 仅显示当前会话从原始点复制修改得到的点。 */
    CurrentModified = "state:current-modified",
    /** 仅显示当前会话直接手动新增的点。 */
    CurrentAdded = "state:current-added"
}
/** 顶点在数据源编辑会话中的业务状态，用于筛选和行颜色显示。 */
export declare enum StratumVertexSessionState {
    /** 无新增或修改状态的普通服务端顶点。 */
    Normal = "normal",
    /** 已经存在修改副本、但自身仍保留的原始顶点。 */
    ModifiedOriginal = "modified-original",
    /** 打开弹框前服务端已经存在的修改衍生点。 */
    HistoricalModified = "historical-modified",
    /** 当前会话从原始点复制修改得到的点。 */
    CurrentModified = "current-modified",
    /** 当前会话直接手动新增的点。 */
    CurrentAdded = "current-added"
}
