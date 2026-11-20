declare class OnTunnel {
    /**
     * 巷道绘制
     * @param params 函数参数
     */
    tunnelDraw: (emits: any) => void;
    /**
     * 绘制立井
     * @param params 函数参数
     */
    tunnelShaft: () => void;
    /**
     * 巷道编辑
     * @param params 函数参数
     */
    tunnelEdit: () => void;
    /**
     * 巷道合并
     */
    tunnelMerge: () => void;
    /**
     * 巷道打断
     */
    tunnelBreak: () => void;
    /**
     * 多段线转巷道
     */
    tunnelFromPolyLine: () => void;
    /**
     * 清空巷道 DeleteTunnelCommand
     */
    tunnelClear: () => void;
    /**
     * 批量编辑
     */
    tunnelMultiEdit: () => void;
    /**
     * 批量平移
     */
    tunnelMultiMove: () => void;
    clearTunnelRemoveEventListener: () => void;
}
declare const onTunnel: OnTunnel;
export default onTunnel;
