# Sistema de Aprovação de Pedidos de Férias

Aplicação desenvolvida em **Google Apps Script**, integrada ao **Google Forms** e ao **Google Sheets**, para organizar o fluxo de solicitação e aprovação de férias.

O funcionário faz a solicitação por meio de um formulário. O pedido é registrado na planilha, o sistema identifica o gestor responsável e envia um e-mail com os dados da solicitação e os links para aprovação ou reprovação.

Depois da decisão, o status do pedido é atualizado e o funcionário recebe uma notificação.

## Como funciona

O fluxo do sistema é:

```text
Funcionário
    ↓
Google Forms
    ↓
Planilha de pedidos
    ↓
Processamento do pedido
    ↓
E-mail para o gestor
    ↓
Web App
    ↓
Aprovar ou reprovar
    ↓
Atualização do pedido
    ↓
E-mail para o funcionário
```

O Google Forms é a porta de entrada do sistema. O funcionário não precisa acessar a planilha para criar o pedido.

## Como usar

### 1. Fazer um pedido

O funcionário acessa o **Google Forms** disponibilizado pela empresa e preenche os dados solicitados.

Após o envio, a resposta fica registrada na planilha usada pelo sistema.

### 2. Processamento do pedido

O sistema verifica os pedidos ainda não processados e procura os dados do funcionário e do gestor.

Quando encontra as informações necessárias, o pedido recebe um ID e o gestor recebe um e-mail com:

- dados do funcionário;
- período solicitado;
- saldo de horas;
- link para aprovar;
- link para reprovar.

### 3. Aprovar ou reprovar

O gestor acessa um dos links recebidos no e-mail.

Antes de permitir a decisão, o Web App verifica o pedido e a identidade do usuário. O usuário precisa ser o gestor associado à solicitação.

Depois da confirmação, o sistema registra:

- `Aprovado`; ou
- `Reprovado`.

O funcionário recebe um e-mail informando o resultado.

## Tecnologias

- Google Apps Script
- Google Forms
- Google Sheets
- JavaScript
- HtmlService
- MailApp
- Session
- LockService

## Estrutura do projeto

```text
01_Entradas.gs
02_Pedidos.gs
03_Colaboradores.gs
04_Notificacoes.gs
05_Apresentacao.gs
06_Utilitarios.gs
07_Servicos.gs
```

### `01_Entradas.gs`

Contém os pontos de entrada do sistema.

É onde ficam funções como `doGet()` e o início do processamento dos pedidos.

### `02_Pedidos.gs`

Responsável pela leitura e atualização dos pedidos na planilha.

Entre as principais funções estão:

```text
buscarPedidos()
buscarPedidoPorId()
salvarPedido()
```

Os pedidos são representados como objetos para facilitar o acesso aos seus dados.

Exemplo:

```javascript
{
  linha,
  emailFuncionario,
  dataInicio,
  dataFim,
  id,
  status,
  emailEnviado
}
```

A propriedade `linha` indica a posição do pedido na planilha e é usada quando o registro precisa ser atualizado.

### `03_Colaboradores.gs`

Responsável pela busca dos dados dos colaboradores.

A fonte utilizada atualmente é uma planilha `Colaboradores`. Ela foi criada como fonte temporária durante o desenvolvimento e poderá ser substituída posteriormente por outra fonte de dados.

Os dados utilizados são:

```javascript
{
  nomeFuncionario,
  emailFuncionario,
  emailGestor,
  saldoHoras
}
```

Quando vários pedidos são processados, os colaboradores podem ser carregados uma única vez e indexados pelo e-mail.

```text
emailFuncionario → colaborador
```

### `04_Notificacoes.gs`

Responsável pela montagem e envio das notificações.

Existem dois momentos principais:

- solicitação de aprovação para o gestor;
- resultado da decisão para o funcionário.

A montagem do conteúdo e o envio são mantidos separados.

### `05_Apresentacao.gs`

Contém os HTML utilizados pelo sistema.

Inclui:

- página de confirmação;
- página de conclusão;
- conteúdo dos e-mails.

A camada de apresentação não é responsável por acessar diretamente a planilha ou tomar decisões de negócio.

### `06_Utilitarios.gs`

Reúne funções auxiliares utilizadas em diferentes partes do projeto, como formatação de datas e montagem de links.

### `07_Servicos.gs`

Concentra o processamento das operações principais do sistema.

Entre elas:

```text
processarNovosPedidos()
processarNovoPedido()
executarDecisaoPedido()
processarAprovacaoPedido()
```

A ideia é manter o fluxo principal separado das funções responsáveis por buscar dados, montar HTML e enviar notificações.

## Dados da planilha

### Pedidos

