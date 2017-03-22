const data = window.location.search.replace("?", "").split('&');

const errorUrl = data['url']
const code = data['code']
const desc = data['desc']

document.querySelector('.url').textContent = errorUrl;
document.querySelector('.code').textContent = code;
document.querySelector('.desc').textContent = desc;