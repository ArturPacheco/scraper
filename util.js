const { printTable, Table } = require('console-table-printer');

function debug(candidates, siteName) {

    console.log(siteName)
    console.log('Total candidates: ' + candidates.length)
    var haveChance = 0;
    candidates.forEach(candidate => {
        if (candidate.chances > 0) {
            haveChance++
        }
    })
    console.log('Have chance: ' + haveChance)
    console.log('Zero chances: ' + (candidates.length - haveChance))

    const table = new Table({
        columns: [
            { name: 'Num', alignment: 'left', color: 'blue' },
            { name: 'chances' },
            { name: 'childElementCount' },
            { name: 'hasChildNodes' },
            { name: 'price' },
            { name: 'fontSize' },
            { name: 'tagName' },
            { name: 'yPosition' },
            { name: 'lineThrough' },
            //{ name: 'innerText', alignment: 'left' }
        ]
    })

    var count = 1
    candidates.forEach(candidate => {
        if (count < 100) {
            var price = 0;
            if(candidate.price.length > 1){
                price = (candidate.price.length + ' valores')
            }else{
                price = candidate.price
            }
            table.addRow({
                "Num": count,
                "chances": (candidate.chances * 100).toFixed(2),
                "childElementCount": candidate.childElementCount,
                "hasChildNodes": candidate.hasChildNodes,
                "price": price,
                "fontSize": candidate.fontSize,
                "tagName": candidate.tagName,
                "yPosition": candidate.yPosition,
                "lineThrough": candidate.lineThrough,
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
    const reaisRegex = new RegExp(/R\$\s?[1-9]{0,3}\.?\d{1,3},?\d{0,2}/g);
    candidates.forEach(candidate => {
        candidate.price = candidate.innerText.match(reaisRegex)
        candidate.price = candidate.price.map(v => v.replace('.', ''))
        candidate.price = candidate.price.map(v => v.replace('R', ''))
        candidate.price = candidate.price.map(v => v.replace('$', ''))
        candidate.price = candidate.price.map(v => v.replace(',', '.'))
        candidate.price = candidate.price.map(v => parseFloat(v))
        if (candidate.price.length > 1) {
            candidate.chances = 0
        }
    });
    candidates.forEach(candidate => {

    })
}

function splitAgglomeratedResult(candidates) {
    //
}

module.exports = { evaluateCriteria, extractFloat, debug };