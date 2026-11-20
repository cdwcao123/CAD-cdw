export interface BaseEvent {
    type: string;
}

export interface Event extends BaseEvent {
    target?: any;
    [attachment: string]: any;
}
export type EventListener<E, T, U> = (event: E & { type: T } & { target: U }) => void;

export class EventDispatcher<E extends BaseEvent = Event> {
    
    constructor();

    
    addEventListener<T extends E['type']>(type: T, listener: EventListener<E, T, this>): void;

    
    hasEventListener<T extends E['type']>(type: T, listener: EventListener<E, T, this>): boolean;

    
    removeEventListener<T extends E['type']>(type: T, listener: EventListener<E, T, this>): void;

    
    dispatchEvent(event: E): void;
}
