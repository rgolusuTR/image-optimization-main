declare module 'upng-js' {
    export function encode(imgs: ArrayBuffer[], w: number, h: number, cnum: number, dels?: number[]): ArrayBuffer;
    export function encodeLL(imgs: ArrayBuffer[], w: number, h: number, cc: number, ac: number, depth: number, dels?: number[]): ArrayBuffer;
    export function decode(buff: ArrayBuffer): any;
    export function toRGBA8(out: any): ArrayBuffer[];
}
