export type TableCellCoordinate = {
    row: number;
    col: number;
};
export type TableCellEdgeName = 'top' | 'right' | 'bottom' | 'left';
export type TableEditMixedValue = '多种';
export type TableStructureRange = Pick<import('McCore').CellRange, 'minRow' | 'maxRow' | 'leftCol' | 'rightCol'>;
export type TableStructureTarget = Pick<import('McCore').McDbTable, 'getNumRows' | 'getNumColumns' | 'insertRowsAndInherit' | 'deleteRows' | 'insertColumnsAndInherit' | 'deleteColumns' | 'mergeCells' | 'unmergeCells'>;
