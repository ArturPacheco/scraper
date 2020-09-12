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

    /* TESTE TENTANDO SALVAR TODOS OS ELEMENTOS DE UMA PAGINA (BROWSER CONTEXT)
    const elementHandle = await page.$$('*'); // returns <Promise<Array<ElementHandle>>>
    const propertyElHandle = await elementHandle[0].getProperty('innerText');
    console.log(await propertyElHandle.jsonValue());
    */

    /* TESTE USANDO XPATH
    //Puppeteer nao suporta XPATH 2.0 (que da suporte a expressoes regulares)
    const myXpath = "//*[matches(text(),'/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g')]";
    // wait for element defined by XPath appear in page
    await page.waitForXPath(myXpath);
    // evaluate XPath expression of the target selector (it return array of ElementHandle)
    let elHandle = await page.$x(myXpath);
    // prepare to get the textContent of the selector above (use page.evaluate)
    for (let i = 0; i<elHandle.length; i++){
        console.log(await page.evaluate(el => el.textContent, elHandle[i]));
    }
    */

   const html = await page.content();

   /*
    let arr = html.split(/\r?\n/);
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
        console.log(object.htmlLine);
        console.log(object.clue1);
        console.log(object.clue2);
    });

    //console.log(matchList);
    console.log("Foram encontrados " + (matchList.length) +" valores em reais na página.");*/
   
    $ = cheerio.load(html);
    let reaisRegex = new RegExp(/(?:[1-9]\d{0,2}(?:\.\d{3})*),\d{2}/g);
    const matchList = [];

    $('body *').contents().each(function(i, element){ //Cheerio cria um loop por todos os elementos da página
        if (element.nodeType === 3 && reaisRegex.test($(element).toString().trim())) { //Se o nodo html for do tipo 3 (texto) e possui a expressão regular
            matchList.push(element);
        }
    });

    console.log(matchList[1]);
    console.log(matchList.length);
    console.log(matchList[1].toString().trim());
    console.log(matchList[1].nodeType);
    console.log(matchList[1].data);

    await browser.close();
})();