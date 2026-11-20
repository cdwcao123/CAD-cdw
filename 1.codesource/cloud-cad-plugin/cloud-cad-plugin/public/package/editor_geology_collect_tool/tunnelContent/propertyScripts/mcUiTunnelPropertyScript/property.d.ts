import { PropertyType, Options } from 'McEditor';
import { type McDbTunnelInstance } from '@/utils/pluginApi';
type McDbTunnel = McDbTunnelInstance;
export declare const syncEnumLists: () => void;
/**
 * 属性分组类型
 */
export interface GroupPropertyType<T> {
    key: string;
    name: string;
    headerAction?: Record<string, any>;
    property: PropertyType<T>[];
}
export declare const tunnelStyleOptions: import("vue").Ref<{
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: /*elided*/ any[] | undefined;
}[], Options[] | {
    action?: string | undefined;
    label: string;
    value: any;
    key?: string | undefined;
    options?: /*elided*/ any[] | undefined;
}[]>;
/**
 * 初始化巷道样式选项
 */
export declare const initTunnelStyleOptions: (force?: boolean) => Promise<void>;
export declare const initTunnelBaseOptions: (entity?: McDbTunnel | null) => Promise<void>;
/**获取文字字体*/
export declare const tunnelPanelConfig: {
    readonly layout: "tabs";
    readonly defaultSectionKey: "properties";
    readonly sections: readonly [{
        readonly key: "properties";
        readonly label: "属性";
        readonly type: "groups";
        readonly groupKeys: readonly ["base", "properties", "leadPoints"];
    }, {
        readonly key: "styles";
        readonly label: "样式";
        readonly type: "groups";
        readonly groupKeys: readonly ["style_tunnel", "style_nodeName", "style_elevation", "style_coal", "style_symbol"];
    }];
};
export declare const tunnelProperties: Map<string, GroupPropertyType<McDbTunnel>>;
export {};
