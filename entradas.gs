function processarNovosPedidos() {
  var lock = LockService.getScriptLock();
  lock.waitLock(300);

  try {
    var pedidos = buscarPedidos();
    var colaboradores = buscarColaboradores()
    var indice = criarIndiceColaboradores(colaboradores);
    for (var i = 0; i < pedidos.length; i++) {
      var pedido = pedidos[i];
      processarNovoPedido(pedido, indice);
    }
  } 
  finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

function doGet(e) {
  var idClicado = e.parameter.id;
  if (!idClicado) {
    return HtmlService.createHtmlOutput("Erro: Link inválido.");
  }
  var pedido = buscarPedidoPorId(idClicado);
  if(pedido === null){
    Logger.log("Falha ao encontrar o pedido. " + idClicado);
    return HtmlService.createHtmlOutput("Erro: Pedido inválido.");
  }
  try
  {var colaborador = buscarColaborador(pedido.emailFuncionario);}
  catch(error){
    Logger.log("Colaborador não encontrado.");
    return HtmlService.createHtmlOutput("Erro: Colaborador não encontrado.");
  }
  var emailUsuario = obterUsuarioAtual();
  var podeAprovar = usuarioPodeAprovar(pedido, emailUsuario);
  if(podeAprovar){
    return HtmlService.createHtmlOutput(montarPaginaConfirmacao(pedido, colaborador));
  }
  return HtmlService.createHtmlOutput(
    "<h3>Aviso</h3>" +
    "<p>Acesso Negado.</p>"
  );
}
