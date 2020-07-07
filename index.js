const puppeteer = require('puppeteer');
const fs = require('fs');
const { measureMemory } = require('vm');

(async () => {
    //let pageUrl = 'https://www.mercadolivre.com.br/moto-g8-plus-dual-sim-64-gb-cosmic-blue-4-gb-ram/p/MLB15273216?source=search#searchVariation=MLB15273216&position=1&type=product&tracking_id=e65178bc-1e6e-49a1-9e24-8a9cd86698b0';
    //let pageUrl = 'https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975';
    let pageUrl = 'https://www.cea.com.br/camisa-feminina-estampada-estrelas-com-bolso-manga-curta-verde-escuro-9942341-verde_escuro/p';
    
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
    let reaisRe = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g);
    let matchList = [];
    arr.forEach((line, idx) => { //Percorre linha por linha do html
        if (line.match(reaisRe)){ //Se encontrar algo no formato de reais na linha em questão
            line.match(reaisRe).forEach((lineFoundValue)=>{ //Percorre os valores encontrados na linha
                matchList.push({
                    foundValue: lineFoundValue,      //O próprio valor
                    htmlLine: (idx+1),               //A linha encontrada
                    htmlPrevLineContent: arr[idx-1], //O conteúdo da linha anterior
                    htmlLineContent: line,           //O conteúdo da linha
                    htmlNextLineContent: arr[idx+2]  //O conteúdo da linha seguinte
                });
            });
        }
    });
    
    //Clue 1
    let re = new RegExp(/R\$/g);
    matchList.forEach((object) => {
        if (object.htmlLineContent.match(re)){
            object.clue1 = true;
        }else{
            object.clue1 = false;
        }
    });

    //Clue 2
    re = new RegExp(/<span.+?(?=>)>/g);
    matchList.forEach((object) => {
        if (object.htmlLineContent.match(re)){
            object.clue2 = true;
        }else{
            object.clue2 = false;
        }
    });

    //Print
    matchList.forEach((object) => {
        console.log("-------------------");
        console.log(object.foundValue);
        //console.log(object.htmlLine);
        console.log(object.clue1);
        console.log(object.clue2);
    });

    //console.log(matchList);
    console.log("Foram encontrados " + (matchList.length) +" valores em reais na página.");

    await browser.close();
})();