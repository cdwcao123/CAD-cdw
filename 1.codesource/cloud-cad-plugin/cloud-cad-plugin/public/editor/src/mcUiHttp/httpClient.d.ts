import { HttpClientOptions, RequestInterceptor, ResponseInterceptor } from './types/interface';
export declare class AdvancedHttpClient {
    private baseURL;
    private readonly timeout;
    private readonly defaultHeaders;
    private readonly interceptors;
    constructor(options?: Partial<HttpClientOptions>);
    setBaseUrl(url: string): void;
    addRequestInterceptor(onFulfilled: RequestInterceptor['onFulfilled'], onRejected?: RequestInterceptor['onRejected']): void;
    addResponseInterceptor(onFulfilled: ResponseInterceptor['onFulfilled'], onRejected?: ResponseInterceptor['onRejected']): void;
    private _request;
    get<T = any>(endpoint: string, params?: Record<string, string | number>, options?: RequestInit): Promise<T>;
    post<T = any>(endpoint: string, body?: BodyInit | Record<string, any>, options?: RequestInit): Promise<T>;
    put<T = any>(endpoint: string, body?: BodyInit | Record<string, any>, options?: RequestInit): Promise<T>;
    patch<T = any>(endpoint: string, body?: BodyInit | Record<string, any>, options?: RequestInit): Promise<T>;
    delete<T = any>(endpoint: string, options?: RequestInit): Promise<T>;
}
