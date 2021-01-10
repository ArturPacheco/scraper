function evaluateCriteria(candidates) {
    if (candidates.length > 0) {
        candidates.sort((a, b) => parseFloat(b.chances) - parseFloat(a.chances));
        
        candidates.slice(0,3).forEach(candidate => {
            console.log((candidate.chances * 100).toFixed(0) + '% - ' + candidate.innerText + '     ');
        })
    }
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

module.exports = { printDetails, evaluateCriteria };