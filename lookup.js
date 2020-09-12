

var userLang = navigator.language || navigator.userLanguage;
var userISO = userLang.slice(0,2);

const userLangPicker = `<select name="lingues" id="lingues" onchange="changeLang(this.value)">
        <option value="en">🇬🇧 Anglesi</option>
        <option value="de">🇩🇪 German</option>
        <option value="cn">中文 Chinesi</option>
        <option value="es">🇪🇸 Hispan</option>
        <option value="ru">🇷🇺 Russ</option>
        <option value="eo">Esperanto</option>
    </select>`;

document.getElementById('langPicker').innerHTML = userLangPicker;


function changeLang(langISO) {
    var langs = document.getElementById('lingues')
    for (var l of langs.options) { if (l.value == langISO) {l.selected = true} }
    userISO = langISO;
}

changeLang(userISO);



var dictionary = {};
fetch('dict.json')
    .then(response => response.json())
    .then(data => dictionary = data);

const definitionEl = document.getElementById('definition');


function debounce(func, delay) {
    let inDebounce
    return function() {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
}



function lookup() {
    
    var s = document.getSelection().toString().trim().toLowerCase();
    var punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var cleaned = punctuationless.replace(/\s{2,}/g," ");
    var selection = cleaned.split(' ');

    if (selection[0] == '') {
        console.log('selected nothing!')
        return;
    }

    console.log(`You selected: ${selection}`);

    var definitions = [];

    for (var word of selection) {
        if (word in dictionary) {
            console.log(`Looking up: ${word}`);
            definitions.push({"word": word, "info": dictionary[word]});
        } else {
            console.log(`Not in dictionary: ${word}`);
            definitions.push({"word": word, "info": '' });
        }
    }

    if (definitions.length <= 1) {
        var payload = `<h4>${definitions[0].word}</h4>
        <p>${userISO} : ${definitions[0].info[userISO]}</p>
        <p><small>altri : ${definitions[0].info[userISO + "2"]}</small></p>
        <hr/>
        <p>parte de parlada : ${definitions[0].info['parte de parlada']}</p>
        <p>radica : ${definitions[0].info['radica']}</p>
        <p>etymologie : ${definitions[0].info['etymologie']}</p>`;
            
        displayInfo(payload)
    } else {
        var payload = '<p>';
        for (var d of definitions) {
            if (d.info != '') {
                if (d.info[userISO] != '') {
                    payload += ` ${d.info[userISO]} `
                } else {
                    payload += ` [${d.word}] `
                }
            } else {
                payload += ` [${d.word}] `
            }
            
        }
        payload += '</p>';
        displayInfo(payload)
    }

  
}

function displayInfo(htmlString) {
    definitionEl.innerHTML = '';
    
    console.log('displaying it!');

    definitionEl.innerHTML = htmlString;
    
    definitionEl.style.display = 'block';

    definitionEl.onclick = () => { definitionEl.style.display = 'none'; };
}