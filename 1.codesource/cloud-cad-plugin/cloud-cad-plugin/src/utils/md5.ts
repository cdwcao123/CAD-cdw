/**
 * 计算 UTF-8 文本的 MD5。
 * 云图 CAD 的用户登录接口接收 32 位小写 MD5 密码，浏览器没有可直接使用的 MD5 API。
 */
export function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >>> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const constants = Array.from(
    { length: 64 },
    (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0,
  );

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < buffer.length; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) =>
      view.getUint32(offset + index * 4, true),
    );
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f: number;
      let wordIndex: number;
      if (index < 16) {
        f = (b & c) | (~b & d);
        wordIndex = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        wordIndex = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        wordIndex = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        wordIndex = (7 * index) % 16;
      }

      const nextD = d;
      d = c;
      c = b;
      const rotated = ((a + f + constants[index] + words[wordIndex]) >>> 0);
      b = (b + leftRotate(rotated, shifts[index])) >>> 0;
      a = nextD;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return [a0, b0, c0, d0].map(wordToLittleEndianHex).join('');
}

function leftRotate(value: number, shift: number): number {
  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

function wordToLittleEndianHex(value: number): string {
  let result = '';
  for (let index = 0; index < 4; index += 1) {
    result += ((value >>> (index * 8)) & 0xff).toString(16).padStart(2, '0');
  }
  return result;
}

