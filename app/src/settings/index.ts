import * as storage from 'electron-storage';
import * as searchEngines from './searchEngines';
import { getSettings, saveSettings } from '../utils/settings';
let settingsBase = require('./settings.json');
let settings = settingsBase;

storage.isPathExists('settings.json')
    .then((itDoes: any) => {
        if (itDoes) {
            getSettings()
                .then((data: any) => {
                    settings = data;
                });
        } else {
            saveSettings(settingsBase, () => {
                console.log('Settings was successfully written to the storage');
            });
        }
    });

export const selectedSearchEngine = searchEngines[settings.searchEngine];

module.exports.selectedSearchEngine = selectedSearchEngine;