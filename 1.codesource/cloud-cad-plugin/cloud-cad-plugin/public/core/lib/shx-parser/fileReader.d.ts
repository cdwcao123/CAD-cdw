export declare class ShxFileReader {
    private position;
    private data;
    static byteToSByte(value: number): number;
    constructor(arraybuffer: ArrayBuffer);
    readBytes(length?: number): Uint8Array;
    skip(length: number): void;
    readUint8(): number;
    readInt8(): number;
    readUint16(littleEndian?: boolean): number;
    readInt16(): number;
    readUint32(): number;
    readInt32(): number;
    readFloat32(): number;
    readFloat64(): number;
    setPosition(position: number): void;
    isEnd(): boolean;
    get currentPosition(): number;
    get length(): number;
    private throwOutOfRangeError;
}
