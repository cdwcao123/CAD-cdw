export interface Tree {
    label: string;
    id?: string;
    children?: Tree[];
}
export interface LayerDeleteBlockedItem {
    id: string;
    name: string;
    reason: string;
}
export interface LayerDeleteBlockedDialogProps {
    blockedCount: number;
    selectedCount: number;
    deletableCount?: number;
}
