class AudioWorkletStream extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.port.onmessage = (e) => {
      this.writable = e.data;
      this.writer = this.writable.getWriter();
      this.port.postMessage('stream');
    };
  }
  process(inputs, outputs) {
    const channels = inputs.flat().reduce((f32, channel, index) => (f32.set(channel, !index ? index : 128), f32), new Float32Array(256));
    this.writer.write(channels);
    return true;
  }
};

registerProcessor(
  'audio-worklet-stream',
  AudioWorkletStream
);