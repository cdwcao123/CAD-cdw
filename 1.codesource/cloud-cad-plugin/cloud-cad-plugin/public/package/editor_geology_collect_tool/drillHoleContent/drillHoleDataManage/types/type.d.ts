import type { DrillHoleDetailsForm } from './interface';
/** BaseInfo 全部字段及钻孔代码；列表与导出共用，布尔值在展示时转换为“是/否”。 */
export type DrillHoleListValues = Pick<DrillHoleDetailsForm, 'drillHoleCode' | 'drillHoleName' | 'holeType' | 'explorationLine1' | 'explorationLine2' | 'collarX' | 'collarY' | 'collarZ' | 'coalPointElevation' | 'coalThickness' | 'radius' | 'finalHoleDepth' | 'startDate' | 'endDate' | 'owner' | 'geoWeakAngle' | 'endHorizon' | 'loggingDepth' | 'loggingDate' | 'finalInclination' | 'isInMine' | 'isInclined' | 'buildPurpose' | 'buildUnit' | 'technician' | 'recorder' | 'hydrographer' | 'loggingMan' | 'loggingInterpreter' | 'description'>;
/** 岩层详情工具栏当前提供的动作标识。 */
export type DrillHoleRockAction = 'importFromFile' | 'exportToFile' | 'reverseOrder' | 'fillStratum' | 'fillMarkerLayer' | 'fixRockCoord' | 'add' | 'insert' | 'edit' | 'delete';
/** 钻孔详情弹框的业务模式。 */
export type DrillHoleDetailsMode = 'create' | 'edit' | 'virtual';
/** 钻孔详情要素记录编辑方式。 */
export type DrillHoleFeatureEditMode = 'add' | 'insert' | 'edit';
/** 钻孔 Excel 导入的业务类型。 */
export type DrillHoleExcelImportMode = 'drill' | 'rock';
/** 钻孔基础信息中允许从图面拾取的坐标字段。 */
export type DrillHoleCoordinateField = 'collarX' | 'collarY' | 'collarZ' | 'floorFixX' | 'floorFixY' | 'floorFixZ';
/** 钻孔基础信息中可一次回填三维坐标的字段组。 */
export type DrillHoleCoordinateGroup = 'collar' | 'floorFix';
/** 钻孔基础信息中允许从单个文字实体回填内容的字段。 */
export type DrillHoleTextField = 'mineName' | 'drillHoleCode' | 'drillHoleName' | 'buildUnit' | 'buildPurpose' | 'location' | 'coalPointElevation' | 'coalThickness' | 'radius' | 'finalHoleDepth' | 'geoWeakAngle' | 'loggingDepth' | 'finalInclination' | 'drillRigName' | 'owner' | 'technician' | 'recorder' | 'hydrographer' | 'loggingMan' | 'loggingInterpreter';
