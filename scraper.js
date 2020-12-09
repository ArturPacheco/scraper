const productPages = require('./product-pages.json');
const clues = require('./clues');
const util = require('./util');
const puppeteer = require('puppeteer');
const fs = require('fs');



console.log(`%c
======================================
              Running...
======================================`, "font-family:monospace");

process.setMaxListeners(0); // <== Important line

productPages.forEach(function (target) { //Roda o programa para cada item na lista de sites do arquivo JSON
    if (target.siteName.toLowerCase() == "melissa".toLowerCase()) { //Utilizado para testar em algum site especifico (remover depois)
        (async () => {
            console.log('Visiting ' + target.siteName + '...');
            const browser = await puppeteer.launch({
                headless: false,
                stealth: true
            });
            const page = await browser.newPage();
            await page.setCacheEnabled(false);
            await page.emulate(puppeteer.devices['Galaxy S5']); //Orienta ao puppeteer que simule um smartphone
            await page.goto(target.pageUrl, { waitUntil: 'networkidle2' });

            var bodyHtml = await page.content(); //Coloca o conteudo na pagina em uma variavel para ser consultado posteriormente

            /*fs.writeFile("\dump.txt", bodyHtml, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });*/

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
            target.candidates = nodeList;

            //Coleta pistas necessarias para encontrar o preço
            clues.getFontSize(target.candidates);
            clues.getOccurrences(target.candidates, bodyHtml);

            //Imprime os elementos encontrados
            //util.printDetails(target.candidates);
            util.evaluateCriteria(target.candidates);

            await browser.close();
        })();
    }
})