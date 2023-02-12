const dropdown = document.getElementById('deviceSelect') as HTMLInputElement;

window.addEventListener('DOMContentLoaded', (event) => {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            if (device.kind === 'audioinput') {
                if (device.deviceId && device.label) {
                    let option = '<option value="'+ device.deviceId + '" >' + device.label + '</option>';

                    if (dropdown) {
                        dropdown.insertAdjacentHTML('beforeend', option);
                    }
                } else {
                    console.log("Invalid device");
                }
            }
        })
    })
    .catch(function(err) {
        console.log(err.name + ': ' + err.message);
    });
})

const {readable, writable} = new TransformStream();

async function connect() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const audioContext = new AudioContext();
    const source = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
    const { readable, writable } = new TransformStream();

    const reader = readable.getReader();
    reader.read().then(function processAudioStream({ value, done }): Promise<void> {
      if (done) return reader.closed;

      console.log(
        value instanceof Float32Array,
        value.length,
        value.every((float: Number) => float === 0),
        done
      );

      return reader.read().then(processAudioStream);
    });

    await audioContext.suspend();
    await audioContext.audioWorklet.addModule('audioProcessor.js');
    const audioWorklet = new AudioWorkletNode(audioContext, 'audio-worklet-stream');

    source.connect(audioWorklet);
    audioWorklet.onprocessorerror = (error) => {
      console.error(error);
      console.trace();
    };
    audioWorklet.port.onmessage = async (e) => {
      await audioContext.resume();
    };

    audioWorklet.port.postMessage(writable, [writable]);
}

