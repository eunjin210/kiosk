export type SerialPort = {
  open: (options: { baudRate: number }) => Promise<void>;
  writable: WritableStream<Uint8Array>;
  readable: ReadableStream<Uint8Array>;
  close: () => Promise<void>;
};

export let port: SerialPort | null = null;
export let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
export let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

export function setSerialPort(
  _port: SerialPort,
  _writer: WritableStreamDefaultWriter<Uint8Array>,
  _reader?: ReadableStreamDefaultReader<Uint8Array>
) {
  port = _port;
  writer = _writer;
  reader = _reader ?? null;
}
