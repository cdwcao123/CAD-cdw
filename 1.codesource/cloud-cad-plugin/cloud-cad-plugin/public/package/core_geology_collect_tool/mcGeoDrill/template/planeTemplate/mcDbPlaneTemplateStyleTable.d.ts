import { McDbDatabase, McDbSymbolTable } from 'McCore';
import { McDbGeoDrill } from '../../entity/mcDbGeoDrill';
import { McDbPlaneTemplateStyle } from './mcDbPlaneTemplateStyle';
/**
 * 地质钻孔平面模板样式表类
 * @class
 * @extends McDbSymbolTable
 */
export declare class McDbPlaneTemplateStyleTable extends McDbSymbolTable<McDbPlaneTemplateStyle> {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    constructor(db: McDbDatabase);
    /**
       * 添加实体引用,子类应重载该方法，
       * @internal
       * @param entity 实体
       */
    addEntityRef(entity: McDbGeoDrill): void;
    /**
       * 删除实体引用,子类应重载该方法，
       * @internal
       * @param entity 实体
       */
    removeEntityRef(entity: McDbGeoDrill): void;
    /**
       * 更新实体引用,子类应重载该方法，
       * @internal
       * @param entity 实体
       * @param oldVal 旧值或旧值数组
       * @param newVal 新值或新值数组
       */
    updateEntityRef(entity: McDbGeoDrill, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
}
