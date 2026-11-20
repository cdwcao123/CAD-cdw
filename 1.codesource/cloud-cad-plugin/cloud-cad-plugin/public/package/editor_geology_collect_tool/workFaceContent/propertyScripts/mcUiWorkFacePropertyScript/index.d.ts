import { BasePropertyScript } from 'McEditor';
import type { McDbWorkFaceInstance } from '@/utils/pluginApi';
export declare class WorkFacePropertyScript extends BasePropertyScript<McDbWorkFaceInstance> {
    constructor(name: string, entity: McDbWorkFaceInstance);
    private initWorkFaceGroup;
}
export default WorkFacePropertyScript;
