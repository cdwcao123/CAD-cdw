import type {
  ApiResponse,
  Drawing,
  DrawingDetailData,
  UploadedFileResult,
  UserCurrentData,
  Workspace,
} from '@/types/cloudCad';
import { md5 } from './md5';

type QueryValue = string | number | boolean | null | undefined;
type QueryRecord = Record<string, QueryValue>;

interface RequestOptions {
  method?: 'GET' | 'POST';
  query?: QueryRecord;
  form?: Record<string, unknown>;
  json?: unknown;
  headers?: Record<string, string>;
  rawBody?: BodyInit;
  timeout?: number;
}

export class CloudCadApi {
  readonly apiBase: string;
  readonly mcdConvertApi: string;
  private readonly timeout: number;
  private token = '';

  constructor(apiBase: string, mcdConvertApi: string, timeout = 60_000) {
    this.apiBase = apiBase.replace(/\/$/, '');
    this.mcdConvertApi = mcdConvertApi.replace(/\/$/, '');
    this.timeout = timeout;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  absoluteUrl(path: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  async login(account: string, password: string): Promise<string> {
    const body = new URLSearchParams({
      username: account.trim(),
      password: md5(password),
      checkCode: '',
      verificationCode: '',
    });
    const response = await this.request<ApiResponse<string>>('/User/Login', {
      method: 'POST',
      rawBody: body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const token = response.data;
    if (!token) throw new Error(response.info || '登录接口未返回 token');
    this.setToken(token);
    return token;
  }

  async getCurrentUser(): Promise<UserCurrentData> {
    const response = await this.request<ApiResponse<UserCurrentData>>('/User/Current');
    return response.data;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.request<ApiResponse<Workspace[]>>(
      '/XAYL_WebCad/GisWebcadArea/GetList',
    );
    return response.data ?? [];
  }

  async getDrawings(areaId: string, mapName = ''): Promise<Drawing[]> {
    const response = await this.request<ApiResponse<Drawing[]>>(
      '/XAYL_WebCad/GisWebcadMapMain/GetList',
      {
        query: {
          queryJson: JSON.stringify({ MapName: mapName.trim(), AreaID: areaId }),
        },
      },
    );
    return response.data ?? [];
  }

  async getDrawingDetail(drawingId: string): Promise<Drawing> {
    const response = await this.request<ApiResponse<DrawingDetailData>>(
      '/XAYL_WebCad/GisWebcadMapMain/GetForm',
      { query: { keyValue: drawingId } },
    );
    const drawing = response.data?.gis_webcad_map_main;
    if (!drawing?.ID) throw new Error(response.info || '图纸不存在或已被删除');
    return drawing;
  }

  async uploadFileBase64(
    areaCode: string,
    fileBase64: string,
    fileType: string,
    mapType: 0 | 1,
  ): Promise<UploadedFileResult> {
    const response = await this.request<ApiResponse<string>>(
      '/XAYL_WebCad/GisWebcadMapHistory/UploadFile',
      {
        method: 'POST',
        form: {
          AreaCode: areaCode,
          FileBase64: fileBase64,
          FileType: fileType.replace(/^\./, '').toLowerCase(),
          MapType: String(mapType),
        },
        timeout: 180_000,
      },
    );
    if (!response.data) throw new Error(response.info || '文件上传失败');
    return {
      path: response.data,
      contentType: mapType === 0 ? 'image' : 'drawing',
      fileType: fileType.replace(/^\./, '').toLowerCase(),
    };
  }

  async exportThumbnail(file: File): Promise<Blob> {
    const form = new FormData();
    form.append('in_file', file, file.name);
    const response = await fetch(
      `${this.mcdConvertApi}/CloudCad/file/export?outformat=2&pwidth=320&pheight=200`,
      {
        method: 'POST',
        headers: this.authHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
        body: form,
        signal: AbortSignal.timeout(120_000),
      },
    );
    if (!response.ok) {
      throw new Error(`缩略图服务返回 HTTP ${response.status}`);
    }
    return response.blob();
  }

  async saveDrawing(payload: Record<string, unknown>): Promise<string> {
    const response = await this.request<ApiResponse<string>>(
      '/XAYL_WebCad/GisWebcadMapMain/SaveForm',
      { method: 'POST', form: payload },
    );
    return response.data;
  }

  async saveMapVersion(payload: Record<string, unknown>): Promise<string> {
    const response = await this.request<ApiResponse<string>>(
      '/XAYL_WebCad/GisWebcadMapHistory/SaveForm',
      { method: 'POST', form: payload },
    );
    return response.data;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const query = options.query ? toQueryString(options.query) : '';
    const url = `${this.apiBase}${path}${query ? `?${query}` : ''}`;
    let body: BodyInit | undefined = options.rawBody;
    const headers = this.authHeaders(options.headers);

    if (options.form) {
      body = toFormData(options.form);
    } else if (options.json !== undefined) {
      body = JSON.stringify(options.json);
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timer = window.setTimeout(
      () => controller.abort(),
      options.timeout ?? this.timeout,
    );
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') ?? '';
      const text = await response.text();
      let parsed: unknown = text;
      if (contentType.includes('json') && text) {
        parsed = JSON.parse(text);
      }
      if (!response.ok) {
        const message =
          isRecord(parsed) && typeof parsed.info === 'string'
            ? parsed.info
            : `请求失败（HTTP ${response.status}）`;
        throw new Error(message);
      }
      if (!isRecord(parsed)) {
        throw new Error('服务端返回了无法识别的数据');
      }
      const apiResponse = parsed as unknown as ApiResponse<T>;
      if (apiResponse.code !== 200) {
        throw new Error(apiResponse.info || apiResponse.message || '业务请求失败');
      }
      return apiResponse as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('请求超时，请检查内网连接和服务状态');
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  private authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return {
      Accept: 'application/json, text/plain, */*',
      ...(this.token ? { token: this.token } : {}),
      ...extra,
    };
  }
}

function toFormData(values: Record<string, unknown>): FormData {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'object' && !(value instanceof Blob)) {
      form.append(key, JSON.stringify(value));
      return;
    }
    form.append(key, String(value));
  });
  return form;
}

function toQueryString(values: QueryRecord): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    params.set(key, String(value));
  });
  return params.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

