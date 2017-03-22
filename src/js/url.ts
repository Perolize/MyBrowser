



export function styleUrl() {
    const url = $('.bottombar .navigation .url').text()
    // const protocolRegExp = /.*?(?:\/\/)/i;
    // const domainRegExp = /(?!.*(?:\/\/)).*$/i;
    // const queryRegExp = /\/?(.*)/i;

    // const protocol = protocolRegExp.exec(url).toString();
    // const domain = domainRegExp.exec(url).toString();
    // const query = queryRegExp.exec(url).toString();

    const parser = document.createElement('a');
    parser.href = url;

    if (parser.protocol === 'mybrowser:') {
        const protocol = 'mybrowser:';
        const domain = url.replace(protocol, '').replace('//', '');

        $('.bottombar .navigation .url').html(`<span class="protocol">${protocol}</span><span class="backslash">//</span>${domain}`);
        $('.bottombar .navigation .url').removeClass('secure');
        // $('.bottombar .navigation .url').addClass('mybrowser');
        $('.bottombar .navigation .mybrowser').show();
        $('.bottombar .navigation .info').hide();
        $('.bottombar .navigation input.secure').hide();
    } else {
        const protocol = parser.protocol;
        const domainParts = parser.hostname.split('.');
        let subdomain;
        if(domainParts.length > 2) {
            subdomain = domainParts.shift() + '.';
        } else {
            subdomain = '';
        }
        const domain = domainParts.join('.');
        const port = parser.port;
        const path = parser.pathname;
        const query = parser.search;

        $('.bottombar .navigation .url').html(`<span class="protocol">${protocol}</span><span class="backslash">//</span><span class="subdomain">${subdomain}</span>${domain}<span class="port">${port}</span><span class="path">${path}</span><span class="query">${query}</span>`);
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

module.exports.styleUrl = styleUrl;
module.exports.isSecure = isSecure;