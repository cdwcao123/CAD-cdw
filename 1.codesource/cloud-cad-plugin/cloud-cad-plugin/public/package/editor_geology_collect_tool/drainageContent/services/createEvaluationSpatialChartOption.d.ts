import type { EvaluationSpatialChartTheme, EvaluationSpatialData, EvaluationSpatialSurfaceResult, EvaluationSpatialTooltipParameter } from '../types/interface';
/**
 * 创建评价单元三维煤层与钻孔图，复用定向钻已有 ECharts GL 技术栈。
 * @param data Core API 读取的世界坐标快照，至少有一条可显示轨迹。
 * @param surfaces 当前单层煤层的插值网格；数据不足时允许仅显示轨迹及交点。
 * @param theme 当前预览容器继承的应用主题颜色。
 * @returns 按真实米值比例显示、支持图例显隐控制及旋转/缩放/平移交互的 ECharts GL 配置。
 */
export declare function createEvaluationSpatialChartOption(data: EvaluationSpatialData, surfaces: EvaluationSpatialSurfaceResult, theme: EvaluationSpatialChartTheme): {
    animation: boolean;
    backgroundColor: string;
    legend: {
        show: boolean;
        type: string;
        selectedMode: boolean;
        left: number;
        right: number;
        top: number;
        itemWidth: number;
        itemHeight: number;
        textStyle: {
            color: string;
        };
        inactiveColor: string;
        pageTextStyle: {
            color: string;
        };
        pageIconColor: string;
        pageIconInactiveColor: string;
    };
    tooltip: {
        confine: boolean;
        formatter: (parameter: EvaluationSpatialTooltipParameter) => string;
        backgroundColor: string;
        borderColor: string;
        textStyle: {
            color: string;
        };
    };
    xAxis3D: {
        axisLabel: {
            formatter: (value: number) => number;
            color: string;
            fontSize: number;
        };
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
        type: string;
        name: string;
        min: number;
        max: number;
        interval: number;
        splitNumber: number;
        nameGap: number;
    };
    yAxis3D: {
        axisLabel: {
            formatter: (value: number) => number;
            color: string;
            fontSize: number;
        };
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
        type: string;
        name: string;
        min: number;
        max: number;
        interval: number;
        splitNumber: number;
        nameGap: number;
    };
    zAxis3D: {
        nameGap: number;
        axisLabel: {
            formatter: (value: number) => number;
            color: string;
            fontSize: number;
        };
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
        type: string;
        name: string;
        min: number;
        max: number;
        interval: number;
        splitNumber: number;
    };
    grid3D: {
        top: number;
        left: number;
        right: number;
        bottom: number;
        width: string;
        height: string;
        boxWidth: number;
        boxDepth: number;
        boxHeight: number;
        viewControl: {
            projection: string;
            alpha: number;
            beta: number;
            distance: number;
            center: number[];
            minDistance: number;
            maxDistance: number;
            rotateSensitivity: number;
            zoomSensitivity: number;
            panSensitivity: number;
        };
        light: {
            main: {
                intensity: number;
                shadow: boolean;
            };
            ambient: {
                intensity: number;
            };
        };
        environment: string;
        axisPointer: {
            show: boolean;
            label: {
                show: boolean;
            };
            lineStyle: {
                color: string;
            };
        };
    };
    series: Record<string, unknown>[];
};
