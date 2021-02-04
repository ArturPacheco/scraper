function filterFontSize(candidates) { //Extrai do CSS do elemento o tamanho de fonte como um float
    candidates.forEach(function (candidate) {
        let parsedCss = JSON.parse(candidate.computedCss);
        let fontSize = parsedCss['font-size'].replace('px', '');
        candidate.fontSize = parseFloat(fontSize)
        if (typeof candidate.fontSize === 'undefined' || candidate.fontSize == 0) { //Se o tamanho da fonte for 0 ou indefinido zera chance do candidato ser o escolhido
            candidate.chances = 0
        }
    });
}

function haveLineThrough(candidates) {
    candidates.forEach(candidate => {
        let parsedCss = JSON.parse(candidate.computedCss);
        let textDecoration = parsedCss['text-decoration-line'];
        if (textDecoration.includes('line-through')) { 
            candidate.lineThrough = true
        }else{
            candidate.lineThrough = false
        }
    })
}

function fontSizeRankChances(candidates) {
    var sizeRank = new Set(); //Cria um set para armazenar o ranking de tamanhos de fonte
    candidates.sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize)); //Ordena os em ordem decrescente conforme o tamanho da fonte
    candidates.forEach(candidate => { //Adiciona ao set o tamanho das fontes
        sizeRank.add(candidate.fontSize);
    });
    sizeRank = Array.from(sizeRank)

    candidates.forEach(candidate => {
        candidate.fontSizeRankPlacement = sizeRank.indexOf(candidate.fontSize) + 1
        switch (candidate.fontSizeRankPlacement) {
            case 1:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.9285
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.9285
                };
                break;
            case 2:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.0714
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.0714
                };
                break;
            default:
                candidate.chances = 0
        }
    });
}

function tagNameChances(candidates) {
    candidates.forEach(candidate => {
        switch (candidate.tagName) {
            case 'SPAN':
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.7142
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.7142
                };
                break;
            case 'STRONG':
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.1071
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.1071
                };
                break;
            case 'DIV':
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.1071
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.1071
                };
                break;
            case 'LABEL':
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.0357
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.0357
                };
                break;
            case 'P':
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.0357
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.0357
                };
                break;
            default:
                candidate.chances = 0
        }
    });
}

function setOccurrences(candidates, bodyHtml) {
    bodyHtml = bodyHtml.replace(/\r?\n|\r/g, ' '); //Remove quebras de linha
    bodyHtml = bodyHtml.replace(/  +/g, ' '); //Remove espacos duplos
    bodyHtml = bodyHtml.replace(/&nbsp;/g, ' '); //Remove non breaking spaces

    var searchString;

    candidates.forEach(function (candidate) {
        searchString = new RegExp(candidate.innerText.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&'), 'gmis');
        var occurrences = (bodyHtml.match(searchString) || []).length;
        candidate.occurrences = occurrences;
    });
}

module.exports = { filterFontSize, setOccurrences, fontSizeRankChances, tagNameChances, haveLineThrough };