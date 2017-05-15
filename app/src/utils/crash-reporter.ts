const { crashReporter } = require('electron');

module.exports = {
    init
}

function init() {
    crashReporter.start({
        companyName: 'Perolize',
        productName: 'MyBrowser',
        submitURL: 'https://mybrowser.perolize.com/crash-reports'
    })
}