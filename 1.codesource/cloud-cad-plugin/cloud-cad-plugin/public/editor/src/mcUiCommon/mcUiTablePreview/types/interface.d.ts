import { McDbTable } from 'McCore';
export interface TablePreviewProps {
    entity?: McDbTable;
    entities?: McDbTable[];
    previewKey?: string | number;
    emptyText?: string;
}
