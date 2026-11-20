import { Object3D } from './../core/Object3D';
import { AudioListener } from './AudioListener';
import { AudioContext } from './AudioContext';

export class Audio<NodeType extends AudioNode = GainNode> extends Object3D {
    constructor(listener: AudioListener);
    type: 'Audio';

    listener: AudioListener;
    context: AudioContext;
    gain: GainNode;

    
    autoplay: boolean;
    buffer: null | AudioBuffer;

    
    detune: number;

    
    loop: boolean;

    
    loopStart: number;

    
    loopEnd: number;

    
    offset: number;

    
    duration: number | undefined;

    
    playbackRate: number;

    
    isPlaying: boolean;

    
    hasPlaybackControl: boolean;

    
    sourceType: string;
    source: null | AudioBufferSourceNode;

    
    filters: AudioNode[];

    getOutput(): NodeType;
    setNodeSource(audioNode: AudioBufferSourceNode): this;
    setMediaElementSource(mediaElement: HTMLMediaElement): this;
    setMediaStreamSource(mediaStream: MediaStream): this;
    setBuffer(audioBuffer: AudioBuffer): this;
    play(delay?: number): this;
    onEnded(): void;
    pause(): this;
    stop(): this;
    connect(): this;
    disconnect(): this;
    setDetune(value: number): this;
    getDetune(): number;
    getFilters(): AudioNode[];
    setFilters(value: AudioNode[]): this;
    getFilter(): AudioNode;
    setFilter(filter: AudioNode): this;
    setPlaybackRate(value: number): this;
    getPlaybackRate(): number;
    getLoop(): boolean;
    setLoop(value: boolean): this;
    setLoopStart(value: number): this;
    setLoopEnd(value: number): this;
    getVolume(): number;
    setVolume(value: number): this;
    
    load(file: string): Audio;
}