Os dados principais dos pedidos ficam nas seguintes colunas:

| Coluna | Campo |
|---|---|
| B | `emailFuncionario` |
| C | `dataInicio` |
| D | `dataFim` |
| E | `id` |
| F | `status` |
| G | `emailEnviado` |

Os status utilizados são:

```text
Pendente
Aprovado
Reprovado
```

Cada pedido também possui a propriedade `linha`, que representa sua posição física na planilha.

### Colaboradores

A fonte atual utiliza:

| Coluna | Campo |
|---|---|
| B | `nomeFuncionario` |
| C | `emailFuncionario` |
| D | `emailGestor` |
| E | `saldoHoras` |

## Aprovação e reprovação

O link enviado ao gestor não altera o pedido simplesmente por ser aberto.

Primeiro, o Web App localiza o pedido e verifica o usuário autenticado. Depois apresenta a página de confirmação.

A decisão é enviada pelo próprio Web App para o processamento no servidor.

De forma simplificada:

```text
Link recebido por e-mail
        ↓
doGet()
        ↓
buscar pedido
        ↓
identificar usuário
        ↓
verificar autorização
        ↓
mostrar confirmação
        ↓
aprovar / reprovar
        ↓
executarDecisaoPedido()
        ↓
validar novamente
        ↓
atualizar pedido
        ↓
notificar funcionário
```

## Controle de acesso

A identificação do usuário é feita com:

```javascript
Session.getActiveUser().getEmail()
```

O sistema compara o usuário autenticado com o gestor associado ao pedido.

A autorização é verificada tanto quando a página é carregada quanto no momento em que a decisão é processada.

Isso evita depender apenas do que aconteceu anteriormente no navegador.

## Concorrência

As operações que podem alterar pedidos utilizam:

```javascript
LockService.getScriptLock()
```

O pedido é buscado novamente depois da aquisição do lock antes de uma decisão ser registrada.

Também existe uma verificação do status atual. Assim, se o pedido já estiver como `Aprovado` ou `Reprovado`, uma nova tentativa não deve substituir a decisão anterior.

## Desempenho

O processamento de vários pedidos evita algumas leituras desnecessárias da planilha.

Na busca de um pedido pelo ID, o sistema procura primeiro a linha correspondente e depois lê os dados daquela linha, em vez de criar objetos para todos os pedidos.

No processamento em lote, os colaboradores podem ser carregados uma vez e utilizados em memória.

O índice utiliza o e-mail do funcionário:

```text
emailFuncionario → colaborador
```

Dessa forma, as consultas seguintes utilizam o índice em vez de percorrer toda a lista de colaboradores.

As alterações de ID, status e controle de envio também são gravadas juntas no intervalo correspondente.

## Consistência do processamento

O ID do pedido é persistido antes do primeiro envio de e-mail. Dessa forma, uma nova tentativa de processamento pode continuar utilizando o mesmo ID.

Existe, porém, uma limitação do próprio fluxo: o Google Sheets e o `MailApp` não fazem parte de uma única transação.

Por isso, pode existir uma situação em que o e-mail seja enviado, mas a gravação posterior falhe. Nesse caso, uma nova tentativa pode enviar a mesma notificação novamente.

O histórico de execuções do Apps Script e os dados armazenados na planilha são utilizados para acompanhar esses casos.

## Fonte de colaboradores

A planilha `Colaboradores` é uma fonte temporária utilizada durante o desenvolvimento.

A separação dessa parte do código permite trocar a origem dos dados posteriormente sem precisar alterar toda a lógica de aprovação.

A ideia é que a aplicação possa utilizar outra planilha, arquivo ou sistema como fonte definitiva.

## Estado atual

**Release candidate — aguardando validação final de implantação.**

A refatoração principal já foi feita, incluindo:

- separação das responsabilidades;
- representação dos pedidos como objetos;
- separação da busca de colaboradores;
- separação entre abertura do Web App e execução da decisão;
- autenticação e autorização;
- proteção contra concorrência;
- redução de chamadas ao Sheets;
- processamento dos colaboradores em memória;
- índice `Map` para consultas por e-mail.

## Pontos a validar antes da publicação

- fonte definitiva de colaboradores;
- implantação do Web App;
- autenticação dos usuários;
- autorização dos gestores;
- aprovação;
- reprovação;
- processamento concorrente;
- falhas durante o envio de e-mails;
- histórico de execuções;
- configuração de acesso do Web App.

## Limitações conhecidas

2. Google Sheets e `MailApp` não possuem uma transação conjunta.
3. O `ScriptLock` é utilizado durante o processamento das operações protegidas.
4. As quotas do Apps Script e do envio de e-mails precisam ser consideradas de acordo com o volume de uso.
