import { McDbTable, McCore } from 'McCore';
import { TableStyleEditorData } from '../types/interface';
import { TableCellStyleName } from '../types/type';
export declare const createTableStylePreview: (core: McCore, baseStyleName: string, editorData?: TableStyleEditorData, focusedStyleName?: TableCellStyleName) => McDbTable;
