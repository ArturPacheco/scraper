const { printTable, Table } = require('console-table-printer');

function debug(candidates, siteName) {
    console.log(siteName)
    const table = new Table({
        columns: [
            { name: 'Num', alignment: 'left', color: 'blue' },
            { name: 'chances' },
            { name: 'childElementCount' },
            { name: 'hasChildNodes' },
            { name: 'price' },
            { name: 'fontSize' },
            { name: 'tagName' },
            { name: 'hasChild' }
            //{ name: 'innerText', alignment: 'left' }
        ]
    })

    var count = 1
    candidates.forEach(candidate => {
        if (count < 50) {
            table.addRow({
                "Num": count,
                "chances": (candidate.chances * 100).toFixed(2),
                "childElementCount": candidate.childElementCount,
                "hasChildNodes": candidate.hasChildNodes,
                "price": candidate.price,
                "fontSize": candidate.fontSize,
                "tagName": candidate.tagName,
                //"innerText": (candidate.innerText.trim()).substring(0, 20),
            })
            count++
        }
    })
    table.printTable()
}

function evaluateCriteria(candidates) {
    if (candidates.length > 0) {
        candidates.sort((a, b) => parseFloat(b.chances) - parseFloat(a.chances));

        if (candidates[0]) {
            candidates[0].timeStamp = Date.now()
            return candidates[0]
        } else {
            return "not found"
        }

    }
}

function extractFloat(candidates) {
    const reaisRegex = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g);
    candidates.forEach(candidate => {
        candidate.price = candidate.innerText.match(reaisRegex)
        candidate.price = candidate.price.map(v => v.replace('.', ''))
        candidate.price = candidate.price.map(v => v.replace(',', '.'))
        candidate.price = candidate.price.map(v => parseFloat(v))
        if (candidate.price.length <= 1) {
            candidate.price = candidate.price[0]
        }
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

module.exports = { printDetails, evaluateCriteria, extractFloat, debug };