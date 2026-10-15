function montarLinks(pedidoId){
  var urlWebApp = "Link do GoogleWebApp";
  var linkAprovar = urlWebApp + "?id=" + encodeURIComponent(pedidoId) + "&acao=aprovar";
  var linkReprovar = urlWebApp + "?id=" + encodeURIComponent(pedidoId) + "&acao=reprovar";
  return {
    aprovar: linkAprovar,
    reprovar: linkReprovar
  };
}
