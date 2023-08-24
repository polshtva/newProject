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

bindEvent(document, 'input', 'input[type="range"]', function (e) {
    let el = e.target;
    let elForm = el.form;
    let formEls = elForm.elements;
    let obForm = Object.entries(formEls)
        .filter(([key]) => key * 1 != key)
        .reduce((prev, [k, v]) => {
            prev[k] = v.value;
            return prev;
        }, {});
    applyRGN(obForm);
    previewValues(obForm);

    if (['r', 'g', 'b'].includes(el.name)) {
        let hsl = RGBToHSL(obForm);
        ['h', 's', 'l'].forEach((k) => elForm.elements[k].value = hsl[k]);
    } else {
        console.log('calc back');
        let rgb = HSLToRGB(obForm);
        ['r', 'g', 'b'].forEach((k) => elForm.elements[k].value = rgb[k]);
        console.log(rgb);
    }

    let data = JSON.stringify(obForm);
    document.cookie = `color= ${data}`;
    window.localStorage.setItem('color', data);
});


function applyRGN(data) {
    let hex = "#" + ['r', 'g', 'b'].map(c => (+data[c]).toString(16).padStart(2, '0')).join('');
    document.body.style.setProperty('background-color', hex);
    let elLef = document.querySelector('.playground legend[data-hex]');
    if (elLef) elLef.dataset.hex = hex;
}

// function fillHSL(data){
//     let hsl = RGBToHSL(data);
// }

function previewValues(data) {
    let form = document.forms[0]; if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
        let el = form.elements[key];
        el.nextElementSibling.innerText = value;
    });
}

function restoreData() {
    // let cookies = document.cookie.split('; ').reduce((prev, current) => {
    //     const [name, ...value] = current.split('=');
    //     prev[name] = value.join('=');
    //     return prev;
    // }, {});
    let cookies = localStorage;
    if (cookies.color) {
        let data = {};
        try {
            data = JSON.parse(cookies.color);

        } catch {
            console.log('no!!!')
        }
        let form = document.forms[0]; if (!form) return;
        ['r', 'g', 'b'].forEach((k) => form.elements[k].value = data[k]);

        let hsl = RGBToHSL(data);
        ['h', 's', 'l'].forEach((k) => form.elements[k].value = hsl[k]);

        applyRGN(data);
        previewValues(data);
    }



}

document.addEventListener('DOMContentLoaded', restoreData);

function RGBToHSL({ r, g, b }) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h: h, s: s, l: l };
}

function HSLToRGB({ h, s, l }) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
        //return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return { r: f(0), g: f(8), b: f(4) };
    //return `#${f(0)}${f(8)}${f(4)}`;
}