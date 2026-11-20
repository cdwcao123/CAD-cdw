import type { EvaluationSpatialChartTheme } from '../types/interface';
/**
 * 创建三维图表的主题样式补丁，供首次绘制和明暗切换共用。
 * @param theme 从预览容器读取的应用主题颜色。
 * @returns 背景、图例、提示框及三维坐标样式，不包含图例选中状态、系列、轴范围或相机参数。
 */
export declare function createEvaluationSpatialChartThemeOption(theme: EvaluationSpatialChartTheme): {
    backgroundColor: string;
    legend: {
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
        backgroundColor: string;
        borderColor: string;
        textStyle: {
            color: string;
        };
    };
    xAxis3D: {
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        axisLabel: {
            color: string;
            fontSize: number;
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
    };
    yAxis3D: {
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        axisLabel: {
            color: string;
            fontSize: number;
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
    };
    zAxis3D: {
        nameTextStyle: {
            color: string;
            fontSize: number;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        axisLabel: {
            color: string;
            fontSize: number;
        };
        splitLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
    };
    grid3D: {
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
};
