import { McCore } from 'McCore';
import { McGeoModelData } from '../mcGeoModel/types/interface';
import { McDbPipeline } from '../mcPipeline/entity/mcDbPipeline';
import { McPipelineData } from '../mcPipeline/types/interface';
export declare function pipeLineToModel(pipe: McDbPipeline): McGeoModelData;
export declare function modelToPipe(modelData: McGeoModelData): McPipelineData;
export declare function drawPipeByData(core: McCore, pipeData: McPipelineData): null | undefined;
