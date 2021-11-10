// Define o título da página
var pageTitle = "Faça seu pedido";

$(document).ready(runPage);

function runPage() {
  setTitle(pageTitle); // Altera o título da página

  // Quando o formulário for enviado, executa 'sendForm'
  // (ERRO) $(document).on("submit", "#contact", sendForm); 
  $('#newservice').submit(sendForm);

}

// Processa envio do formulário de contatos
function sendForm() {
  // Obtém e sanitiza os campos preenchidos
  var newServices = {
    title: sanitizeString($("#newservice-title").val()),
    intro: sanitizeString($("#newservice-intro").val()),
    description: sanitizeString($("#newservice-description").val()),
    date: getSystemDate(),
    uid: user.uid,
    status: "enviado",
  };

  // Salva dados no banco de dados
  db.collection("services")
    .add(newServices)

    // Se deu certo, exibe feedback
    .then(function (docRef) {
      var msg = `<blockquote>Seu anúncio foi cadastrado com sucesso.</blockquote>`;
      feedback (msg);
    })

    // Se não deu certo, exibe mensagem de erro
    .catch(function (error) {
      var msg = `<p class="danger">Ocorreu uma falha que impediu o cadastro do seu anúncio.</p><p class="danger">A equipe do site já foi avisada sobre a falha.</p><p>Por favor, tente mais tarde.</p><p><small>${error}</small></p>`;
      feedback(newServices.name, msg);
    });

  // Sai sem fazer mais nada
  return false;
}

// Exibe mensagem de feedback
function feedback(msg) {
   var out = `<h4>Olá!</h4>${msg}<p><em>Obrigado...</em></p>`; // Gera mensagem
  $("#feedback").html(out); // Coloca mensagem na view
  $("#newservice").hide("fast"); // Oculta formulário
  $("#feedback").show("fast"); // Exibe mensagem
}
