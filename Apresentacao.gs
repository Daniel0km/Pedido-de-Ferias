function montarEmailAprovacao(nomeFuncionario,emailFuncionario, dataInicio, dataFim, saldoHoras, linkAprovar, linkReprovar){
  var html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Pedido de Férias</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          .botoes {
            margin-top: 25px;
          }

          .botao {
            display: inline-block;
            padding: 10px 20px;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
          }

          .aprovar {
            background-color: #28a745;
          }

          .reprovar {
            background-color: #dc3545;
            margin-left: 10px;
          }
        </style>
      </head>

      <body>

        <div class="container">

          <h3>Pedido de Férias Pendente de Aprovação</h3>

          <p>
            O funcionário
            <b>${nomeFuncionario}</b>
            (${emailFuncionario})
            solicitou férias.
          </p>

          <p>
            <b>Período:</b>
            de ${dataInicio} até ${dataFim}
          </p>

          <p>
            <b>Saldo de horas atual:</b>
            ${saldoHoras} horas.
          </p>

          <br>

          <p>
            Por favor, clique em um dos links abaixo para tomar sua decisão:
          </p>

          <div class="botoes">

            <a
              href="${linkAprovar}"
              class="botao aprovar">
              APROVAR
            </a>

            <a
              href="${linkReprovar}"
              class="botao reprovar">
              REPROVAR
            </a>

          </div>

        </div>

      </body>
    </html>
  `;
  return html;
}
function montarEmailStatus(dataInicio, dataFim, novoStatus) {
  if(novoStatus === "Aprovado"){
    var cor = "green"
  }else if(novoStatus === "Reprovado"){
    var cor = "red"
  }
  var html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }

          .card {
            background-color: white;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 450px;
            width: 90%;
          }

          h2 {
            margin-bottom: 20px;
            color: #333;
          }

          p {
            color: #555;
            line-height: 1.5;
          }

          .status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
            background-color: ${cor};
            margin: 10px 0 20px 0;
          }

          .periodo {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <h2>
            Pedido de férias avaliado
          </h2>

          <p>
            O seu pedido de férias foi avaliado.
          </p>

          <div class="periodo">
            <strong>Período solicitado:</strong>
            <br>
            ${dataInicio} até ${dataFim}
          </div>

          <p>
            <strong>Status da solicitação:</strong>
          </p>

          <div class="status">
            ${novoStatus}
          </div>

        </div>

      </body>
    </html>
  `;

  return html;
}
function montarPaginaAcaoConcluida(novoStatus) {
  var corFundo = (novoStatus === "Aprovado")? "#d4edda": "#f8d7da";
  var corTexto = (novoStatus === "Aprovado")? "#155724": "#721c24";
  var icone = (novoStatus === "Aprovado")? "✅": "❌";

  var html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .card {
            background-color: white;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
          }

          .icon {
            font-size: 60px;
            margin-bottom: 15px;
          }

          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            background-color: ${corFundo};
            color: ${corTexto};
            margin-bottom: 20px;
            font-size: 16px;
          }

          h2 {
            margin: 0 0 10px 0;
            color: #333;
          }

          p {
            color: #555;
            line-height: 1.5;
            margin: 0;
            font-size: 15px;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <div class="icon">
            ${icone}
          </div>

          <h2>Ação Concluída</h2>

          <div class="status-badge">
            Pedido ${novoStatus}
          </div>

          <p>
            A planilha foi atualizada automaticamente e um e-mail de notificação
            já foi enviado ao funcionário.
          </p>

        </div>

      </body>
    </html>
  `;

  return html;
}
function montarPaginaConfirmacao(pedido, colaborador) {

  var idPedido = JSON.stringify(pedido.id);

  var html = `
    <!DOCTYPE html>
    <html lang="pt-BR">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Pedido de Férias</title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            color: #333;

            display: flex;
            justify-content: center;
            align-items: center;

            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }

          .container {
            width: 100%;
            max-width: 600px;
          }

          .card {
            background-color: #fff;
            padding: 35px;

            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .titulo {
            margin-top: 0;
            margin-bottom: 25px;

            color: #333;
            font-size: 24px;
            text-align: center;
          }

          .informacao {
            margin-bottom: 18px;
            line-height: 1.6;
          }

          .informacao strong {
            color: #222;
          }

          .periodo,
          .saldo {
            background-color: #f8f9fa;
            padding: 15px;

            border-radius: 8px;
            margin: 15px 0;
          }

          .mensagem {
            margin-top: 25px;
            margin-bottom: 20px;

            color: #555;
            line-height: 1.5;
          }

          .botoes {
            display: flex;
            gap: 12px;
            margin-top: 25px;
          }

          .botao {
            flex: 1;

            border: none;
            border-radius: 6px;

            padding: 12px 20px;

            color: white;
            font-size: 15px;
            font-weight: bold;

            cursor: pointer;
            transition: opacity 0.2s, transform 0.1s;
          }

          .botao:hover {
            opacity: 0.9;
          }

          .botao:active {
            transform: scale(0.98);
          }

          .botao:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .aprovar {
            background-color: #28a745;
          }

          .reprovar {
            background-color: #dc3545;
          }

          #resultado {
            display: none;

            margin-top: 20px;
            padding: 15px;

            border-radius: 8px;
            text-align: center;
            line-height: 1.5;
          }

          .sucesso {
            display: block !important;
            background-color: #d4edda;
            color: #155724;
          }

          .erro {
            display: block !important;
            background-color: #f8d7da;
            color: #721c24;
          }

          .carregando {
            display: block !important;
            background-color: #e9ecef;
            color: #495057;
          }

          @media (max-width: 500px) {

            .card {
              padding: 25px 20px;
            }

            .titulo {
              font-size: 21px;
            }

            .botoes {
              flex-direction: column;
            }

            .botao {
              width: 100%;
            }
          }

        </style>

        <script>

          function executarDecisao(acao) {

            var botoes = document.querySelectorAll(".botao");
            var resultado = document.getElementById("resultado");

            // Evita que o usuário clique duas vezes
            botoes.forEach(function(botao) {
              botao.disabled = true;
            });

            resultado.className = "carregando";
            resultado.textContent = "Processando sua decisão...";

            google.script.run.withSuccessHandler(function(resposta) {
              if (!resposta) {
                mostrarErro("Erro inesperado: o sistema não retornou uma resposta.");
                return;
              }

              switch (resposta.codigo) {

                case "SUCESSO":
                  mostrarSucesso(resposta);
                  break;

                case "ACESSO_NEGADO":
                  mostrarErro(
                    "Você não possui autorização para decidir este pedido."
                  );
                  break;

                case "PEDIDO_NAO_ENCONTRADO":
                  mostrarErro(
                    "O pedido não foi encontrado no sistema."
                  );
                  break;

                default:
                  mostrarErro(
                    "Ocorreu um erro inesperado ao processar a decisão."
                  );
                  break;
              }

            })
              .withFailureHandler(function(erro) {

                mostrarErro(
                  "Ocorreu um erro ao processar a decisão: " +
                  erro.message
                );

              })
              .executarDecisaoPedido(${idPedido}, acao);
          }


          function mostrarSucesso(resposta) {

            var botoes = document.querySelectorAll(".botao");
            var resultado = document.getElementById("resultado");

            botoes.forEach(function(botao) {
              botao.disabled = true;
            });

            resultado.className = "sucesso";

            resultado.innerHTML =
              "<strong>Decisão registrada com sucesso.</strong><br>" +
              "O pedido foi atualizado no sistema.";
          }


          function mostrarErro(mensagem) {

            var botoes = document.querySelectorAll(".botao");
            var resultado = document.getElementById("resultado");

            botoes.forEach(function(botao) {
              botao.disabled = false;
            });

            resultado.className = "erro";
            resultado.textContent = mensagem;
          }

        </script>

      </head>


      <body>

        <div class="container">

          <div class="card">

            <h1 class="titulo">
              Pedido de Férias
            </h1>


            <div class="informacao">
             O funcionário
              <strong>${colaborador.nomeFuncionario}</strong>
              (${pedido.emailFuncionario})
              solicitou férias.
            </div>
            <div class="periodo">
              <strong>Período solicitado:</strong>
             <br>
             De ${pedido.dataInicio}
             até ${pedido.dataFim}
            </div>
            <div class="saldo">
              <strong>Saldo de horas atual:</strong>
              <br>
              ${colaborador.saldoHoras} horas.
            </div>
            <div class="mensagem">
              Por favor, selecione uma das opções abaixo
              para registrar sua decisão sobre este pedido.
            </div>

            <div class="botoes">

              <button
                type="button"
                class="botao aprovar"
                onclick="executarDecisao('aprovar')">

                APROVAR
              </button>

              <button
                type="button"
                class="botao reprovar"
                onclick="executarDecisao('reprovar')">

                REPROVAR
              </button>
            </div>
            <div id="resultado"></div>
          </div>
        </div>
      </body>
    </html>
  `;
  return html;
}
