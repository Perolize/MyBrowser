import * as tld from 'tldjs';

export function requestPermission(permission: string, site: string) {
    return new Promise((fulfill, reject) => {
        permission = permission.charAt(0).toUpperCase() + permission.slice(1);
        site = tld.getDomain(site);

        $('.permission h1').html(permission);
        $('.permission p span.website').html(site);
        switch (permission.toLowerCase()) {
            case 'fullscreen':
                $('.permission p span.perm').html('maximize window');
                break;
            case 'notifications':
                $('.permission p span.perm').html('send notifications');
                break;
            case 'geolocation':
                $('.permission p span.perm').html('use your location');
        }
        $('.permission').css('left', '0');

        $('.permission .btns .btn:not(.allow)').on('click', () => {
            fulfill(false);
        });

        $('.permission .btns .btn.allow').on('click', () => {
            fulfill(true);
        });
    });
}

$('.permission .btns .btn').on('click', () => {
    $('.permission').css('left', '');
});

// $(document).ready(() => {
//     requestPermission('Notifications', 'youtube.com');
// });

module.exports.requestPermission = requestPermission;