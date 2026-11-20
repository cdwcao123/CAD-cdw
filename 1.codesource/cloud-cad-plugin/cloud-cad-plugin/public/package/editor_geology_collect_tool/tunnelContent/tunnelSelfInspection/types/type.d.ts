export interface DialogData {
    cancel?: () => void;
    rename?: () => void;
    recode?: () => void;
}
export interface NamedItem {
    id: string;
    name: string;
    typeCode: string;
}
