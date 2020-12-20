function evaluateCriteria(candidates) {
    if (candidates.length > 0) {
        var chosen = candidates[0];
        candidates.forEach(candidate => {
            if (candidate.fontSize >= chosen.fontSize) {
                chosen = candidate;
            }
        });
        return chosen.innerText;
    } else {
        return 0;
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