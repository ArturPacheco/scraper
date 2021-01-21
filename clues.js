function childNodesTypeValid (candidates){
    //VERIFICA O TIPO DO NO DE CADA FILHO
    candidates.forEach(candidate => {
        if(candidate.childNodes.length > 0){
            candidate.childNodes.forEach(childNode => {
                if(childNode.nodeType !== 3 || childNode.nodeType !== 8){
                    candidate.childNodesTypeValid = true
                }else{
                    candidate.childNodesTypeValid = false
                }
            })
        }
    })
}

function filterFontSize(candidates) {
    candidates.forEach(function (candidate) {
        let parsedCss = JSON.parse(candidate.computedCss);
        //console.log(parsedCss['font-size'] + candidate.tagName)
        let fontSize = parsedCss['font-size'].replace('px', '');
        
        fontSize = parseFloat(fontSize);
        if (fontSize > 0){
            candidate.fontSize = fontSize;
        }else{
            candidate.chances = 0
        }
    });
}

function fontSizeRankChances(candidates) {
    var sizeRank = [];
    candidates.sort((a, b) => parseFloat(b.fontSize) - parseFloat(a.fontSize));
    candidates.forEach(candidate => {
        sizeRank.push(candidate.fontSize);
    });
    var sizeRank = Array.from(new Set(sizeRank)) //Cria um vetor apenas com os valores
    candidates.forEach(candidate => {
        switch (sizeRank.indexOf(candidate.fontSize)) {
            case 0:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.9642
                    candidate.fontSizeRankPlacement = 1
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.9642
                };
                break;
            case 1:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.0357
                    candidate.fontSizeRankPlacement = 2
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.057
                    candidate.fontSizeRankPlacement = 0
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

module.exports = { filterFontSize, setOccurrences, fontSizeRankChances, tagNameChances, childNodesTypeValid };