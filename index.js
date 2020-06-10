const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let pageUrl = 'https://www.ultrafarma.com.br/cimegripe-com-20-capsulas-validade-julho-2019';

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
    let matchList = {};
    let matchListIdx = 0;
    arr.forEach((line, idx) => { //Percorre linha por linha do html
        if (line.match(reaisRe)){ //Se encontrar algo no formato de reais na linha em questão
            line.match(reaisRe).forEach((lineFoundValue)=>{ //Percorre os valores encontrados na linha
                let data = { //Cria uma estrutura com as informações daquele valor
                    foundValue: lineFoundValue,      //O próprio valor
                    htmlLine: (idx+1),               //A linha encontrada
                    htmlPrevLineContent: arr[idx-1], //O conteúdo da linha anterior
                    htmlLineContent: line,           //O conteúdo da linha
                    htmlNextLineContent: arr[idx+2]  //O conteúdo da linha seguinte
                };
                matchList[matchListIdx] = []; //Inicializa a posição do array de valores encontrados
                matchList[matchListIdx].push(data); //Adiciona o novo registro junto aos outros valores encontrados
                matchListIdx++; //+1 para o índice de valores encontrador
            });
        }
    });

    //console.log(matchList[5]);
    //console.log(matchList[6]);
    //console.log(matchList[7]);
    console.log("Foram encontrados " + (matchListIdx+1) +" valores em reais na página.");

    await browser.close();
})();