import { McDbObject } from '../../mcDb';
import { McGeObject, McGeVector3 } from '../../mcGe';
import { McGsDashLine } from '../../mcGs';
import { MTextToken } from '../../../lib/mtext-parser/parser';
import { McPrDrawRender } from '../mcPrDrawRender';
import { CmdLineInputType } from './enum';
import { McPrResultStatus } from './interface';
type McPrWorldDrawFun = (point: McGeVector3, prDrawRender: McPrDrawRender, data?: any) => void;
type McPrBaseResolve = (result: McPrResultStatus) => void;
type McPrBaseReject = (result: McPrResultStatus) => void;
type McPrEntityFilterFun = (objects: McDbObject[]) => McDbObject[];
type McPrCommandLineEventType = {
    outputToCmdLine: (msg: string, keyWords?: Map<string, string>, defValue?: any, verifyFn?: Function) => void;
    cmdLineInput: (type: CmdLineInputType, data?: any) => void;
    cmdLineHistoryChanged: (history: string[]) => void;
};
type McMTextToken = {
    text: string;
    tokens: MTextToken[];
    charCount: number;
};
type McPrSnapResult = {
    point: McGeVector3;
    distance: number;
    geObject: McGeObject;
    name: string;
    line?: McGsDashLine;
};
export type { McPrWorldDrawFun, McPrBaseReject, McPrBaseResolve, McPrCommandLineEventType, McMTextToken, McPrSnapResult, McPrEntityFilterFun, };
