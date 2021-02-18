const jsonData = require('./personal-products.json')
const fs = require('fs');
const moment = require('moment');

function generateChartData() {

    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#3366cc", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac", "#b77322", "#16d620", "#b91383", "#f4359e", "#9c5935", "#a9c413", "#2a778d", "#668d1c", "#bea413", "#0c5922", "#743411"]

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
            dataset.lineTension = 0.15
            dataset.spanGaps = true
            var thisColor = colors[Math.floor(Math.random() * Math.floor(18))]
            dataset.backgroundColor = thisColor
            dataset.borderColor = thisColor
            var runData = []
            var xY = {}
            item.runs.forEach(run => {
                xY = {}
                if (run !== null) {
                    xY.x = run.timeStamp
                    xY.y = run.price[0]
                    if (chartLabels.has(run.timeStamp)) {
                        runData.push(xY)
                    }
                }
            })
            dataset.data = runData
            chartData.push(dataset)
        }
    })

    //COLOCA STRING DE DATAS
    /*var days = []
    chartLabels.forEach(label => {
        days.push(moment(label).locale('pt-br').format('L, h'))
    })
    
    data.labels = days*/

    data.datasets = chartData

    fs.writeFileSync('chartData.json', JSON.stringify(data, null, 2)) //Escreve novos resultados no JSON
}

generateChartData()