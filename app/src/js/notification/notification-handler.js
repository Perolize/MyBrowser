'use strict';

// Electron doesn't automatically show notifications in Windows yet, and it's not easy to polyfill.
// So we have to hijack the Notification API.
let ipc = require('electron').ipcRenderer;
let webviewId;
const url = require('url');

ipc.on('show', (e, notificationObj) => {
	ipc.sendToHost('open-view', notificationObj)
});

module.exports = () => {
	ipc.sendToHost('webviewId');
	ipc.on('webviewId', (e, msg) => {
		webviewId = msg;
	});

	const OldNotification = Notification;


	Notification = function (title, options) {
		// Send this to main thread.
		// Catch it in your main 'app' instance with `ipc.on`.
		// Then send it back to the view, if you want, with `event.returnValue` or `event.sender.send()`.
		if (options.icon === undefined || !options.icon.startsWith('http')) {
			if (!options.icon.startsWith('http') && options.icon !== undefined) {
				options.icon = `${window.location.origin}/${options.icon}`;
			} else {
				options.icon = getFaviconLink();
			}
		}
		options.originUrl = window.location.origin;
		options.webviewId = webviewId;
		ipc.send('notification-shim', {
			title,
			options
		});

		// Send the native Notification.
		// You can't catch it, that's why we're doing all of this. :)
		return new OldNotification(title, options);
	};

	Notification.prototype = OldNotification.prototype;
	Notification.permission = OldNotification.permission;
	Notification.requestPermission = OldNotification.requestPermission;
};


function getFaviconLink() {
	var href = window.location.href;

	var final_favicon = "";
	var elem = document.getElementsByTagName('link');
	for (var i = 0; i < elem.length; i++) {
		if (/icon/.test(elem[i].rel) == true) {
			final_favicon = elem[i].href;

			// if rel="shortcut icon" ,it should be considered first.(WTF!!)
			if (/^shortcut /.test(elem[i].rel) == true) {
				break;
			}
		}
	}

	if (final_favicon == "") {
		return null;
	} else {
		return url.resolve(href, final_favicon);
	}
}