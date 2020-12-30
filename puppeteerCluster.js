const productPages = require('./product-pages.json');
const { Cluster } = require('puppeteer-cluster');
const clues = require('./clues');
const util = require('./util');

//https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts

async function render({ page, data: item }) {
    //await page.setCacheEnabled(false);
    //O setUserAgent e o setViewport fazem a pagina simular um Galaxy S5
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36')
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
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
                if (node.innerText.match(reaisRegex) && node.childElementCount == 0 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'NOSCRIPT') { //CRITERIO DE EXCLUSAO 2, 3, 4 e 5
                    var style = window.getComputedStyle(node, '');
                    var styleValues = {};
                    for (var i = 0; i < style.length; i++) {
                        styleValues[style[i]] = style.getPropertyValue(style[i]);
                    }

                    filteredNodes.push({
                        tagName: node.tagName,
                        nodeName: node.nodeName,
                        innerText: node.innerText,
                        hasChildren: node.childElementCount,
                        computedCss: JSON.stringify(styleValues)
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
    clues.getFontSize(item.candidates);
    clues.getOccurrences(item.candidates, bodyHtml);

    //Imprime os elementos encontrados
    //util.printDetails(target.candidates);
    item.chosenValue = util.evaluateCriteria(item.candidates);
    console.log(item.siteName + ": " + item.chosenValue);
}



async function main() {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 7,
        monitor: true,
        retryLimit: 12,
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
        if(!willRetry) {
            console.log(`X ${data.siteName}: ${err.message}`);
        }
    });

    await cluster.task(render);

    for (const item of productPages) {
        await cluster.queue(item);
    }

    await cluster.idle();
    await cluster.close();
}

main()