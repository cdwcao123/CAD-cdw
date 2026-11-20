import { BasePropertyScript } from 'McEditor';
import type { McDbWorkFaceInstance } from '@/utils/pluginApi';
type McDbWorkFace = McDbWorkFaceInstance;
export declare class WorkFacePropertyScript extends BasePropertyScript<McDbWorkFace> {
    constructor(name: string, entity: McDbWorkFace);
    private initWorkFaceGroup;
}
export default WorkFacePropertyScript;
