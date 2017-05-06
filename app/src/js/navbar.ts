$('.bottombar .link.popup').on('click', e => {
    const target = e.target as HTMLElement;
    target.parentElement.parentElement.querySelector('div.popup').classList.toggle('active');
    document.querySelector('.topbar').classList.toggle('no-drag');
    document.querySelector('.tabs').classList.toggle('no-drag');
});

document.addEventListener('mousedown', e => {
    const target = e.target as HTMLElement;

    if (target !== document.querySelector('.link.popup') && !document.querySelector('.link.popup').contains(target)) {
        document.querySelector('div.popup').classList.remove('active');
        document.querySelector('.topbar').classList.remove('no-drag');
        document.querySelector('.tabs').classList.remove('no-drag');
    }
});