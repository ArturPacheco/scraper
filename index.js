const puppeteer = require('puppeteer');
const fs = require('fs');

//DX RACER - JSON
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


//KABUM ALPHA GAMER - JSON
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

//DXRACER - PUPPETEER HTML EXTRACT
(async () => {
    let pageUrl = 'https://produto.mercadolivre.com.br/MLB-1337187769-banco-rustico-banquinho-madeira-rustica-banco-pequeno-_JM?quantity=1&variation=53220388316&onAttributesExp=true#position=21&type=item&tracking_id=ae62ce72-41bb-4403-9f2f-71a7178ad016';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const html = await page.content();

    fs.writeFileSync("output.html", html, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    let htmlFile = fs.readFileSync("output.html", "utf8");
    let arr = htmlFile.split(/\r?\n/);
    arr.forEach((line, idx) => {
        if(line.includes("R$")){
            console.log((idx+1)+':'+ line);
        }
    });

    await browser.close();

})();


//DX RACER - CHEERIO
/*
let options = {
    url: 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
    }
};
request(options, (error, response, html) => {
    if(!error && response.statusCode == 200){
        console.log(html.length);
    }else{
        console.log(response.statusCode);
    }
});
*/