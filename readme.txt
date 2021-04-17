Para utilizar o programa é necessário atualizar o arquivo "product-pages.json" com os dados do produto que deseja consultar utilizando o seguinte template:

[
  {
    "siteName": "Site para consulta 1",       <== NOME DO SITE
    "pageUrl": "www.paginadoproduto1.com.br", <== LINK DA PÁGINA DO PRODUTO
    "expectedPrice": 8500,                    <== PREÇO DO PRODUTO CASO QUEIRA
    "runs": []
  },
  {
    "siteName": "Site para consulta 2",
    "pageUrl": "www.paginadoproduto2.com.br",
    "expectedPrice": 697.9, <== PREÇO DO PRODUTO CASO QUEIRA
    "runs": []
  },
  {
      ... <== ADICIONE MAIS CONFORME NECESSÁRIO
  }
]

Depois disso basta executar na linha de comando:
"node puppeteerCluster.js" <== Executa as consultas
"node result_printer.js"  <== Exibe a tabela de resultados com a última consulta