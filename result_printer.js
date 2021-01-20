const { printTable, Table } = require('console-table-printer');
const moment = require('moment')
const productPages = require('./product-pages.json')

moment.locale('pt-br')

//Create a table
const table = new Table()

productPages.forEach(item => {
  let tableRow = { 'Nome do site': item.siteName }

  if (item.expectedPrice) {
    tableRow['Preço esperado'] = item.expectedPrice
  } else {
    tableRow['Preço esperado'] = 'Não definido'
  }

  if (item.runs.length > 0 && item.runs[item.runs.length - 1] !== null) {
    tableRow['Preço encontrado'] = item.runs[item.runs.length - 1].price
    tableRow['Data execução'] = moment(item.runs[item.runs.length - 1].timeStamp).format('DD/MM - HH:mm')
  } else {
    tableRow['Preço encontrado'] = 'Não executado'
    tableRow['Data execução'] = 'Não executado'
  }

  if (tableRow['Preço esperado'] != tableRow['Preço encontrado']){
    table.addRow(tableRow, {color: 'red'})
  }else{
    table.addRow(tableRow)
  }
  

});

//print
table.printTable();