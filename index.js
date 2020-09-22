const puppeteer = require('puppeteer');

const pages = [
    {
        siteName:"DxRacer",
        pageUrl:"https://www.dxracer.com.br/cadeira-dxracer-racing-rw01n-8-p985975",
        result:[]
    },
    {
        siteName:"Mercado Livre",
        pageUrl:"https://www.mercadolivre.com.br/samsung-galaxy-j2-core-dual-sim-16-gb-preto-1-gb-ram/p/MLB15030554",
        result:[]
    },
    {
        siteName:"Americanas",
        pageUrl:"https://www.americanas.com.br/produto/134174786/smartphone-samsung-galaxy-j2-core-16gb-dual-chip-android-8-1-tela-5-quad-core-1-4ghz-4g-camera-8mp-preto?pfm_carac=samsung%20galaxy%20j2&pfm_page=search&pfm_pos=grid&pfm_type=search_page",
        result:[]
    },
    {
        siteName:"Amazon",
        pageUrl:"https://www.amazon.com.br/Smartphone-Samsung-Galaxy-Core-Preto/dp/B089QRMWTK/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=Samsung+Galaxy+J2+Core+16GB&qid=1600733103&sr=8-1",
        result:[]
    },
    {
        siteName:"Magazine Luiza",
        pageUrl:"https://www.magazineluiza.com.br/smartphone-galaxy-j2-core-16gb-5-dual-chip-4g-preto-samsung/p/bg7f32k83f/te/gaj2/",
        result:[]
    },
    {
        siteName:"Casas Bahia",
        pageUrl:"https://www.casasbahia.com.br/TelefoneseCelulares/Smartphones/Android/smartphone-samsung-galaxy-j2-core-16gb-dual-chip-android-81-quadcore-14-ghz-cam-8mp-preto-14714568.html?IdSku=14714568",
        result:[]
    },
    {
        siteName:"Submarino",
        pageUrl:"https://www.submarino.com.br/produto/1735124813/smartphone-samsung-galaxy-j2-core-16gb-dual-chip-android-go-8-1-tela-5-quad-core-4g-camera-8mp-preto?pfm_carac=samsung%20galaxy%20j2&pfm_page=search&pfm_pos=grid&pfm_type=search_page",
        result:[]
    },
    {
        siteName:"Carrefour",
        pageUrl:"https://www.carrefour.com.br/Novo-Smartphone-Samsung-Galaxy-J2-Core-Preto-16GB-5-Android-8-1-Oreo-SM-J260M-DS/p/MV23864369",
        result:[]
    },
    {
        siteName:"Extra",
        pageUrl:"https://www.extra.com.br/TelefoneseCelulares/Smartphones/Android/smartphone-samsung-galaxy-j2-core-preto-16gb-tela-5-camera-traseira-8mp-com-flash-led-android-go-8-1-dual-chip-4g-e-processador-quad-core-55005952.html?IdSku=55005952",
        result:[]
    },
    {
        siteName:"Shoptime",
        pageUrl:"https://www.shoptime.com.br/produto/134174786/smartphone-samsung-galaxy-j2-core-16gb-dual-chip-android-8-1-tela-5-quad-core-1-4ghz-4g-camera-8mp-preto?pfm_carac=galaxy%20j2&pfm_page=search&pfm_pos=grid&pfm_type=search_page",
        result:[]
    },
    {
        siteName:"AliExpress",
        pageUrl:"https://pt.aliexpress.com/item/4000417762721.html?spm=a2g0o.productlist.0.0.7c5ebddbDHESll&algo_pvid=e0ca1220-e289-4241-a2da-3bdf78f6d22c&algo_expid=e0ca1220-e289-4241-a2da-3bdf78f6d22c-2&btsid=0ab6f82216007340195264907e6202&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_",
        result:[]
    },
    {
        siteName:"Netshoes",
        pageUrl:"https://www.netshoes.com.br/smartwatch-samsung-galaxy-watch-active2-44mm-4gb-preto-817-9605-006",
        result:[]
    },
    {
        siteName:"Elo7",
        pageUrl:"https://www.elo7.com.br/capinha-personalizada-samsung-gran-prime/dp/95E94F?pp=2&pn=1&nav=sch_pd_sr_1_2&qrid=9C65rSeTRInF#wpm=0&drzv=1&rcp=1&hpa=0&pso=up&ps2=1&sdps=0&dwhc=1&rch=1&hsv=1&bf=0&pcpe=1&ucrq=1&npc=1&supc=1&pnt=0&spsem=0&carf=1&paok=0&droam=0&df=d&rps=0&srm=1&vpl=1&fsfv=0&ssl=0&sew=0&dld=1&dqs=1&sms=0&spc=1&staa=0&smsm=0&usb=1&sseov=1&ses=0&rcpd=1&sei=0&disc=1&suf=0&uje=0&sura=1&smps=0&rfn=0&sedk=1&scsa=0&sewb=0&uso=o&smc=1&idfs=1&sum=0&sep=0&auto=1&cpr=0&utp=1&accb=0&fnc=0&secpl=0&doar=0&inp=0&sed=0",
        result:[]
    },
    {
        siteName:"Renner",
        pageUrl:"https://www.lojasrenner.com.br/p/calca-em-moletom-com-recortes/-/A-549801180-br.lr?sku=549801235",
        result:[]
    }
];

console.log('Running...');

pages.forEach(function (target){
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