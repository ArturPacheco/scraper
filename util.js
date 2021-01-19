function evaluateCriteria(candidates) {
    if (candidates.length > 0) {
        candidates.sort((a, b) => parseFloat(b.chances) - parseFloat(a.chances));
        
        candidates.slice(0,3).forEach(candidate => {
            console.log((candidate.chances * 100).toFixed(0) + '% - ' + candidate.floatPrice + '     ');
        })
    }
}

function extractFloat(candidates){
    const reaisRegex = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g);
    candidates.forEach(candidate => {
        candidate.floatPrice = candidate.innerText.match(reaisRegex)
        candidate.floatPrice = candidate.floatPrice.map(v => v.replace('.',''))
        candidate.floatPrice = candidate.floatPrice.map(v => v.replace(',','.'))
        candidate.floatPrice = candidate.floatPrice.map(v => parseFloat(v))

    });
}

//Print detailed information about each price candidate
function printDetails(candidates) {
    console.log('Number of candidates: ' + candidates.length + '\n');

    candidates.forEach(candidate => console.log(
        candidate.innerText + ": "
        + '\nFont size = ' + candidate.fontSize
        + '\ngetOccurrences = ' + candidate.getOccurrences
        + '\ntagName = ' + candidate.tagName
        + '\n'
    ));
}

module.exports = { printDetails, evaluateCriteria, extractFloat };