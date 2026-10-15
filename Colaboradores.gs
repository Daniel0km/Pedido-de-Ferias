function buscarColaboradores() {
  let listaColaboradores = [];

  var plan = SpreadsheetApp.getActiveSpreadsheet();
  var abaColab = plan.getSheetByName("Colaboradores");
  var dadosColab = abaColab.getDataRange().getValues();

  for (var i = 1; i < dadosColab.length; i++) {
    var nomeFuncionario = dadosColab[i][1]; // Coluna B
    var emailFuncionario = dadosColab[i][2]; // Coluna C
    var emailGestor = dadosColab[i][3];     // Coluna D
    var saldoHoras = dadosColab[i][4];      // Coluna E

    var colaborador = {
      nomeFuncionario,
      emailFuncionario,
      emailGestor,
      saldoHoras
    };

    listaColaboradores.push(colaborador);
  }

  return listaColaboradores;
}
function buscarColaborador(emailFuncionario){
  var plan = SpreadsheetApp.getActiveSpreadsheet();
  var abaColab = plan.getSheetByName("Colaboradores");
  var ultimaLinha = abaColab.getLastRow();
  var email = abaColab.getRange(2, 3, ultimaLinha - 1, 1).getValues();
  for (var i = 0; i < email.length; i++) {
    if (email[i][0] === emailFuncionario) {
      var linha = i + 2;
      var dados = abaColab.getRange(linha, 2, 1, 4).getValues()[0];
      var colaborador = {
        linha,
        nomeFuncionario: dados[0],
        emailFuncionario: dados[1],
        emailGestor: dados[2],
        saldoHoras: dados[3]
      };
      return colaborador;
    }
  }  
  throw new Error ("Colaborador não encontrado.");
}
function buscarColaboradorNoIndice(emailFuncionario, indice){
  const colaborador = indice.get(emailFuncionario)
  if(colaborador){
    return colaborador;
  }
  throw new Error ("Colaborador não encontrado.");
}
function criarIndiceColaboradores(colaboradores){
  var map = new Map();
  for(var  i = 0; i<colaboradores.length; i++){
    var colaborador = colaboradores[i];
    map.set(colaborador.emailFuncionario, colaborador)
  }
  return map;
}
