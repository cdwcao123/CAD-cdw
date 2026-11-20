import { Quaternion } from './Quaternion';

export const DEG2RAD: number;
export const RAD2DEG: number;

export function generateUUID(): string;

export function clamp(value: number, min: number, max: number): number;
export function euclideanModulo(n: number, m: number): number;

export function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;

export function smoothstep(x: number, min: number, max: number): number;

export function smootherstep(x: number, min: number, max: number): number;

export function random16(): number;

export function randInt(low: number, high: number): number;

export function randFloat(low: number, high: number): number;

export function randFloatSpread(range: number): number;

export function seededRandom(seed?: number): number;

export function degToRad(degrees: number): number;

export function radToDeg(radians: number): number;

export function isPowerOfTwo(value: number): boolean;

export function inverseLerp(x: number, y: number, t: number): number;

export function lerp(x: number, y: number, t: number): number;

export function damp(x: number, y: number, lambda: number, dt: number): number;

export function pingpong(x: number, length?: number): number;

export function nearestPowerOfTwo(value: number): number;

export function nextPowerOfTwo(value: number): number;

export function floorPowerOfTwo(value: number): number;

export function ceilPowerOfTwo(value: number): number;

export function setQuaternionFromProperEuler(q: Quaternion, a: number, b: number, c: number, order: string): void;
