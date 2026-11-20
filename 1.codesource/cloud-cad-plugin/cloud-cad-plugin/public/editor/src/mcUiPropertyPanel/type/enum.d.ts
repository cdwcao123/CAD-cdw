export declare enum ControlType {
    INPUT = "input",
    SELECT = "select",
    CHECKBOX = "checkbox",
    TEXTAREA = "textarea",
    NUMBER = "number",
    COORDINATE = "coordinate",
    ANGLE = "angle",
    DATE = "date",
    COLOR_PICKER = "colorPicker",
    COLOR = "color",
    LINE_WEIGHT = "lineWeight",
    LINE_TYPE = "lineType",
    BUTTON = "button",
    MLEADER_BLOCK_SELECT = "mLeaderBlockSelect",
    INPUT_BUTTON = "inputButton"
}
export type NumberFieldSpec = {
    min?: number;
    max?: number;
    allowNegative?: boolean;
    storage?: 'float16' | 'float32' | 'double';
};
