declare const _default: ({
    name: string;
    component: {
        new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('../mcUiCommon').ToolTipProps> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, import('vue').PublicProps, {
            title: string;
            offset: {
                x: number;
                y: number;
            };
            placement: import('../mcUiCommon/mcUiToolTip/type/type').PlacementType;
            delay: number;
            contents: import('../mcUiCommon').ToolTipContents[];
            trigger: import('../mcUiCommon/mcUiToolTip/type/type').TriggerType;
            cmdAsName: string;
            delayImage: number;
        }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
            wrapperRef: HTMLDivElement;
            tooltipRef: HTMLDivElement;
        }, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('../mcUiCommon').ToolTipProps> & Readonly<{}>, {}, {}, {}, {}, {
            title: string;
            offset: {
                x: number;
                y: number;
            };
            placement: import('../mcUiCommon/mcUiToolTip/type/type').PlacementType;
            delay: number;
            contents: import('../mcUiCommon').ToolTipContents[];
            trigger: import('../mcUiCommon/mcUiToolTip/type/type').TriggerType;
            cmdAsName: string;
            delayImage: number;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import('vue').ComponentOptionsBase<Readonly<import('../mcUiCommon').ToolTipProps> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {
        title: string;
        offset: {
            x: number;
            y: number;
        };
        placement: import('../mcUiCommon/mcUiToolTip/type/type').PlacementType;
        delay: number;
        contents: import('../mcUiCommon').ToolTipContents[];
        trigger: import('../mcUiCommon/mcUiToolTip/type/type').TriggerType;
        cmdAsName: string;
        delayImage: number;
    }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
        $slots: {
            default?(_: {}): any;
            tooltip?(_: {}): any;
        };
    });
} | {
    name: string;
    component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        isFirst: {
            type: BooleanConstructor;
            default: boolean;
        };
        item: {
            type: () => import('../mcUiCommon').MenuItem;
            default: () => {};
        };
        activeMenuKey: {
            type: ArrayConstructor;
            default: () => never[];
        };
    }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        isFirst: {
            type: BooleanConstructor;
            default: boolean;
        };
        item: {
            type: () => import('../mcUiCommon').MenuItem;
            default: () => {};
        };
        activeMenuKey: {
            type: ArrayConstructor;
            default: () => never[];
        };
    }>> & Readonly<{}>, {
        item: import('../mcUiCommon').MenuItem;
        activeMenuKey: unknown[];
        isFirst: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
} | {
    name: string;
    component: {
        new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('../mcUiCommon').Props> & Readonly<{
            onMenuItemClick?: ((item: import('../mcUiCommon').MenuItem | import('../mcUiCommon').MenuItem[]) => any) | undefined;
            onMenuOpen?: (() => any) | undefined;
            onMenuClose?: (() => any) | undefined;
        }>, {
            open: () => void;
            close: () => void;
            toggle: () => void;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            menuItemClick: (item: import('../mcUiCommon').MenuItem | import('../mcUiCommon').MenuItem[]) => any;
            menuOpen: () => any;
            menuClose: () => any;
        }, import('vue').PublicProps, {
            multiple: boolean;
            closeOnClickOutside: boolean;
            offset: number;
            placement: import('../mcUiCommon').PlacementType;
            showArrow: boolean;
            disabled: boolean;
            menuCom: string | import('vue').Component;
            trigger: import('../mcUiCommon').TriggerType;
            maxHeight: number;
            triggerText: string;
        }, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
            triggerRef: HTMLDivElement;
            dropdownRef: HTMLDivElement;
            subMenuRef: HTMLDivElement;
        }, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('../mcUiCommon').Props> & Readonly<{
            onMenuItemClick?: ((item: import('../mcUiCommon').MenuItem | import('../mcUiCommon').MenuItem[]) => any) | undefined;
            onMenuOpen?: (() => any) | undefined;
            onMenuClose?: (() => any) | undefined;
        }>, {
            open: () => void;
            close: () => void;
            toggle: () => void;
        }, {}, {}, {}, {
            multiple: boolean;
            closeOnClickOutside: boolean;
            offset: number;
            placement: import('../mcUiCommon').PlacementType;
            showArrow: boolean;
            disabled: boolean;
            menuCom: string | import('vue').Component;
            trigger: import('../mcUiCommon').TriggerType;
            maxHeight: number;
            triggerText: string;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import('vue').ComponentOptionsBase<Readonly<import('../mcUiCommon').Props> & Readonly<{
        onMenuItemClick?: ((item: import('../mcUiCommon').MenuItem | import('../mcUiCommon').MenuItem[]) => any) | undefined;
        onMenuOpen?: (() => any) | undefined;
        onMenuClose?: (() => any) | undefined;
    }>, {
        open: () => void;
        close: () => void;
        toggle: () => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        menuItemClick: (item: import('../mcUiCommon').MenuItem | import('../mcUiCommon').MenuItem[]) => any;
        menuOpen: () => any;
        menuClose: () => any;
    }, string, {
        multiple: boolean;
        closeOnClickOutside: boolean;
        offset: number;
        placement: import('../mcUiCommon').PlacementType;
        showArrow: boolean;
        disabled: boolean;
        menuCom: string | import('vue').Component;
        trigger: import('../mcUiCommon').TriggerType;
        maxHeight: number;
        triggerText: string;
    }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
        $slots: {
            trigger?(_: {}): any;
        };
    });
} | {
    name: string;
    component: import('vue').DefineComponent<import('../mcUiCommon').IconSvgProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('../mcUiCommon').IconSvgProps> & Readonly<{}>, {
        hoverColor: string;
        size: number | string;
        color: string;
        className: string;
        preserveOriginalColor: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
        svgRef: SVGSVGElement;
    }, SVGSVGElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        size?: string;
        disabled?: boolean;
        entityIds?: any;
        modelValue?: string | number | {
            colorIndex: number;
            colorMethod: number;
            color: {
                r: number;
                g: number;
                b: number;
            };
        };
        getOptions?: () => {
            label: string;
            value: string;
        }[];
        disabledColor?: any[];
        isHatchBackground?: boolean;
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (val: any) => any;
        "update:modelValue": (val: any) => any;
    }, string, import('vue').PublicProps, Readonly<{
        size?: string;
        disabled?: boolean;
        entityIds?: any;
        modelValue?: string | number | {
            colorIndex: number;
            colorMethod: number;
            color: {
                r: number;
                g: number;
                b: number;
            };
        };
        getOptions?: () => {
            label: string;
            value: string;
        }[];
        disabledColor?: any[];
        isHatchBackground?: boolean;
    }> & Readonly<{
        onChange?: ((val: any) => any) | undefined;
        "onUpdate:modelValue"?: ((val: any) => any) | undefined;
    }>, {
        size: string;
        disabled: boolean;
        getOptions: () => {
            label: string;
            value: string;
        }[];
        disabledColor: any[];
        isHatchBackground: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        modelValue?: string | number | boolean | null | undefined | any[];
        disabled?: boolean;
        placeholder?: string;
        getOptions?: () => import('../mcUiSidePanel').CreatableSelectOption[] | Promise<import('../mcUiSidePanel').CreatableSelectOption[]>;
        multiple?: boolean;
        filterable?: boolean;
        allowCreate?: boolean;
        defaultFirstOption?: boolean;
        clearable?: boolean;
        collapseTags?: boolean;
        collapseTagsTooltip?: boolean;
        reserveKeyword?: boolean;
        cacheKey?: string;
        prop?: {
            key?: string;
        };
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (val: any) => any;
        "update:modelValue": (val: any) => any;
    }, string, import('vue').PublicProps, Readonly<{
        modelValue?: string | number | boolean | null | undefined | any[];
        disabled?: boolean;
        placeholder?: string;
        getOptions?: () => import('../mcUiSidePanel').CreatableSelectOption[] | Promise<import('../mcUiSidePanel').CreatableSelectOption[]>;
        multiple?: boolean;
        filterable?: boolean;
        allowCreate?: boolean;
        defaultFirstOption?: boolean;
        clearable?: boolean;
        collapseTags?: boolean;
        collapseTagsTooltip?: boolean;
        reserveKeyword?: boolean;
        cacheKey?: string;
        prop?: {
            key?: string;
        };
    }> & Readonly<{
        onChange?: ((val: any) => any) | undefined;
        "onUpdate:modelValue"?: ((val: any) => any) | undefined;
    }>, {
        placeholder: string;
        multiple: boolean;
        disabled: boolean;
        modelValue: string | number | boolean | any[] | null;
        filterable: boolean;
        getOptions: () => import('../mcUiSidePanel').CreatableSelectOption[] | Promise<import('../mcUiSidePanel').CreatableSelectOption[]>;
        clearable: boolean;
        allowCreate: boolean;
        defaultFirstOption: boolean;
        reserveKeyword: boolean;
        collapseTags: boolean;
        collapseTagsTooltip: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
} | {
    name: string;
    component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        modelValue: {
            type: StringConstructor;
            default: string;
        };
        options: {
            type: () => import('../mcUiCommon').Layer[];
            default: () => never[];
        };
    }>, {
        layers: import('vue').Ref<{
            id: string;
            name: string;
            color: {
                colorIndex: import('McCore').McColorIndex;
                colorMethod: import('McCore').McColorMethod;
                color?: {
                    r: number;
                    g: number;
                    b: number;
                } | undefined;
                getColorMethod: () => import('McCore').McColorMethod;
                setColorMethod: (value: import('McCore').McColorMethod) => void;
                isByLayer: () => boolean;
                isByBlock: () => boolean;
                isByAci: () => boolean;
                isByColor: () => boolean;
                isForeground: () => boolean;
                isNull: () => boolean;
                getColorIndex: () => number;
                setColorIndex: (colorIndex: number) => import('McCore').McReturnStatus<string>;
                setTHREEColor: (color: import('McCore/lib/ThreeJS/utils').ColorRepresentation) => import('McCore').McColor;
                setRgb: (r: number, g: number, b: number) => void;
                getMcRGB: (layer?: import('McCore').McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore').McRGB | null;
                getThreeColor: (layer?: import('McCore').McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore/lib/ThreeJS/Three').Color | null | undefined;
                fromCssStyleColor: (color: string) => import('McCore').McColor;
                toJson: () => import('McCore').IMcColor;
                fromJson: (cl: import('McCore').IMcColor) => import('McCore').McColor;
                isEqual: (color: import('McCore').McColor) => boolean;
                copy: (color: import('McCore').McColor) => void;
                clone: () => import('McCore').McColor;
            };
            isOff: boolean;
            locked: boolean;
            frozen: boolean;
            lineType?: string | undefined;
            lineWidth?: import('McCore').McDbLineWeight | undefined;
            transparency?: number | undefined;
            desc?: string | undefined;
            index?: number | undefined;
        }[], import('../mcUiCommon').Layer[] | {
            id: string;
            name: string;
            color: {
                colorIndex: import('McCore').McColorIndex;
                colorMethod: import('McCore').McColorMethod;
                color?: {
                    r: number;
                    g: number;
                    b: number;
                } | undefined;
                getColorMethod: () => import('McCore').McColorMethod;
                setColorMethod: (value: import('McCore').McColorMethod) => void;
                isByLayer: () => boolean;
                isByBlock: () => boolean;
                isByAci: () => boolean;
                isByColor: () => boolean;
                isForeground: () => boolean;
                isNull: () => boolean;
                getColorIndex: () => number;
                setColorIndex: (colorIndex: number) => import('McCore').McReturnStatus<string>;
                setTHREEColor: (color: import('McCore/lib/ThreeJS/utils').ColorRepresentation) => import('McCore').McColor;
                setRgb: (r: number, g: number, b: number) => void;
                getMcRGB: (layer?: import('McCore').McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore').McRGB | null;
                getThreeColor: (layer?: import('McCore').McDbLayer, block?: import('McCore').McDbEntity, forGroundRgb?: import('McCore').McRGB) => import('McCore/lib/ThreeJS/Three').Color | null | undefined;
                fromCssStyleColor: (color: string) => import('McCore').McColor;
                toJson: () => import('McCore').IMcColor;
                fromJson: (cl: import('McCore').IMcColor) => import('McCore').McColor;
                isEqual: (color: import('McCore').McColor) => boolean;
                copy: (color: import('McCore').McColor) => void;
                clone: () => import('McCore').McColor;
            };
            isOff: boolean;
            locked: boolean;
            frozen: boolean;
            lineType?: string | undefined;
            lineWidth?: import('McCore').McDbLineWeight | undefined;
            transparency?: number | undefined;
            desc?: string | undefined;
            index?: number | undefined;
        }[]>;
        selectedLayer: import('vue').ShallowRef<string, string>;
        selectLayer: (layerId: string) => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        modelValue: {
            type: StringConstructor;
            default: string;
        };
        options: {
            type: () => import('../mcUiCommon').Layer[];
            default: () => never[];
        };
    }>> & Readonly<{}>, {
        options: import('../mcUiCommon').Layer[];
        modelValue: string;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        modelValue?: number | string;
        disabled?: boolean;
        getOptions?: () => {
            label: string;
            value: any;
        }[];
        placeholder?: string;
        appdendTo?: string;
        disabledLineWeight?: number | string | (number | string)[];
        entity?: {
            getRealLineWeight?: () => number;
        } | null;
        entities?: {
            getRealLineWeight?: () => number;
        }[] | null;
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (...args: any[]) => void;
        "update:modelValue": (...args: any[]) => void;
    }, string, import('vue').PublicProps, Readonly<{
        modelValue?: number | string;
        disabled?: boolean;
        getOptions?: () => {
            label: string;
            value: any;
        }[];
        placeholder?: string;
        appdendTo?: string;
        disabledLineWeight?: number | string | (number | string)[];
        entity?: {
            getRealLineWeight?: () => number;
        } | null;
        entities?: {
            getRealLineWeight?: () => number;
        }[] | null;
    }> & Readonly<{
        onChange?: ((...args: any[]) => any) | undefined;
        "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    }>, {
        disabled: boolean;
        modelValue: number | string;
        entity: {
            getRealLineWeight?: () => number;
        } | null;
        entities: {
            getRealLineWeight?: () => number;
        }[] | null;
        getOptions: () => {
            label: string;
            value: any;
        }[];
        disabledLineWeight: number | string | (number | string)[];
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
} | {
    name: string;
    component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        modelValue: {
            type: (ObjectConstructor | StringConstructor)[];
            default: string;
        };
        disabled: BooleanConstructor;
        getOptions: FunctionConstructor;
        placeholder: StringConstructor;
        disabledLineType: {
            type: (ArrayConstructor | StringConstructor)[];
            default: () => never[];
        };
        deferInitialOptions: BooleanConstructor;
    }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        change: (...args: any[]) => void;
        "update:modelValue": (...args: any[]) => void;
    }, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        modelValue: {
            type: (ObjectConstructor | StringConstructor)[];
            default: string;
        };
        disabled: BooleanConstructor;
        getOptions: FunctionConstructor;
        placeholder: StringConstructor;
        disabledLineType: {
            type: (ArrayConstructor | StringConstructor)[];
            default: () => never[];
        };
        deferInitialOptions: BooleanConstructor;
    }>> & Readonly<{
        onChange?: ((...args: any[]) => any) | undefined;
        "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    }>, {
        disabled: boolean;
        modelValue: string | Record<string, any>;
        disabledLineType: string | unknown[];
        deferInitialOptions: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        modelValue?: any;
        options?: any[];
        disabled?: boolean;
        placeholder?: string;
        loadOptions?: (() => Promise<any[]> | any[]) | null;
        normalizeValue?: ((value: any, options?: any[]) => any) | null;
        prop?: any;
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (value: string[]) => any;
        "update:modelValue": (value: string[]) => any;
    }, string, import('vue').PublicProps, Readonly<{
        modelValue?: any;
        options?: any[];
        disabled?: boolean;
        placeholder?: string;
        loadOptions?: (() => Promise<any[]> | any[]) | null;
        normalizeValue?: ((value: any, options?: any[]) => any) | null;
        prop?: any;
    }> & Readonly<{
        onChange?: ((value: string[]) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        modelValue?: string | number;
        buttonText?: string;
        buttonIcon?: string | import('vue').Component;
        buttonType?: "default" | "primary" | "success" | "info" | "warning" | "danger" | "text" | "";
        buttonSize?: "large" | "default" | "small" | "";
        plain?: boolean;
        disabled?: boolean;
        placeholder?: string;
        gap?: number;
        prop?: any;
        currentIndex?: number;
        getOptions?: () => any[];
        onClick?: (payload: {
            value: any;
            prop: any;
            event: MouseEvent;
        }) => void;
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        change: (value: any) => any;
        click: (payload: any) => any;
        "update:modelValue": (value: any) => any;
        pick: (value: any) => any;
        commit: (value: any) => any;
    }, string, import('vue').PublicProps, Readonly<{
        modelValue?: string | number;
        buttonText?: string;
        buttonIcon?: string | import('vue').Component;
        buttonType?: "default" | "primary" | "success" | "info" | "warning" | "danger" | "text" | "";
        buttonSize?: "large" | "default" | "small" | "";
        plain?: boolean;
        disabled?: boolean;
        placeholder?: string;
        gap?: number;
        prop?: any;
        currentIndex?: number;
        getOptions?: () => any[];
        onClick?: (payload: {
            value: any;
            prop: any;
            event: MouseEvent;
        }) => void;
    }> & Readonly<{
        onChange?: ((value: any) => any) | undefined;
        onClick?: ((payload: any) => any) | undefined;
        "onUpdate:modelValue"?: ((value: any) => any) | undefined;
        onPick?: ((value: any) => any) | undefined;
        onCommit?: ((value: any) => any) | undefined;
    }>, {
        placeholder: string;
        plain: boolean;
        disabled: boolean;
        onClick: (payload: {
            value: any;
            prop: any;
            event: MouseEvent;
        }) => void;
        modelValue: string | number;
        currentIndex: number;
        getOptions: () => any[];
        buttonText: string;
        prop: any;
        gap: number;
        buttonIcon: string | import('vue').Component;
        buttonType: "default" | "primary" | "success" | "info" | "warning" | "danger" | "text" | "";
        buttonSize: "large" | "default" | "small" | "";
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
} | {
    name: string;
    component: {
        new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('vue').ExtractPropTypes<{
            data: {
                type: ArrayConstructor;
                default: () => never[];
            };
            columns: {
                type: () => import('../mcUiCommon').Column[];
                required: true;
            };
            editMode: {
                type: StringConstructor;
                default: string;
            };
            height: {
                type: StringConstructor;
                default: string;
            };
            highlightId: {
                type: StringConstructor;
                default: string;
            };
            selectedId: {
                type: StringConstructor;
                default: string;
            };
            shiftRangeSelection: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowRangeSelection: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowResizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            headerRowResizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowHeights: {
                type: () => number[];
                default: () => never[];
            };
            headerRowHeight: {
                type: NumberConstructor;
                default: number;
            };
            minRowHeight: {
                type: NumberConstructor;
                default: number;
            };
            selectedRows: {
                type: () => any[];
                default: () => never[];
            };
            batchLoading: {
                type: BooleanConstructor;
                default: boolean;
            };
            batchSize: {
                type: NumberConstructor;
                default: number;
            };
        }>> & Readonly<{
            "onRow-select"?: ((...args: any[]) => any) | undefined;
            "onCell-dblclick"?: ((...args: any[]) => any) | undefined;
            "onEdit-change"?: ((...args: any[]) => any) | undefined;
            "onCell-edit"?: ((...args: any[]) => any) | undefined;
            "onRow-resize"?: ((...args: any[]) => any) | undefined;
            "onHeader-row-resize"?: ((...args: any[]) => any) | undefined;
        }>, {
            startEdit: (rowIndex: number, prop: string, isFocus: boolean) => Promise<void>;
            endEdit: () => void;
            setCurrentRowById: (id: string) => void;
            resetBatchLoading: () => Promise<void>;
        }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            "row-select": (...args: any[]) => void;
            "cell-dblclick": (...args: any[]) => void;
            "edit-change": (...args: any[]) => void;
            "cell-edit": (...args: any[]) => void;
            "row-resize": (...args: any[]) => void;
            "header-row-resize": (...args: any[]) => void;
        }, import('vue').PublicProps, {
            height: string;
            data: unknown[];
            selectedId: string;
            selectedRows: any[];
            highlightId: string;
            rowRangeSelection: boolean;
            editMode: string;
            shiftRangeSelection: boolean;
            rowResizable: boolean;
            headerRowResizable: boolean;
            rowHeights: number[];
            headerRowHeight: number;
            minRowHeight: number;
            batchLoading: boolean;
            batchSize: number;
        }, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
            tableRef: unknown;
            editInputRef: unknown[];
        }, any, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('vue').ExtractPropTypes<{
            data: {
                type: ArrayConstructor;
                default: () => never[];
            };
            columns: {
                type: () => import('../mcUiCommon').Column[];
                required: true;
            };
            editMode: {
                type: StringConstructor;
                default: string;
            };
            height: {
                type: StringConstructor;
                default: string;
            };
            highlightId: {
                type: StringConstructor;
                default: string;
            };
            selectedId: {
                type: StringConstructor;
                default: string;
            };
            shiftRangeSelection: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowRangeSelection: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowResizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            headerRowResizable: {
                type: BooleanConstructor;
                default: boolean;
            };
            rowHeights: {
                type: () => number[];
                default: () => never[];
            };
            headerRowHeight: {
                type: NumberConstructor;
                default: number;
            };
            minRowHeight: {
                type: NumberConstructor;
                default: number;
            };
            selectedRows: {
                type: () => any[];
                default: () => never[];
            };
            batchLoading: {
                type: BooleanConstructor;
                default: boolean;
            };
            batchSize: {
                type: NumberConstructor;
                default: number;
            };
        }>> & Readonly<{
            "onRow-select"?: ((...args: any[]) => any) | undefined;
            "onCell-dblclick"?: ((...args: any[]) => any) | undefined;
            "onEdit-change"?: ((...args: any[]) => any) | undefined;
            "onCell-edit"?: ((...args: any[]) => any) | undefined;
            "onRow-resize"?: ((...args: any[]) => any) | undefined;
            "onHeader-row-resize"?: ((...args: any[]) => any) | undefined;
        }>, {
            startEdit: (rowIndex: number, prop: string, isFocus: boolean) => Promise<void>;
            endEdit: () => void;
            setCurrentRowById: (id: string) => void;
            resetBatchLoading: () => Promise<void>;
        }, {}, {}, {}, {
            height: string;
            data: unknown[];
            selectedId: string;
            selectedRows: any[];
            highlightId: string;
            rowRangeSelection: boolean;
            editMode: string;
            shiftRangeSelection: boolean;
            rowResizable: boolean;
            headerRowResizable: boolean;
            rowHeights: number[];
            headerRowHeight: number;
            minRowHeight: number;
            batchLoading: boolean;
            batchSize: number;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import('vue').ComponentOptionsBase<Readonly<import('vue').ExtractPropTypes<{
        data: {
            type: ArrayConstructor;
            default: () => never[];
        };
        columns: {
            type: () => import('../mcUiCommon').Column[];
            required: true;
        };
        editMode: {
            type: StringConstructor;
            default: string;
        };
        height: {
            type: StringConstructor;
            default: string;
        };
        highlightId: {
            type: StringConstructor;
            default: string;
        };
        selectedId: {
            type: StringConstructor;
            default: string;
        };
        shiftRangeSelection: {
            type: BooleanConstructor;
            default: boolean;
        };
        rowRangeSelection: {
            type: BooleanConstructor;
            default: boolean;
        };
        rowResizable: {
            type: BooleanConstructor;
            default: boolean;
        };
        headerRowResizable: {
            type: BooleanConstructor;
            default: boolean;
        };
        rowHeights: {
            type: () => number[];
            default: () => never[];
        };
        headerRowHeight: {
            type: NumberConstructor;
            default: number;
        };
        minRowHeight: {
            type: NumberConstructor;
            default: number;
        };
        selectedRows: {
            type: () => any[];
            default: () => never[];
        };
        batchLoading: {
            type: BooleanConstructor;
            default: boolean;
        };
        batchSize: {
            type: NumberConstructor;
            default: number;
        };
    }>> & Readonly<{
        "onRow-select"?: ((...args: any[]) => any) | undefined;
        "onCell-dblclick"?: ((...args: any[]) => any) | undefined;
        "onEdit-change"?: ((...args: any[]) => any) | undefined;
        "onCell-edit"?: ((...args: any[]) => any) | undefined;
        "onRow-resize"?: ((...args: any[]) => any) | undefined;
        "onHeader-row-resize"?: ((...args: any[]) => any) | undefined;
    }>, {
        startEdit: (rowIndex: number, prop: string, isFocus: boolean) => Promise<void>;
        endEdit: () => void;
        setCurrentRowById: (id: string) => void;
        resetBatchLoading: () => Promise<void>;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        "row-select": (...args: any[]) => void;
        "cell-dblclick": (...args: any[]) => void;
        "edit-change": (...args: any[]) => void;
        "cell-edit": (...args: any[]) => void;
        "row-resize": (...args: any[]) => void;
        "header-row-resize": (...args: any[]) => void;
    }, string, {
        height: string;
        data: unknown[];
        selectedId: string;
        selectedRows: any[];
        highlightId: string;
        rowRangeSelection: boolean;
        editMode: string;
        shiftRangeSelection: boolean;
        rowResizable: boolean;
        headerRowResizable: boolean;
        rowHeights: number[];
        headerRowHeight: number;
        minRowHeight: number;
        batchLoading: boolean;
        batchSize: number;
    }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
        $slots: Partial<Record<string, (_: {
            row: any;
            index: any;
            isEditing: boolean;
            column: import('../mcUiCommon').Column;
            endEdit: () => void;
            cellValue: any;
        }) => any>>;
    });
} | {
    name: string;
    component: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        config: {
            type: () => import('../mcUiDialog').DialogInputConfig;
            required: true;
        };
    }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        changeData: (...args: any[]) => void;
    }, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        config: {
            type: () => import('../mcUiDialog').DialogInputConfig;
            required: true;
        };
    }>> & Readonly<{
        onChangeData?: ((...args: any[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
        formRef: unknown;
    }, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<import('../mcUiCommon').PrintPanelProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        changeData: (config: import('../mcUiCommon').PrintConfig) => any;
    }, string, import('vue').PublicProps, Readonly<import('../mcUiCommon').PrintPanelProps> & Readonly<{
        onChangeData?: ((config: import('../mcUiCommon').PrintConfig) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        changeData: (...args: any[]) => void;
    }, string, import('vue').PublicProps, Readonly<{}> & Readonly<{
        onChangeData?: ((...args: any[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        changeData: (...args: any[]) => void;
    }, string, import('vue').PublicProps, Readonly<{}> & Readonly<{
        onChangeData?: ((...args: any[]) => any) | undefined;
    }>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
        ruleFormRef: unknown;
    }, any>;
} | {
    name: string;
    component: {
        new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('vue').ExtractPropTypes<{
            name: {
                type: StringConstructor;
                default: string;
            };
        }>> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, import('vue').PublicProps, {
            name: string;
        }, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('vue').ExtractPropTypes<{
            name: {
                type: StringConstructor;
                default: string;
            };
        }>> & Readonly<{}>, {}, {}, {}, {}, {
            name: string;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import('vue').ComponentOptionsBase<Readonly<import('vue').ExtractPropTypes<{
        name: {
            type: StringConstructor;
            default: string;
        };
    }>> & Readonly<{}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, {
        name: string;
    }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
        $slots: {
            default?(_: {}): any;
        };
    });
} | {
    name: string;
    component: import('vue').DefineComponent<import('../mcUiCommon').InsertTableProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
        changeData: (value: import('../mcUiCommon').InsertTableFormData) => any;
        "update:modelValue": (value: import('../mcUiCommon').InsertTableFormData) => any;
        editTableStyle: (value: string) => any;
    }, string, import('vue').PublicProps, Readonly<import('../mcUiCommon').InsertTableProps> & Readonly<{
        onChangeData?: ((value: import('../mcUiCommon').InsertTableFormData) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import('../mcUiCommon').InsertTableFormData) => any) | undefined;
        onEditTableStyle?: ((value: string) => any) | undefined;
    }>, {
        modelValue: Partial<import('../mcUiCommon').InsertTableFormData>;
        tableStyleOptions: import('../mcUiCommon').InsertTableOption[];
        cellStyleOptions: import('../mcUiCommon').InsertTableOption[];
        cellStyleOptionsByTable: Record<string, import('../mcUiCommon').InsertTableOption[]>;
        tableStyles: import('McCore').McDbTableStyle[];
        fileAccept: string;
        onEditTableStyle: (styleName: string) => void;
        hasStartingTable: boolean;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<import('../mcUiCommon/mcUiTablePreview').TablePreviewProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('../mcUiCommon/mcUiTablePreview').TablePreviewProps> & Readonly<{}>, {
        entity: import('McCore').McDbTable;
        entities: import('McCore').McDbTable[];
        previewKey: string | number;
        emptyText: string;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
} | {
    name: string;
    component: import('vue').DefineComponent<{
        id?: string;
        entity?: any;
        entities?: any[];
        emptyText?: string;
        previewKey?: string | number;
    }, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        id?: string;
        entity?: any;
        entities?: any[];
        emptyText?: string;
        previewKey?: string | number;
    }> & Readonly<{}>, {
        id: string;
        entity: any;
        entities: any[];
        previewKey: string | number;
        emptyText: string;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
})[];
export default _default;
