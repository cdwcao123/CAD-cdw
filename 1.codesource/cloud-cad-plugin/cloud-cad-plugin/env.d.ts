/// <reference types="vite/client" />

import type { CloudCadRuntimeConfig } from './src/types/cloudCad';
import type { McEditor } from 'McEditor';

declare global {
  interface Window {
    cloudCadPluginConfig?: Partial<CloudCadRuntimeConfig>;
    baseAPI?: string;
    mcdConvertApi?: string;
    mcEditor?: McEditor | null;
    currentWorkingAreaInfo?: {
      AreaCode: string;
      AreaName: string;
      workAreaID: string;
      drawingId: string;
    };
  }
}

export {};
