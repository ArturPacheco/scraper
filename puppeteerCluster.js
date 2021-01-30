const productPages = require('./product-pages.json');
const { Cluster } = require('puppeteer-cluster');
const clues = require('./clues');
const util = require('./util');
const fs = require('fs');
const { notStrictEqual } = require('assert');

//https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts

async function render({ page, data: item }) {
    //O setUserAgent e o setViewport fazem a pagina simular um Galaxy S5
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36')
    await page.setViewport({
        width: 360,
        height: 640,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
    })
    await page.goto(item.pageUrl, { waitUntil: 'networkidle2' });

    var bodyHtml = await page.content(); //Coloca o conteudo na pagina em uma variavel para ser consultado posteriormente

    const nodeList = await page.evaluate(function () {
        let nodes = document.querySelectorAll('body *'); //CRITERIO DE EXCLUSAO 1
        const filteredNodes = [];
        const reaisRegex = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g); //CRITERIO DE EXCLUSAO 2
        nodes.forEach(function (node) {
            try {
                if (node.innerText.match(reaisRegex)
                    && (node.childElementCount === 0 || (node.childElementCount >= 1 && node.childNodes.length > node.childElementCount))
                    && node.tagName !== 'SCRIPT'
                    && node.tagName !== 'STYLE'
                    && node.tagName !== 'NOSCRIPT') { //CRITERIO DE EXCLUSAO 2, 3, 4 e 5

                    //COLETA O CSS DO ELEMENTO
                    var style = window.getComputedStyle(node, '');
                    var styleValues = {};
                    for (var i = 0; i < style.length; i++) {
                        styleValues[style[i]] = style.getPropertyValue(style[i]);
                    }

                    filteredNodes.push({
                        tagName: node.tagName,
                        nodeName: node.nodeName,
                        innerText: node.innerText,
                        nodeType: node.nodeType,
                        hasChildNodes: node.hasChildNodes(),
                        childElementCount: node.childElementCount, //Conta quantos elementos possui (que pode conter outros elementos)
                        computedCss: JSON.stringify(styleValues),
                        chances: 'not_verified',
                        className: node.className,
                        idName: node.id
                    });

                }
            } catch {
                console.log('cant!');
            }
        })
        return filteredNodes;
    });

    item.candidates = nodeList;

    //Coleta pistas necessarias para encontrar o preço
    //clues.childNodesTypeValid(item.candidates)
    clues.filterFontSize(item.candidates);
    clues.setOccurrences(item.candidates, bodyHtml);
    clues.fontSizeRankChances(item.candidates);
    clues.tagNameChances(item.candidates);
    util.extractFloat(item.candidates);

    let data = util.evaluateCriteria(item.candidates)

    //util.debug(item.candidates, item.siteName) //Metodo que imprime dados de cada candidato para debug

    item.runs.push(data);
    delete item.candidates //Remove a propriedade "candidatos" para que na proxima linha nao seja salva no JSON
    fs.writeFileSync('product-pages.json', JSON.stringify(productPages, null, 2)) //Escreve novos resultados no JSON
}



async function main() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 4,
        monitor: false,
        retryLimit: 0,
        retryDelay: 5000,
        workerCreationDelay: 1000,
        puppeteerOptions: {
            headless: false,
            //https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra
            //Acessar link e ver como usar puppeteer extra com cluster
            stealth: true
        }
    });

    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data, willRetry) => {
        if (!willRetry) {
            console.log(`X ${data.siteName}: ${err.message}`);
        }
    });

    await cluster.task(render);

    for (var item of productPages) {
        // if (item.siteName == 'Extra') { //Run only 1 position
            await cluster.queue(item);

        // }
    }


    await cluster.idle();
    await cluster.close();
}

main()