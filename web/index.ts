window.addEventListener('DOMContentLoaded', (event) => {
    const dropdown = document.getElementById('select');

    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            if (device.kind === 'audioinput') {
                let option = '<option value="'+ device.deviceId + '" >' + device.label + '</option>';

                if (dropdown) {
                    dropdown.insertAdjacentHTML('beforeend', option);
                }
            }
        })
    })
    .catch(function(err) {
        console.log(err.name + ': ' + err.message);
    });
})
