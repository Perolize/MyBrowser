import * as searchEngines from './searchEngines';
const settings = require('./settings.json');

export const selectedSearchEngine = searchEngines[settings.searchEngine];

module.exports.selectedSearchEngine = selectedSearchEngine;