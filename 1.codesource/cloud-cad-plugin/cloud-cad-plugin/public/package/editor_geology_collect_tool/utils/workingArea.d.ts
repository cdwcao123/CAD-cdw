/**
 * 读取当前工作区矿井编码，与巷道同步的 currentWorkingAreaInfo.AreaCode 来源保持一致。
 * 每次操作重新读取，不缓存矿井编码，也不使用示例矿井或旧列表记录作为替代值。
 * @returns 当前工作区的非空矿井编码
 * @throws 工作区未就绪或未提供矿井编码时抛出错误，调用方不得发起空矿井查询
 */
export declare function getCurrentWorkingAreaMineCode(): string;
