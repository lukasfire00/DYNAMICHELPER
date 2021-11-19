// Define o título da página
var pageTitle = "Editando seu pedido";

var id = '';

$(document).ready(runPage);

function runPage() {
  setTitle(pageTitle); // Altera o título da página

  // Obtém o ID do artigo da URL
   id = location.search.replace('?', '');

  console.log('servico:', id);

  // Quando o formulário for enviado, executa 'sendForm'
  // (ERRO) $(document).on("submit", "#contact", sendForm); 
  $('#editservice').submit(sendForm);

  // Se alguém faz login/logout
  firebase.auth().onAuthStateChanged((userData) => {
    if (userData) {

      db.collection('services').doc(id)
        .onSnapshot((doc) => {

          if (doc.exists) {                       // Se artigo existe
            var art = doc.data();

            $('#editservice-title').val(art.title);
            $('#editservice-subject').val(art.intro);
            $('#editservice-message').val(art.description);
          }

        });


    } else {
      loadPage('login');
    }
  });
}

// Processa envio do formulário de contatos
function sendForm() {
  // Obtém e sanitiza os campos preenchidos
  var editService = {
    title: sanitizeString($("#editservice-title").val()),
    subject: sanitizeString($("#editservice-subject").val()),
    description: sanitizeString($("#editservice-message").val()),
    // date: getSystemDate(),
    // status: "ativo",
  };

  // Salva dados no banco de dados
  db.collection("services").doc(id)
    .update(editService)

    // Se deu certo, exibe feedback
    .then(function (docRef) {
      var msg = `<blockquote>Seu serviço foi alterado com sucesso.</blockquote>`;
      feedback(msg);
    })

    // Se não deu certo, exibe mensagem de erro
    .catch(function (error) {
      var msg = `<p class="danger">Ocorreu uma falha que impediu a alteração do seu serviço.</p><p class="danger">A equipe do site já foi avisada sobre a falha.</p><p>Por favor, tente mais tarde.</p><p><small>${error}</small></p>`;
      feedback(msg);
    });



  // Sai sem fazer mais nada
  return false;
}

// Exibe mensagem de feedback
function feedback(msg) {
  var out = `<h4>Olá!</h4>${msg}<p><em>Obrigado...</em></p>`; // Gera mensagem
  $("#feedback").html(out); // Coloca mensagem na view
  $("#editservice").hide("fast"); // Oculta formulário
  $("#feedback").show("fast"); // Exibe mensagem
}

