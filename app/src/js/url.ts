import * as normalizeUrl from 'normalize-url';
import * as webview from './webview';
import * as settings from '../settings';

let searching = false;
let searchURL: any;
let suggestionsURL: any;

$('.bottombar .navigation .url').on('keydown', (e: any) => {
    if (e.keyCode === 9) {
        e.preventDefault();

        if (!searching) {
            const url = normalizeUrl($('.bottombar .navigation .url').text());
            const http = new XMLHttpRequest();
            http.open('GET', url);
            http.onreadystatechange = function () {
                if (this.readyState == this.DONE) {
                    if (this.status === 200) {
                        searchInUrl(this.response);
                    }
                }
            };
            http.send();
        }
    }

    if (e.keyCode === 8 && searching && $('.bottombar .navigation .url').text() === '') {
        $('.bottombar .navigation .searchOn').remove();
        $('.bottombar .navigation input.info, .bottombar .navigation input.secure, .bottombar .navigation input.mybrowser').removeClass('hide');
        searching = false;
    }
});

$('.bottombar .navigation .url').on('awesomplete-select', (e: any) => {
    if (searching) {
        e.preventDefault();

        const input = $('.bottombar .navigation .url').text().replace(settings.selectedSearchEngine.searchUrl, '');
        let url = searchURL;

        url = url.replace(/{searchTerms}/g, input);
        url = url.replace(/&(\w*)={(\w*)\?}/g, '');

        console.log(input);

        $('.navigation .url').html(url);
        (document.querySelector('.page.active') as any).loadURL(url);

        webview.onNavigating();

        $('.bottombar .navigation .searchOn').remove();
        $('.bottombar .navigation input.info, .bottombar .navigation input.secure, .bottombar .navigation input.mybrowser').removeClass('hide');
        $('.bottombar .navigation #autocomplete').attr('hidden', '');
        $('.bottombar .navigation #autocomplete').html('');
        searching = false;
    }
});

$('.bottombar .navigation .url').on('input', getSuggestionsSearch);

export function styleUrl() {
    const url = $('.bottombar .navigation .url').text()
    // const protocolRegExp = /.*?(?:\/\/)/i;
    // const domainRegExp = /(?!.*(?:\/\/)).*$/i;
    // const queryRegExp = /\/?(.*)/i;

    // const protocol = protocolRegExp.exec(url).toString();
    // const domain = domainRegExp.exec(url).toString();
    // const query = queryRegExp.exec(url).toString();

    const parser = document.createElement('a');
    const tld = require('tldjs');
    parser.href = url;

    if (parser.protocol === 'mybrowser:') {
        const protocol = 'mybrowser';
        const domain = url.replace(protocol, '').replace('://', '');

        $('.bottombar .navigation .url').html(`<span class="protocol">${protocol}</span><span class="backslash">://</span>${domain}`);
        $('.bottombar .navigation .url').removeClass('secure');
        // $('.bottombar .navigation .url').addClass('mybrowser');
        $('.bottombar .navigation .mybrowser').show();
        $('.bottombar .navigation .info').hide();
        $('.bottombar .navigation input.secure').hide();
    } else {
        const protocol = parser.protocol.replace(':', '');
        const domain = tld.getDomain(parser.hostname);
        const subdomain = tld.getSubdomain(parser.hostname) !== '' ? tld.getSubdomain(parser.hostname) + `.` : '';
        const port = parser.port;
        const path = parser.pathname;
        const query = parser.search;

        $('.bottombar .navigation .url').html(`<span class="protocol">${protocol}</span><span class="backslash">://</span><span class="subdomain">${subdomain}</span>${domain}<span class="port">${port !== '' ? ':' + port : ''}</span><span class="path">${path}</span><span class="query">${query}</span>`);
        $('.bottombar .navigation .mybrowser').hide();
        $('.bottombar .navigation .info').show();
    }

    parser.remove();
}

