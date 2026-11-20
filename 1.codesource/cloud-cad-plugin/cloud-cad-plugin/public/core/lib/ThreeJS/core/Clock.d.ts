
export class Clock {
    
    constructor(autoStart?: boolean);

    
    autoStart: boolean;

    
    startTime: number;

    
    oldTime: number;

    
    elapsedTime: number;

    
    running: boolean;

    
    start(): void;

    
    stop(): void;

    
    getElapsedTime(): number;

    
    getDelta(): number;
}
