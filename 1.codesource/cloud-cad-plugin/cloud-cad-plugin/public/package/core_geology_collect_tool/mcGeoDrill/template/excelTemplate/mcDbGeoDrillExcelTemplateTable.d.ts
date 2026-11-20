import { McDbSymbolTable } from 'McCore';
import { McDbGeoDrillExcelTemplate } from './mcDbGeoDrillExcelTemplate';
/**地质钻孔excel模板表 */
export declare class McDbGeoDrillExcelTemplateTable extends McDbSymbolTable<McDbGeoDrillExcelTemplate> {
    /**对象类型*/
    protected readonly _type = "McDbGeoDrillExcelTemplateTable";
    /**实体类名 */
    protected static readonly _className = "McDbGeoDrillExcelTemplateTable";
}
