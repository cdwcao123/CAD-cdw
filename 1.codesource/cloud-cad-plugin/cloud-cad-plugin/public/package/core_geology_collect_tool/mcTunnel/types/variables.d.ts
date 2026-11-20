/** 系统变量名：当前巷道样式 */
declare const sysCurrentTunnelStyle: string;
/** 系统变量名：巷道样式 */
declare const sysTunnelStyle: string;
/** 系统变量名：巷道导线点符号名 */
declare const sysTunnelNodeSymbolName: string;
/** 系统变量名：巷道虚拟导线点符号名 */
declare const sysTunnelVirtualNodeSymbolName: string;
/** 系统变量名：巷道编辑导线点符号名 */
declare const sysTunnelEditingNodeSymbolName: string;
/** 系统变量名：竖井巷道符号名 */
declare const sysShaftTunnelSymbolName: string;
/**
 * 获取巷道边线计算接口地址。
 */
declare function getCalculateTunnelBorderLineRequestURL(): string;
export { sysCurrentTunnelStyle, sysTunnelStyle, sysTunnelNodeSymbolName, sysTunnelVirtualNodeSymbolName, sysTunnelEditingNodeSymbolName, sysShaftTunnelSymbolName, getCalculateTunnelBorderLineRequestURL, };
