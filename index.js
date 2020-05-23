const puppeteer = require('puppeteer');
const fs = require('fs');

//DX RACER
/*
(async () => {
    let pageUrl = 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    let data = await page.evaluate(() => {
        let productName = document.querySelector('.product-name').innerText;
        let productPrice = document.querySelector('.sale-price span').innerText;
        let timeStamp = new Date().getTime();

        return {
            productName,
            productPrice,
            timeStamp
        }
    });

    //output to JSon file
    fs.appendFile('scrape_results.json', JSON.stringify(data) + '\n', function (err) {
        if (err) return console.log(err);
    });

    await browser.close();

})();


//KABUM ALPHA GAMER
(async () => {
    let pageUrl = 'https://www.kabum.com.br/produto/93907/cadeira-gamer-alpha-gamer-polaris-racing-black';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    console.log(page.evaluate(() => window.find("R$")));

    let data = await page.evaluate(() => {
        let productName = document.querySelector('h1[itemprop="name"]').innerText;
        let productPrice = document.querySelector('meta[itemprop="price"]').getAttribute('content');
        let timeStamp = new Date().getTime();

        return {
            productName,
            productPrice,
            timeStamp
        }
    });

    //output to JSon file
    fs.appendFile('scrape_results.json', JSON.stringify(data) + '\n', function (err) {
        if (err) return console.log(err);
    });

    await browser.close();

})();
*/

//EXTRACAO DE HTML - DXRACER
(async () => {
    let pageUrl = 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const html = await page.content();
    //console.log(html);

    fs.writeFile("output.html", html, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    await browser.close();

})();


//EXTRACAO DE HTML - OUTRO
/*
(async () => {
    let pageUrl = 'https://www.magazineluiza.com.br/papel-higienico-folha-dupla-neve-toque-de-seda-24-rolos-30m/p/215282300/me/pahi/';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const html = await page.content();
    //console.log(html);

    fs.writeFile("output.html", html, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    await browser.close();

})();
*/