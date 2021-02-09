const jsonData = require('./personal-products.json')
const fs = require('fs');

function generateChartData() {

    var data = {}
    var chartData = []

    //LIMPA OS TIMESTAMPS PARA DEIXAR APENAS OS DIAS E MONTAR AS LABELS DO CHART
    var chartLabels = []
    jsonData.forEach(item => {
        if (item.runs) {
            item.runs.forEach(run => {
                if (run !== null) {
                    let dayOnly = new Date(run.timeStamp)
                    dayOnly = dayOnly.setHours(dayOnly.getHours(), 0, 0, 0)
                    run.timeStamp = dayOnly
                    chartLabels.push(run.timeStamp)
                }
            })
        }
    })

    chartLabels = new Set(chartLabels)
    data.labels = Array.from(chartLabels)

    //CRIA A ESTRUTURA DE OBJETOS PARA O GRAFICO
    jsonData.forEach(item => {
        var dataset = {}
        if (item.runs) {
            dataset.label = item.siteName
            dataset.fill = false
            var runData = []
            var xY = {}
            item.runs.forEach(run => {
                xY = {}
                if (run !== null) {
                    xY.x = run.timeStamp
                    xY.y = run.price[0]
                    if ( chartLabels.has(run.timeStamp) ) {
                        runData.push(xY)
                    }
                }
            })
            dataset.data = runData
            chartData.push(dataset)
        }
    })
    data.datasets = chartData

    fs.writeFileSync('chartData.json', JSON.stringify(data, null, 2)) //Escreve novos resultados no JSON
}

generateChartData()