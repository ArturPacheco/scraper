const puppeteer = require('puppeteer');
const productPages = require('./product-pages.json');

console.log('Running...');

productPages.forEach(function (target){
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            stealth: true,
            useChrome: true});
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
        await page.goto(target.pageUrl, { waitUntil: 'networkidle2' });

        const nodeList = await page.evaluate(function() {
            let nodes = document.querySelectorAll('body *');
            const filteredNodes = [];
            const reaisRegex = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g);
            nodes.forEach(function (node) {
                try{
                    if(node.innerText.match(reaisRegex) && node.childElementCount == 0 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE'){
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
                }catch{
                    console.log('cant!');
                }   
            })
            return filteredNodes;
        });
        
        target.result = nodeList;
        console.log(target.siteName + ": " + target.result.length);
        //nodeList.forEach(node => console.log(node.innerText));

        await browser.close();
    })();
})