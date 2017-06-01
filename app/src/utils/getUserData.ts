import { ipcRenderer } from 'electron';

module.exports = () => {
    return new Promise((fulfill: any, reject: any) => {
        let userData: any;

        if (!userData) {
            ipcRenderer.send('userData');

            ipcRenderer.on('userData', (e: any, msg: any) => {
                userData = msg;

                fulfill(msg);
            });
        } else {
            fulfill(userData);
        }
    });
}