export class MessageBuffer {
  private _bytes: Uint8Array;

  private constructor(bytes: Uint8Array) {
    this._bytes = bytes;
  }

  static fromString(str: string): MessageBuffer {
    return new MessageBuffer(new TextEncoder().encode(str));
  }

  static fromBytes(bytes: Uint8Array): MessageBuffer {
    return new MessageBuffer(new Uint8Array(bytes));
  }

  static fromHex(hex: string): MessageBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
    }
    return new MessageBuffer(bytes);
  }

  static fromBase64(b64: string): MessageBuffer {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new MessageBuffer(bytes);
  }

  static random(nBytes: number): MessageBuffer {
    return new MessageBuffer(crypto.getRandomValues(new Uint8Array(nBytes)));
  }

  toBytes(): Uint8Array {
    return new Uint8Array(this._bytes);
  }

  toHexString(): string {
    return Array.from(this._bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  toBase64(): string {
    let binary = "";
    for (let i = 0; i < this._bytes.length; i++) {
      binary += String.fromCharCode(this._bytes[i]);
    }
    return btoa(binary);
  }

  toString(): string {
    return new TextDecoder().decode(this._bytes);
  }

  get length(): number {
    return this._bytes.length;
  }

  concat(other: MessageBuffer): MessageBuffer {
    const result = new Uint8Array(this._bytes.length + other._bytes.length);
    result.set(this._bytes);
    result.set(other._bytes, this._bytes.length);
    return new MessageBuffer(result);
  }

  clone(): MessageBuffer {
    return new MessageBuffer(new Uint8Array(this._bytes));
  }

  slice(start: number, end?: number): MessageBuffer {
    return new MessageBuffer(this._bytes.slice(start, end));
  }
}
