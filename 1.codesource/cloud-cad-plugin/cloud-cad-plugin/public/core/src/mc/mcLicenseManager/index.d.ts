export declare enum SQStatus {
    UNVERIFIED = "0",
    VALID = "1",
    INVALID = "2",
    VERIFYING = "3"
}
export interface SQVerifyResult {
    success: boolean;
    error?: string;
    status: SQStatus;
}
export declare class McMasManager {
    private static instance;
    private sqStatus;
    private isInitialized;
    private fingerPrint;
    private heartbeatWorker;
    private readonly heartbeatIntervalMs;
    private consecutiveHeartbeatFailures;
    private readonly maxConsecutiveFailures;
    private readonly errorInfo;
    private rsaPublicKey;
    private rsaPrivateKey;
    private readonly verifyTimeoutMs;
    private verifyPromise;
    private sqAbleList;
    static getInstance(): McMasManager;
    init(): Promise<void>;
    private ensureFingerprint;
    private generateFingerPrint;
    private collectFingerprintData;
    private getCanvasFingerprint;
    private getAudioFingerprint;
    private getFontFingerprint;
    private hashFingerprintData;
    private simpleHash;
    private generateRSAKeyPairWithTimeout;
    private formatPublicKey;
    private decryptData;
    verifyLicense(): Promise<SQVerifyResult>;
    private doVerifyLicense;
    getSQStatus(): SQStatus;
    isSQValid(): boolean;
    canUseAdvancedFeatures(): string[];
    hasFeature(featureName: string): boolean;
    private initHeartbeatWorker;
    private handleWorkerMessage;
    private startHeartbeat;
    private stopHeartbeat;
    private handleHeartbeatFailure;
    destroy(): void;
}
export declare const mcSQManager: McMasManager;
