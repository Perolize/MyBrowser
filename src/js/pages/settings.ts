const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const settingsJSON = path.join(__dirname, '../../settings/settings.json');
const settings = require('../../settings/settings.json');

const mq = window.matchMedia('(max-width: 792px)');

document.querySelector('button.save').addEventListener('click', () => {
    update()
});

if (mq.matches) {
    document.querySelectorAll('.sidebar a').forEach((item: any) => {
        item.innerHTML = item.innerHTML.replace(/&nbsp;/g, '');
    });
}

window.addEventListener('resize', () => {
    if (mq.matches) {
        document.querySelectorAll('.sidebar a').forEach((item: any) => {
            item.innerHTML = item.innerHTML.replace(/&nbsp;/g, '');
        });
    } else {
        document.querySelectorAll('.sidebar a').forEach((item: any) => {
            if (!item.innerHTML.includes('&nbsp;')) {
                const nbsp = document.createTextNode(String.fromCharCode(160));
                item.insertBefore(nbsp, item.querySelector('span'))
            }
        });
    }
});

document.querySelectorAll('.sidebar a').forEach((item: any) => {
    $(item).on('click', (e: any) => {
        e.preventDefault();

        const id = item.getAttribute('setting');
        $('.sidebar a.active').removeClass('active');
        $(`.sidebar a[setting="${id}"]`).addClass('active');
        $(`.views .view.active`).removeClass('active');
        $(`.views .view#${id}`).addClass('active');
    });
});

$('select').each(function () {
    var $this = $(this),
        numberOfOptions = $(this).children('option').length;

    $this.addClass('s-hidden');

    $this.wrap('<div class="select"></div>');

    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next('div.styledSelect');

    $styledSelect.text($this.children('option').eq(0).text());

    var $list = $('<ul />', {
        'class': 'options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }

    var $listItems = $list.children('li');

    if ($this.hasClass('searchEngine')) {
        $styledSelect.text(settings.searchEngine);
    }

    $styledSelect.click(function (e) {
        e.stopPropagation();
        $('div.styledSelect.active').each(function () {
            $(this).removeClass('active').next('ul.options').hide();
        });
        $(this).toggleClass('active').next('ul.options').toggle();
    });

    $listItems.click(function (e) {
        e.stopPropagation();
        $styledSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
        settings.searchEngine = $styledSelect.text();
    });

    $(document).click(function () {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});

function update() {
    fs.writeFile(settingsJSON, JSON.stringify(settings, null, 2), (err: any) => {
        if (err) return console.log(err);
    });
}