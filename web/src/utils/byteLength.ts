const encoder = new TextEncoder();

export const byteLength = (value: string): number => encoder.encode(value).length;
