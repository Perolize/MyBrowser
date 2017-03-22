class SearchEngine {
    constructor(private name: String, private home: String, private searchUrl: String) {
        this.name = name;
        this.home = home;
        this.searchUrl = searchUrl;
    }

    search(input:String) {
        return `${this.searchUrl}${input}`;
    }
}

export const Google = new SearchEngine('Google', 'https://google.com', 'https://google.com/?q=');
export const DuckDuckGo = new SearchEngine('DuckDuckGo', 'https://duckduckgo.com', 'https://duckduckgo.com?q=');