export function isSecure() {
    const url = $('.bottombar .navigation .url').text()

    if (url.startsWith('https://')) {
        $('input.secure').show();
        $('input.secure').css('color', '#249654');
        $('.url').addClass('secure');
    } else {
        $('input.secure').hide();
        $('.url').removeClass('secure');
    }
}

export function addListenerSearchInUrl(wv: any) {
    // wv.addEventListener('ipc-message', (e: any) => {
    //     if (e.channel === 'searchURL') {
    //         searchInUrl({ e: e })
    //     }
    // });
}

export function searchInUrl(head: any) {
    const hostname = $('.bottombar .navigation .url').text();

    let url: string = null;
    let suggestions: any = null;
    let description: any = null;
    const domParser = new DOMParser;
    const dom = domParser.parseFromString(head, "text/html");

    getSearchURLs(dom, (urls: any) => {
        url = urls.searchURL;
        suggestions = urls.suggestionsURL;
        description = `Search ${urls.description}` || `Search ${hostname}`;

        searching = true;
        suggestionsURL = suggestions;
        searchURL = url;

        $('.bottombar .navigation .url').before(`<span class="searchOn">${description}</span>`);
        $('.bottombar .navigation input.info, .bottombar .navigation input.secure, .bottombar .navigation input.mybrowser').addClass('hide');
        $('.bottombar .navigation #autocomplete').attr('hidden', '');
        $('.bottombar .navigation .url').html('');
    });
}

export function getSuggestionsSearch() {
    if (searching) {
        const input = $('.bottombar .navigation .url').text();

        let url = searchURL;
        let suggestions = suggestionsURL;

        if ((suggestions !== null) && (suggestions !== undefined)) {
            suggestions = suggestions.replace(/{searchTerms}/g, input);

            get(suggestions, (data: any) => {
                let suggestions = JSON.parse(data);

                suggestions = suggestions[1];
                suggestions.unshift(input);

                suggestions.forEach((item: any) => {
                    const li = document.createElement('li');
                    li.innerHTML = item;
                    document.querySelector('#autocomplete').appendChild(li);
                });
            });
        }

        url = url.replace(/{searchTerms}/g, input);
        url = url.replace(/&(\w*)={(\w*)\?}/g, '');
    }
}

export function getSearchURLs(doc: any, callback: any) {
    const xmlURL = doc.head.querySelector('link[type="application/opensearchdescription+xml"]').getAttribute('href');

    if (xmlURL.length > 0) {
        const xhr = new XMLHttpRequest();
        if (xmlURL.startsWith('http')) {
            xhr.open("GET", xmlURL, true);
        } else {
            const url = normalizeUrl($('.bottombar .navigation .url').text());
            if (xmlURL.startsWith('.')) {
                xmlURL.replace('.', '')
            }
            xhr.open("GET", url + xmlURL, true);
        }

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    const xml = xhr.responseXML;

                    const searchURL = xml.querySelector("Url:not([rel=\"suggestions\"])").getAttribute("template");
                    let suggestionsURL: any = xml.querySelector("Url[rel=\"suggestions\"]")
                    if (suggestionsURL !== null) {
                        suggestionsURL = suggestionsURL.getAttribute("template");
                    } else {
                        suggestionsURL = xml.querySelector("Url[type=\"application/x-suggestions+json\"]");
                        if (suggestionsURL !== null) {
                            suggestionsURL = suggestionsURL.getAttribute('template');
                        }
                    }
                    const description = xml.getElementsByTagName("ShortName")[0].textContent;

                    callback({ searchURL: searchURL, description: description, suggestionsURL: suggestionsURL });
                }
            }
        }

        xhr.send();
    }
}

function get(url: string, callback: any) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                callback(xhr.response);
            }
        }
    }

    xhr.send();
}

module.exports.styleUrl = styleUrl;
module.exports.isSecure = isSecure;
module.exports.searchInUrl = searchInUrl;
module.exports.addListenerSearchInUrl = addListenerSearchInUrl;