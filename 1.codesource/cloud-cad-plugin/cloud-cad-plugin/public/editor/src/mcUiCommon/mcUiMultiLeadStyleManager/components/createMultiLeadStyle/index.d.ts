import { SegmentAngleType, LeaderType, ContentType, BlockConnectionType, McDbMLeaderStyle, TextAttachmentType } from 'McCore';
import { blockDefNameList, buildBlockDefNameOptions, isUserDefinedBlockDefName, openSelectUserBlockDialog } from './mLeaderBlockSource';
declare const segmentAngleTypeList: {
    label: string;
    value: SegmentAngleType;
}[];
declare const leaderTypeList: {
    label: string;
    value: LeaderType;
}[];
declare const contentTypeList: {
    label: string;
    value: ContentType;
}[];
declare const blockConnectionTypeList: {
    label: string;
    value: BlockConnectionType;
}[];
declare const textAttachmentTypeList: {
    label: string;
    value: TextAttachmentType;
}[];
declare function cloneMLeaderDetailsData<T>(value: T): T;
declare function getMLeaderDetailsSignature(value: any): string;
declare function cloneMLeaderStyleRecord(style?: McDbMLeaderStyle | null): McDbMLeaderStyle;
declare function applyDetailsToMLeaderStyle(details: any, mLeaderStyle: McDbMLeaderStyle): void;
declare function mLeaderStyleToDetails(mLeaderStyle: McDbMLeaderStyle | any): any;
export { segmentAngleTypeList, leaderTypeList, contentTypeList, blockConnectionTypeList, textAttachmentTypeList, blockDefNameList, buildBlockDefNameOptions, isUserDefinedBlockDefName, openSelectUserBlockDialog, applyDetailsToMLeaderStyle, mLeaderStyleToDetails, cloneMLeaderDetailsData, getMLeaderDetailsSignature, cloneMLeaderStyleRecord };
