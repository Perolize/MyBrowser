const { ipcRenderer } = require('electron');

class SearchEngine {
    constructor(private name: String, private home: String, private searchUrl: String, private suggestionUrl: String) {
        this.name = name;
        this.home = home;
        this.searchUrl = searchUrl;
        this.suggestionUrl = suggestionUrl || 'https://ac.duckduckgo.com/ac?q=';
    }

    search(input: String) {
        return `${this.searchUrl}${input}`;
    }

    getSuggestions(input: string) {
        let suggestions;

        ipcRenderer.sendToHost('getSuggestions', { name: this.name, url: `${this.suggestionUrl}${input}` });
    }
}

export const Google = new SearchEngine('Google', 'https://google.com', 'https://google.com/search?q=', 'https://google.com/complete/search?client=firefox&q=');
export const DuckDuckGo = new SearchEngine('DuckDuckGo', 'https://duckduckgo.com', 'https://duckduckgo.com?q=', 'https://ac.duckduckgo.com/ac?q=');