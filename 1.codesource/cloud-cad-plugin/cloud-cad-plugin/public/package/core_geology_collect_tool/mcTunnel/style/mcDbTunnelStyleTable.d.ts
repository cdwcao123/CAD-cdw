import { McDbDatabase, McDbSymbolTable, McReturnStatus } from 'McCore';
import { McDbTunnel } from '../entity/mcDbTunnel';
import { McDbTunnelStyle } from './mcDbTunnelStyle';
/**
 * 巷道样式表
 */
export declare class McDbTunnelStyleTable extends McDbSymbolTable<McDbTunnelStyle> {
    /**对象类型*/
    protected readonly _type: string;
    /**实体类名 */
    protected static readonly _className: string;
    /**
     * 构造函数
     * @param db 所属数据库
     */
    constructor(db: McDbDatabase);
    /**
     * 添加样式
     * @param style 样式实例
     * @returns
     */
    addTunnelStyle(style: McDbTunnelStyle): Promise<McReturnStatus<string>>;
    /**
     * 获取当前
     * @returns
     */
    getCurrent(): McDbTunnelStyle;
    /**
     * 添加实体引用,子类应重载该方法，
     * @internal
     * @param entity 实体
     */
    addEntityRef(entity: McDbTunnel): void;
    /**
     * 删除实体引用,子类应重载该方法，
     * @internal
     * @param entity 实体
     */
    removeEntityRef(entity: McDbTunnel): void;
    /**
     * 更新实体引用,子类应重载该方法，
     * @internal
     * @param entity 实体
     * @param oldVal 旧值或旧值数组
     * @param newVal 新值或新值数组
     */
    updateEntityRef(entity: McDbTunnel, changedOld: Record<string, any>, changedNew: Record<string, any>): void;
}
