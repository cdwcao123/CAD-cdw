import { McGeoSchemaInfo } from './interface';
/**
 * 地质模型元属性脚本或要素类属性脚本
 */
type McGeoSchema = Map<string, McGeoSchemaInfo>;
/**
 * 地质模型字段映射
 * @description 用于存储地质模型的字段信息，键为字段名，值为字段值
 */
type McGeoFieldMap = Map<string, any>;
export { McGeoSchema, McGeoFieldMap, McGeoGeometryDataType, };
