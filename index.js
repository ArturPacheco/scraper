const puppeteer = require('puppeteer');
const cheerio = require ('cheerio');

(async () => {
    //let pageUrl = 'https://www.mercadolivre.com.br/moto-g8-plus-dual-sim-64-gb-cosmic-blue-4-gb-ram/p/MLB15273216?source=search#searchVariation=MLB15273216&position=1&type=product&tracking_id=e65178bc-1e6e-49a1-9e24-8a9cd86698b0';
    let pageUrl = 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975';
    //let pageUrl = 'https://example.com/';
    //let pageUrl = 'https://www.lamudi.co.id/newdevelopments/';
    //let pageUrl = 'https://www.cea.com.br/camisa-feminina-estampada-estrelas-com-bolso-manga-curta-verde-escuro-9942341-verde_escuro/p';
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const html = await page.content();

    //https://stackoverflow.com/questions/50993337/how-do-i-navigate-dom-elements-in-puppeteer
    const nodeList = await page.evaluate(function() {
        let nodes = document.querySelectorAll('body *');
        const filteredNodes = [];
        nodes.forEach(function (node) {
            if(node.innerText && node.childElementCount == 0){
                var style = window.getComputedStyle(node, '');
                var styleValues = [];
                for (var i=0; i<style.length; i++) {
                    styleValues.push({
                        attribute: style[i],
                        value: style.getPropertyValue(style[i])
                    });
                }
            
                filteredNodes.push({
                    tagName: node.tagName,
                    innerText: node.innerText,
                    hasChildren: node.childElementCount,
                    computedCss: styleValues
                });
            }
        })
        return filteredNodes;
    });
    console.log(nodeList[0]);

    await browser.close();
})();