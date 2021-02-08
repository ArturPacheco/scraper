const jsonData = require('./personal-products.json')

function generateChartData() {

    var chartData = []

    jsonData.forEach(item => {
        if (item.runs) {
            item.runs.forEach(run => {
                if (run !== null) {
                    let dayOnly = new Date(run.timeStamp)
                    dayOnly = dayOnly.setHours(0, 0, 0, 0)
                    run.timeStamp = dayOnly
                } else {
                    chartData
                }
                
            })
        }
        
    })

    /*var daysBuffer = []
    days.forEach(item => {
        if (item !== null) {
            let dayOnly = new Date(item)
            dayOnly = dayOnly.setHours(0, 0, 0, 0)
            daysBuffer.push(dayOnly)
        } else {
            daysBuffer.push(null)
        }
    })*/

    //days = new Set(daysBuffer)

    console.log(days)
}

generateChartData()