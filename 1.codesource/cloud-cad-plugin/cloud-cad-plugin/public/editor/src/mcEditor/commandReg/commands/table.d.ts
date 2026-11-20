import { McCore, McDbTable } from 'McCore';
import { TableEditAction } from '../../../mcUiCommon/mcUiInsertTable/tableEditorRibbon/types/enum';
import { TableBlockCellTarget } from '../../../mcUiCommon/mcUiInsertTable/tableEditorRibbon/types/interface';
import { OpenExcelLinkDialogOptions } from '../../../mcUiCommon/mcUiInsertTable/types/interface';
export declare const executeTableEdit: (core: McCore, table: McDbTable, action: TableEditAction, value?: unknown) => Promise<void>;
export declare const openExcelLinkDialog: (options?: OpenExcelLinkDialogOptions) => Promise<string>;
export declare const insertBlockToTable: (core: McCore, table: McDbTable, insertRowCols: TableBlockCellTarget[]) => Promise<void>;
