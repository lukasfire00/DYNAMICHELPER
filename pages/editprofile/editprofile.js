// Define o título da página
var pageTitle = "Novo usuário";

$(document).ready(runPage);

function runPage() {
  setTitle(pageTitle); // Altera o título da página

  // Quando o formulário for enviado, executa 'sendForm'
  // (ERRO) $(document).on("submit", "#contact", sendForm); 
  $('#newuser').submit(sendForm);

  // Se alguém faz login/logout
  firebase.auth().onAuthStateChanged((userData) => {
    if (userData) {
      $("#newuser-name").val(userData.displayName);
      $("#newuser-email").val(userData.email);
      $("#newuser-avatar").val(userData.photoURL);
    }
  });
}

// Processa envio do formulário de contatos
function sendForm() {
  // Obtém e sanitiza os campos preenchidos
  var contact = {
    name: sanitizeString($("#newuser-name").val()),
    email: sanitizeString($("#newuser-email").val()),
    phone: sanitizeString($("#newuser-phone").val()),
    whatsapp: sanitizeString($("#newuser-whatsapp").val()),
    date: getSystemDate(),
    status: "enviado",
  };

  // Salva dados no banco de dados
  db.collection("contacts")
    .add(contact)

    // Se deu certo, exibe feedback
    .then(function (docRef) {
      var msg = `<blockquote>Seu contato foi enviado com sucesso.</blockquote>`;
      feedback(contact.name, msg);
    })

    // Se não deu certo, exibe mensagem de erro
    .catch(function (error) {
      var msg = `<p class="danger">Ocorreu uma falha que impediu o envio do seu contato.</p><p class="danger">A equipe do site já foi avisada sobre a falha.</p><p>Por favor, tente mais tarde.</p><p><small>${error}</small></p>`;
      feedback(contact.name, msg);
    });

  // Sai sem fazer mais nada
  return false;
}

// Exibe mensagem de feedback
function feedback(name, msg) {
  var names = name.split(" "); // Obtém somente primeiro nome do remetente
  var out = `<h4>Olá ${names[0]}!</h4>${msg}<p><em>Obrigado...</em></p>`; // Gera mensagem
  $("#feedback").html(out); // Coloca mensagem na view
  $("#contact").hide("fast"); // Oculta formulário
  $("#feedback").show("fast"); // Exibe mensagem
}
