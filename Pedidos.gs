function buscarPedidos() {
  let listaPedidos = [];

  var plan = SpreadsheetApp.getActiveSpreadsheet();
  var abaPedidos = plan.getSheetByName("Pedidos");
  var dadosPedidos = abaPedidos.getDataRange().getValues();

  for (var i = 1; i < dadosPedidos.length; i++) {
    var emailFuncionario = dadosPedidos[i][1]; // Coluna B
    var dataInicio = dadosPedidos[i][2];       // Coluna C
    var dataFim = dadosPedidos[i][3];          // Coluna D
    var id = dadosPedidos[i][4];               // Coluna E
    var status = dadosPedidos[i][5];           // Coluna F
    var emailEnviado = dadosPedidos[i][6];     // Coluna G
    var linha = i + 1; 

    var pedido = {
      linha,
      emailFuncionario,
      dataInicio,
      dataFim,
      id,
      status,
      emailEnviado
    };

    listaPedidos.push(pedido);
  }

  return listaPedidos;
}
function salvarPedido(pedido){
  var plan = SpreadsheetApp.getActiveSpreadsheet();
  var abaPedidos = plan.getSheetByName("Pedidos");
  var dados = [[pedido.id, pedido.status, pedido.emailEnviado]]
  abaPedidos.getRange(pedido.linha, 5, 1, 3).setValues(dados);
}
function buscarPedidoPorIdNaMemoria(idPedido, pedidos){
  for(var i = 0; i < pedidos.length; i++){
    var pedido = pedidos[i];
    if(pedido.id === idPedido){
      return pedido;
    }
  }
  return null;
}
function buscarPedidoPorId(idPedido) {
  var plan = SpreadsheetApp.getActiveSpreadsheet();
  var abaPedidos = plan.getSheetByName("Pedidos");
  var ultimaLinha = abaPedidos.getLastRow();
  if (ultimaLinha < 2) {
    return null;
  }
  // Procura o ID na coluna E, começando pela linha 2
  var ids = abaPedidos.getRange(2, 5, ultimaLinha - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === idPedido) {
      var linha = i + 2;
      var dados = abaPedidos.getRange(linha, 2, 1, 6).getValues()[0];
      var pedido = {
        linha: linha,
        emailFuncionario: dados[0],
        dataInicio: dados[1],
        dataFim: dados[2],
        id: dados[3],
        status: dados[4],
        emailEnviado: dados[5]
      };
      return pedido;
    }
  }
  return null;
}
function prepararPedidoParaEnvio(pedido) {
  if (!pedido.id || pedido.id === "") {
    pedido.id = Utilities.getUuid();
    salvarPedido(pedido);
  }
  return pedido;
}
