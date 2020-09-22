const puppeteer = require('puppeteer');
const cheerio = require ('cheerio');

(async () => {
    //let pageUrl = 'https://www.example.com';
    //let pageUrl = 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975';
    //let pageUrl = 'https://www.mercadolivre.com.br/samsung-galaxy-j2-core-dual-sim-16-gb-preto-1-gb-ram/p/MLB15030554';
    let pageUrl = 'https://www.americanas.com.br/produto/134174786/smartphone-samsung-galaxy-j2-core-16gb-dual-chip-android-8-1-tela-5-quad-core-1-4ghz-4g-camera-8mp-preto?pfm_carac=samsung%20galaxy%20j2&pfm_page=search&pfm_pos=grid&pfm_type=search_page';
    //let pageUrl = 'https://www.amazon.com.br/Smartphone-Samsung-Galaxy-Core-Preto/dp/B089QRMWTK/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=Samsung+Galaxy+J2+Core+16GB&qid=1600733103&sr=8-1';
    //let pageUrl = 'https://www.magazineluiza.com.br/smartphone-galaxy-j2-core-16gb-5-dual-chip-4g-preto-samsung/p/bg7f32k83f/te/gaj2/';
    
    const browser = await puppeteer.launch({
        headless: true,
        stealth: true,
        useChrome: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

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
    
    console.log(nodeList.length);
    nodeList.forEach(node => console.log(node.innerText));


    await browser.close();
})();