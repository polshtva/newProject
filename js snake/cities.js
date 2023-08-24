let bigData = [];
function renderTemplate(name, data) {
    let url = `./view/${name}.handlebars`
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status == 200) {
        let tpl = xhr.responseText;
        let tplCB = Handlebars.compile(tpl);
        return tplCB(data);
    }
    else {
        return xhr.status;
    }
}

function loadData() {

    let root = document.querySelector('#root');
    // let citiesTableTemlate =
    //     ``;
    // let citesTemplete = Handlebars.compile(citiesTableTemlate);
    // // $.get('./russian-cities.json', function (data) {
    //     console.log(data);
    // }, 'json')

    fetch('./russian-cities.json').then(function (res) {
        return res.json();
    }).then(function (data) {
        //console.log(data);
        //root.innerHTML = citesTemplete({ items: data });
        //root.innerHTML = renderTemplate('citiesTableTemlate', { items: data })
        bigData = data;
        renderData(bigData);
    });

    var template = Handlebars.compile("Hello <b>{{target}}</b>");
    root.innerHTML = template({ target: "word" });
}

function renderData(data) {
    root.innerHTML = renderTemplate('citiesTableTemlate', { items: data })
}
document.addEventListener('DOMContentLoaded', loadData)

document.addEventListener('click', function (e) {
    let css = '[data-sort]';
    let target = e.target;
    if (!target.matches(css)) {
        target = target.closest(css);
    }
    if (!target) return;
    console.log(css, target);
    let fiels = target.dataset.sort;
})