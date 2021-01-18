function filterFontSize(candidates) {
    candidates.forEach(function (candidate) {
        let parsedCss = JSON.parse(candidate.computedCss);
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
    var sizeRank = Array.from(new Set(sizeRank))
    candidates.forEach(candidate => {
        switch (sizeRank.indexOf(candidate.fontSize)) {
            case 0:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.9642
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.9642
                };
                break;
            case 1:
                if (candidate.chances == 'not_verified') {
                    candidate.chances = 0.0357
                } else if (candidate.chances != 0) {
                    candidate.chances = candidate.chances * 0.057
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
        candidate.getOccurrences = occurrences;
    });
}

module.exports = { filterFontSize, setOccurrences, fontSizeRankChances, tagNameChances };