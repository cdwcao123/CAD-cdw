import { Audio } from './Audio';
export class AudioAnalyser {
    
    constructor(audio: Audio<AudioNode>, fftSize?: number);

    analyser: AnalyserNode;
    data: Uint8Array;

    getFrequencyData(): Uint8Array;
    getAverageFrequency(): number;

    
    getData(file: any): any;
}
