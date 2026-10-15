function processarNovoPedido(pedido, indice) {
  if (pedido.emailEnviado === "SIM" || pedido.emailFuncionario === "") {
    return;
  }
  
  try {
    var colaboradorEncontrado = buscarColaboradorNoIndice(
      pedido.emailFuncionario,
      indice
    );
  } catch (e) {
    Logger.log("Ocorreu um erro: " + e.message);
    return;
  }

  var nomeFuncionario = colaboradorEncontrado.nomeFuncionario;
  var emailGestor = colaboradorEncontrado.emailGestor;
  var saldoHoras = colaboradorEncontrado.saldoHoras;

  if (emailGestor === "") {
    Logger.log("Não foi possível encontrar o e-mail do gestor desse colaborador.");
    return;
  }

  var inicioFormatado = pedido.dataInicio instanceof Date? Utilities.formatDate(pedido.dataInicio,Session.getScriptTimeZone(),"dd/MM/yyyy"): pedido.dataInicio;

  var fimFormatado = pedido.dataFim instanceof Date? Utilities.formatDate(pedido.dataFim,Session.getScriptTimeZone(),"dd/MM/yyyy"): pedido.dataFim;

  // Garante que o pedido tenha um ID persistido antes do envio.
  prepararPedidoParaEnvio(pedido);

  var link = montarLinks(pedido.id);

  var assunto = "Aprovação Necessária: Pedido de Férias - " + nomeFuncionario;

  try {
    MailApp.sendEmail({
      to: emailGestor,
      subject: assunto,
      htmlBody: montarEmailAprovacao(nomeFuncionario,pedido.emailFuncionario,inicioFormatado,fimFormatado,saldoHoras,link.aprovar,link.reprovar)
    });
  } catch (e) {
    Logger.log("Não foi possível enviar o e-mail. " + e.message);
    return;
  }

  pedido.status = "Pendente";
  pedido.emailEnviado = "SIM";

  salvarPedido(pedido);
}
function processarAprovacaoPedido(pedido, acao){ 
  var dataInicio = (pedido.dataInicio instanceof Date)? Utilities.formatDate(pedido.dataInicio,Session.getScriptTimeZone(),"dd/MM/yyyy"): pedido.dataInicio;

  var dataFim = (pedido.dataFim instanceof Date)? Utilities.formatDate(pedido.dataFim,Session.getScriptTimeZone(),"dd/MM/yyyy"):pedido.dataFim;
  var novoStatus = "";
  if (pedido.status === "Aprovado" || pedido.status === "Reprovado") {
    return {
      codigo: "JA_RESPONDIDO",
      status: pedido.status
    };
  }
  switch (acao){
    case "aprovar":
      novoStatus = "Aprovado"
      
    break
    case "reprovar":
      novoStatus = "Reprovado"
    break
    default:
      return {
        codigo: "ACAO_INVALIDA"
      };
  }
  var assuntoFunc = "Atualização do Pedido de Férias: " + novoStatus;
  var corpoHTMLFunc = montarEmailStatus(dataInicio, dataFim, novoStatus);

  try{
    MailApp.sendEmail({
    to: pedido.emailFuncionario,
    subject: assuntoFunc,
    htmlBody: corpoHTMLFunc
  });
  }catch(erro){
    Logger.log("Não foi possível enviar o e-mail." + erro.message);
    return {
      codigo: "ERRO_ENVIO"
    };
  }

  pedido.status = novoStatus
  salvarPedido(pedido); 
  return{
    codigo: "SUCESSO",
    status: novoStatus
  }
}
function executarDecisaoPedido(id, acao){
  var pedido = buscarPedidoPorId(id);
  if(pedido === null){
    Logger.log("Falha ao encontrar o pedido. " + id);
    return {
      codigo: "PEDIDO_NAO_ENCONTRADO"
    };
  }
  var usuario = obterUsuarioAtual();
  var podeDecidir = usuarioPodeDecidirPedido(pedido,usuario);
  if(podeDecidir){
    var processar = processarAprovacaoPedido(pedido, acao);
    return processar;
  } 
  Logger.log("Usuário não autorizado para decidir este pedido.");
  return {
      codigo: "ACESSO_NEGADO"
    }; 
}
function obterUsuarioAtual() {
  return Session.getActiveUser().getEmail(); 
}
function usuarioPodeDecidirPedido(pedido, emailUsuario){
  try
  {var colaborador = buscarColaborador(pedido.emailFuncionario);}
  catch(error){
    return false
  }
  if(colaborador.emailGestor === emailUsuario){
    return true;
  }return false;
}
