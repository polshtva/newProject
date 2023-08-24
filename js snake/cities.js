let bigData = [];
let filterData = {};

function renderTemplate(name, data) {
    let url = `./view/${name}.handlebars`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status == 200) {
        let tpl = xhr.responseText;
        let tplCB = Handlebars.compile(tpl);
        return tplCB(data);
    } else {
        return xhr.status;
    }
}

function loadData() {
    let root = document.querySelector('#root');
    // let citiesTableTemplate = ``;
    // let citiesTemplate = Handlebars.compile(citiesTableTemplate);
    // $.get('./data/cities.json', function (data) {
    //     console.log(data);
    // }, 'json');
    fetch('./data/cities.json').then(function (res) {
        return res.json();
    }).then(function (data) {
        // console.log(data)
        // root.innerHTML = citiesTemplate({ items: data });
        // root.innerHTML = renderTemplate('citiesTableTemplate', { items: data });
        bigData = data;
        renderData(bigData);
    });
    var template = Handlebars.compile("Hello <b>{{target}}</b>");
    root.innerHTML = template({ target: "world" });
}

function renderData(data) {
    let arDistricts = data.map(item => item.district).filter(function (item, i, list) {
        return list.indexOf(item) == i;
    }).sort();

    let lstDistricts = arDistricts.map(item => { return { name: item, active: item == filterData.district } });
    console.log(lstDistricts);

    // filterData.district
    let arSubects = data
        .filter(function (item) {
            let dst = filterData.district;
            if (dst === undefined || dst == '*') return true;
            return dst == item.district;
        })
        .map(item => item.subject)
        .filter((item, i, list) => list.indexOf(item) == i)
        .sort();

    let lstSubjects = arSubects.map(function (item) {
        return {
            name: item,
            active: item == filterData.subject,
        }
    });
    // console.log(lstSubjects);



    let dst = filterData.district;
    let sub = filterData.subject;
    let subIsBad = data.filter(function (item) {
        return (dst === undefined || dst == '*' || dst == item.district)
            &&
            (sub === undefined || sub == '*' || sub == item.subject);
    }).length == 0;
    if (subIsBad) {
        sub = filterData.subject = '*';
    }
    let filteredData = data.filter(function (item, i, list) {
        let matchDistrict = dst === undefined || dst == '*' || dst == item.district;
        let metchSubject = sub === undefined || sub == '*' || sub == item.subject;
        return matchDistrict && metchSubject;
    });

    let arCities = filteredData.map(item => item.name).sort();
    let lstCities = arCities.map(item => { return { name: item, active: item == filterData.city } })

    let cn = filterData.city;
    let city = (cn !== undefined) && (cn != '*') && filteredData.find(item => item.name == cn);
    if (city) {
        city.populationFormatted = Intl.NumberFormat().format(city.population);
    }
    console.log(cn, city)


    root.innerHTML = renderTemplate('citiesTableTemplate', {
        items: filteredData,
        districts: lstDistricts,
        subjects: lstSubjects,
        cities: lstCities,
        choosen_one: city,
    });
}
document.addEventListener('DOMContentLoaded', loadData);

document.addEventListener('click', function (e) {
    let css = '[data-sort]';
    let target = e.target;
    if (!target.matches(css)) {
        target = target.closest(css);
    }
    if (!target) return;
    // console.log(css, target);
    let field = target.dataset.sort;
    // console.log(field)
    // sort them
    bigData.sort(function (a, b) {
        let ca = a[field], cb = b[field];
        if (ca == cb) return 0;
        return (ca < cb) ? -1 : 1;
    });
    renderData(bigData);

})

function bindEvent(el, event, css, cb) {
    let fn = function (...arg) {
        let target = arg[0].target;
        if (!target.matches(css)) {
            target = target.closest(css);
        }
        if (!target) return;
        return cb.apply(this, arg);
        // console.log(target);
    }
    el.addEventListener(event, fn);
}

bindEvent(document, 'change', 'select', function (e) {
    let el = e.target;
    let form = el.form;
    let elems = form.elements;
    // let obForm = {
    //     city: elems.city.value,
    //     subject: elems.subject.value,
    //     district: elems.district.value,
    // }
    let obForm = Object.entries(elems)
        .filter(([key]) => key * 1 != key)
        .reduce((prev, [key, el]) => { prev[key] = el.value; return prev; }, {});
    filterData = obForm;
    renderData(bigData);
    // .reduce(function (prev, [key, el]) {
    //     // let key = curr[0];
    //     // let el = curr[1];
    //     let val = el.value;
    //     prev[key] = val;
    //     // prev[curr[0]] = curr[1].value;
    //     return prev;
    // }, {});
    console.log(el, obForm);
})