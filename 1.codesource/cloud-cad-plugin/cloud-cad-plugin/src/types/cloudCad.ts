import type { McEditor } from 'McEditor';

export interface CloudCadRuntimeConfig {
  apiBase: string;
  mcdConvertApi: string;
  systemUrl: string;
  assetsPath?: string;
  coreAssetsPath?: string;
  reuseSystemToken?: boolean;
  requestTimeout?: number;
}

export interface ApiResponse<T> {
  code: number;
  info?: string;
  message?: string;
  data: T;
}

export interface Workspace {
  ID: string;
  AreaName: string;
  AreaCode: string;
  AreaDesc?: string | null;
  OwnerCompanyId?: string | null;
}

export interface DrawingVersion {
  ID?: string;
  ParentID?: string;
  VersionNumber?: number;
  DxfFileId?: string;
  MasFileId?: string;
  LayerStyle?: string | null;
  VersionDesc?: string | null;
  [key: string]: unknown;
}

export interface Drawing {
  ID: string;
  MapName: string;
  AreaID: string;
  CurMapVersionId?: string | null;
  ThumbnailField?: string | null;
  MapOptions?: string | null;
  BaseMapVersionInfo?: DrawingVersion;
  Field1?: string | null;
  Field2?: string | null;
  Field3?: string | null;
  Field4?: string | null;
  CreateUserId?: string | null;
  CreateUserId_Text?: string | null;
  CreateCompanyId?: string | null;
  CreateDepartmentId?: string | null;
  CreateDataTime?: string | null;
  [key: string]: unknown;
}

export interface DrawingDetailData {
  gis_webcad_map_main: Drawing;
}

export interface UserBaseInfo {
  F_Account?: string;
  F_RealName?: string;
  [key: string]: unknown;
}

export interface UserCurrentData {
  baseinfo?: UserBaseInfo;
}

export interface UploadedFileResult {
  path: string;
  contentType: string;
  fileType: string;
}

export interface PluginContext {
  editor: McEditor | undefined;
  workspace: Workspace | undefined;
  drawing: Drawing | undefined;
}

