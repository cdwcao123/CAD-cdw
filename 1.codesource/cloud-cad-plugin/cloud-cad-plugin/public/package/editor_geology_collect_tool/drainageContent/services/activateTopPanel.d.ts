/**
 * 关闭其他抽采顶部主面板后激活目标功能。
 * @param activeDialogId 目标功能复用的弹框 ID；不打开主面板的命令传 undefined，关闭全部已有主面板。
 * @param action 其他面板全部关闭后执行的可选操作；顶部命令守卫只处理面板时无需传入。
 * @returns 成功执行目标功能时返回 true；关闭被业务确认拦截或已有更新的激活请求时返回 false。
 */
export declare function activateDrainageTopPanel(activeDialogId: string | undefined, action?: () => void | Promise<void>): Promise<boolean>;
