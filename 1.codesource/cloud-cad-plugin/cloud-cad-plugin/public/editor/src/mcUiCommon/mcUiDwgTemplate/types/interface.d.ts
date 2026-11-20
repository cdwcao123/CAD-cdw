export interface RuleForm {
    TplName: string;
    FileUrl: string;
    TplDesc: string;
}
export interface TemplateInfo {
    Char64_1?: string;
    Char64_2?: string;
    Char64_3?: string;
    Char64_4?: string;
    CreateCompanyId?: string;
    CreateDataTime?: string;
    CreateDepartmentId?: string;
    CreateUserId?: string;
    DeleteMark?: number;
    Discipline?: number;
    Editable?: string;
    Field1?: string;
    Field2?: string;
    Field3?: string;
    Field4?: string;
    FileSize?: string;
    FileType?: string;
    FileUrl?: string;
    GroupId?: string;
    ID?: string;
    keyValue?: string;
    Status?: string;
    TplDesc?: string;
    TplName?: string;
    TplType?: number;
    UpdateDateTime?: string;
    UpdateUserId?: string;
    Veision?: number;
    Visibility?: number;
    [property: string]: any;
}
export interface UpDrawingTemplateType {
    code: string;
    fileBase64: string;
    fileType?: string;
}
