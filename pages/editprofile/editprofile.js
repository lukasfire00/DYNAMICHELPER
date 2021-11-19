// Define o título da página
var pageTitle = "Editor de Perfil";

$(document).ready(runPage);

function runPage() {
  setTitle(pageTitle); // Altera o título da página

  // Quando o formulário for enviado, executa 'sendForm'
  // (ERRO) $(document).on("submit", "#contact", sendForm); 
  $('#editprofile').submit(sendForm);

  firebase.auth().onAuthStateChanged((userData) => {
    if (userData) {
      $("#editprofile-name").val(userData.displayName);
      $("#editprofile-email").val(userData.email);
      $("#editprofile-avatar").val(userData.photoURL);

      db.collection("users").doc(userData.uid).get().then((doc) => {
        if (doc.exists) {
          // Cadastro encontrado
          //console.log("Document data:", doc.data());

          form = doc.data();
        
        $('#editprofile-name').val(form.name);
        $('#editprofile-email').val(form.email);
        $('#editprofile-phone').val(form.phone);
        $('#editprofile-whatsapp').val(form.whatsapp);
        $('#editprofile-zip').val(form.zip);
        $('#editprofile-state').val(form.state);
        $('#editprofile-city').val(form.city);
        $('#editprofile-profile').val(form.profile);
          
        } else {
          // Cadastro não encontrado
          // console.log("No such document!");
          loadPage('editprofile');
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

    } else {
      loadPage('login');
    }
  });
}

// Processa envio do formulário de contatos
function sendForm() {
  // Obtém e sanitiza os campos preenchidos
  var editProfile = {
    name: sanitizeString($("#editprofile-name").val()),
    email: sanitizeString($("#editprofile-email").val()),
    phone: sanitizeString($("#editprofile-phone").val()),
    whatsapp: sanitizeString($("#editprofile-whatsapp").val()),
    zip: sanitizeString($("#editprofile-zip").val()),
    state: sanitizeString($("#editprofile-state").val()),
    city: sanitizeString($("#editprofile-city").val()),
    profile: sanitizeString($("#editprofile-profile").val()),
    // date: getSystemDate(),
    // status: "ativo",
    // uid: userId
  };

  // Obtém Id do user
  userId = JSON.parse(getCookie('userData')).uid;

  // Salva dados no banco de dados
  db.collection("users").doc(userId)
    .update(editProfile)

    // Se deu certo, exibe feedback
    .then(function (docRef) {
      var msg = `<blockquote>Seu Perfil foi alterado com sucesso.</blockquote>`;
      feedback(editProfile.name, msg);
    })

    // Se não deu certo, exibe mensagem de erro
    .catch(function (error) {
      var msg = `<p class="danger">Ocorreu uma falha que impediu a alteração do seu Perfil.</p><p class="danger">A equipe do site já foi avisada sobre a falha.</p><p>Por favor, tente mais tarde.</p><p><small>${error}</small></p>`;
      feedback(editProfile.name, msg);
    });

  // Sai sem fazer mais nada
  return false;
}

// Exibe mensagem de feedback
function feedback(name, msg) {
  var names = name.split(" "); // Obtém somente primeiro nome do remetente
  var out = `<h4>Olá ${names[0]}!</h4>${msg}<p><em>Obrigado...</em></p>`; // Gera mensagem
  $("#feedback").html(out); // Coloca mensagem na view
  $("#editprofile").hide("fast"); // Oculta formulário
  $("#feedback").show("fast"); // Exibe mensagem
}
