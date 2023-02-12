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

function connect() {
    let userDeviceId = dropdown.value;
    let constraints = {audio: {deviceId: {exact: userDeviceId}}};

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            console.log(stream);
        })
        .catch((err) => {
            console.error('Error accessing device: ' + err);
        })
}