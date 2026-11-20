/** 符号库工具按钮配置。 */
export interface ButtonItem {
    /** 图标名称 */
    icon: string;
    /** 提示文本 */
    tooltip: string;
    /** 按钮类型 */
    type: string;
}
/** 符号库分组数据。 */
export interface SymbolGroupType {
    /**
     * 备用短字串1
     */
    Char64_1?: string;
    /**
     * 备用短字串2
     */
    Char64_2?: string;
    /**
     * 备用短字串3
     */
    Char64_3?: string;
    /**
     * 备用短字串4
     */
    Char64_4?: string;
    /**
     * 创建公司ID
     */
    CreateCompanyId?: string;
    /**
     * 创建时间
     */
    CreateDataTime?: string;
    /**
     * 创建部门ID
     */
    CreateDepartmentId?: string;
    /**
     * 创建人ID
     */
    CreateUserId?: string;
    /**
     * 删除标记
     */
    DeleteMark?: number;
    /**
     * 专业 专业(建筑/结构/机电等)
     */
    Discipline?: number;
    /**
     * 是否可编辑 除管理员和创建者外是否可编辑
     */
    Editable?: string;
    /**
     * 备用字段1
     */
    Field1?: string;
    /**
     * 备用字段2
     */
    Field2?: string;
    /**
     * 备用字段3
     */
    Field3?: string;
    /**
     * 备用字段4
     */
    Field4?: string;
    /**
     * 分组编码
     */
    GroupCode?: string;
    /**
     * 分组名称
     */
    GroupName?: string;
    /**
     * 分组类型 点、线、填充、型
     */
    GroupType?: number;
    /**
     * 唯一标识
     */
    ID?: string;
    /**
     * 主键值
     */
    keyValue?: string;
    /**
     * 父级分组
     */
    ParentID?: string;
    /**
     * 修改时间
     */
    UpdateDateTime?: string;
    /**
     * 修改人
     */
    UpdateUserId?: string;
    /**
     * 可见性级别 包括共有，私有，项目组共享
     */
    visibility: number;
    [property: string]: any;
}
