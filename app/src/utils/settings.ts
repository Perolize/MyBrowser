import * as storage from 'electron-storage';

export function getSettings(callback: any = undefined) {
   return storage.get('settings.json')
}

export function saveSettings(newSettings: any, callback: any = undefined, error: any = undefined) {
    storage.set('settings.json', newSettings)
        .then(() => {
            if (callback === undefined) {
                return;
            }
            callback();
        })
        .catch((err: any) => {
            if(error === undefined) {
                console.error(err);
                return;
            }
            error(err);
        });
}

module.exports.getSettings = getSettings;
module.exports.saveSettings = saveSettings;