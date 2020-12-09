function getFontSize(candidates) {
    candidates.forEach(function (candidate) {
        let parsedCss = JSON.parse(candidate.computedCss);
        let fontSize = parsedCss['font-size'].replace('px','');
        fontSize = parseFloat(fontSize);
        //candidate.cluesResults = JSON.stringify({ 'getFontSize': fontSize })
        candidate.cluesResults.getFontSize = fontSize;
    });
}

function getOccurrences(candidates, bodyHtml) {
    bodyHtml = bodyHtml.replace(/\r?\n|\r/g, ' '); //Remove quebras de linha
    bodyHtml = bodyHtml.replace(/  +/g, ' '); //Remove espacos duplos
    bodyHtml = bodyHtml.replace(/&nbsp;/g, ' '); //Remove non breaking spaces

    var searchString;

    candidates.forEach(function (candidate) {
        searchString = new RegExp(candidate.innerText.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&'), 'gmis');
        var occurrences = (bodyHtml.match(searchString) || []).length;
        //candidate.cluesResults += JSON.stringify({ 'getOcurrences': occurrences });
        candidate.cluesResults.getOccurrences = occurrences;
    });
}

module.exports = { getFontSize, getOccurrences };