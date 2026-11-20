export interface InternalRequestConfig extends RequestInit {
    headers: Record<string, string>;
}
export interface HttpClientOptions {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}
export interface RequestInterceptor {
    onFulfilled: (config: InternalRequestConfig) => InternalRequestConfig | Promise<InternalRequestConfig>;
    onRejected?: (error: any) => any;
}
export interface ResponseInterceptor {
    onFulfilled: (response: Response) => Response | Promise<Response>;
    onRejected?: (error: any) => any;
}
export interface Interceptors {
    request: RequestInterceptor[];
    response: ResponseInterceptor[];
}
export declare class HttpError extends Error {
    status: number;
    data: any;
    constructor(message: string, status: number, data: any);
}
export interface responseType<T> {
    info: string;
    code: number;
    data: T;
}
