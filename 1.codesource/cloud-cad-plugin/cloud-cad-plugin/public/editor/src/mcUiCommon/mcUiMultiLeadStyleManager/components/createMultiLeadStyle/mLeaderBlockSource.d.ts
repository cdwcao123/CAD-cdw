export type BlockDefNameOption = {
    label: string;
    value: string;
};
declare const blockDefNameList: BlockDefNameOption[];
declare const isPresetBlockDefName: (blockDefName?: string) => boolean;
declare const isUserDefinedBlockDefName: (blockDefName?: string) => boolean;
declare const buildBlockDefNameOptions: (currentBlockName?: string) => BlockDefNameOption[];
declare const openSelectUserBlockDialog: (currentBlockName?: string) => Promise<string>;
export { blockDefNameList, buildBlockDefNameOptions, isPresetBlockDefName, isUserDefinedBlockDefName, openSelectUserBlockDialog, };
