export class MessageBuffer {
  private bytes: Uint8Array;

  private constructor(bytes: Uint8Array) {
    this.bytes = bytes;
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
    return new Uint8Array(this.bytes);
  }

  toHexString(): string {
    return Array.from(this.bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  toBase64(): string {
    let binary = "";
    for (let i = 0; i < this.bytes.length; i++) {
      binary += String.fromCharCode(this.bytes[i]);
    }
    return btoa(binary);
  }

  toString(): string {
    return new TextDecoder().decode(this.bytes);
  }

  get length(): number {
    return this.bytes.length;
  }

  concat(other: MessageBuffer): MessageBuffer {
    const result = new Uint8Array(this.bytes.length + other.bytes.length);
    result.set(this.bytes);
    result.set(other.bytes, this.bytes.length);
    return new MessageBuffer(result);
  }

  clone(): MessageBuffer {
    return new MessageBuffer(new Uint8Array(this.bytes));
  }

  slice(start: number, end?: number): MessageBuffer {
    return new MessageBuffer(this.bytes.slice(start, end));
  }
}
