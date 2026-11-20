import { McEventReactor } from '../mc/mcEventReactor';
import { CmdLineInputType } from './types/enum';
import { McPrCommandLineEventType } from './types/type';
export declare class McPrCommandLine extends McEventReactor<McPrCommandLineEventType> {
    #private;
    historyMax: number;
    constructor();
    sendDataToCmdLine(msg: string, keyWords?: Map<string, string>, defValue?: any, inputVerifyFn?: Function): void;
    listenFromCmdLine(callBack: (type: CmdLineInputType, data?: any) => void): void;
    offListenFromCmdLine(callBack: (type: CmdLineInputType, data?: any) => void): void;
    sendCmdLineDataToCore(type: CmdLineInputType, data?: any): void;
    print(vl: string): void;
    getHistory(): string[];
}
