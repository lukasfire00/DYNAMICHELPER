/***** Configurações do aplicativo *****/
var siteName = "ProjetoDois"; // Define nome do site
var user = {}; // Global que armazenará dados do usuário logado

if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}

$(document).ready(runApp); // Quando documento estiver pronto, executa aplicativo

/***** Aplicativo principal (Eventos) *****/
function runApp() {

  loadPage("home"); // Carrega página inicial

  $(document).on("click", "a", routerLink); // Monitora cliques nos links
  $(document).on("click", ".modal", closeModal); // Monitora cliques no modal

  // Se alguém fizer login/logout (observer)...
  firebase.auth().onAuthStateChanged((userData) => {
    if (userData) {
      // Se tem usuário logado

      // Atualiza view --> <nav>...</nav>
      $("#userInOut").html(`
<a id="profile" href="profile" class="user-logo" title="${userData.displayName}">
  <img src="${userData.photoURL}" alt="${userData.displayName}"><span>Perfil</span>
</a>`);
    } else {
      // Se não tem usuário logado

      // Atualiza view --> <nav>...</nav>
      $("#userInOut").html(`
<a href="login" id="login" class="user-logo" title="Entrar / Login">
  <img src="img/user.png" alt="Logue-se!"><span>Entrar</span>
</a>`);
    }
  });

}

// Carrega uma página completa
function loadPage(pagePath, pageName = "") {
  var page = {}; // Armazena dados da rota
  var parts = pagePath.split("?"); // Divide a rota em partes

  // Gera endereço da página
  if (parts.length == 1) {
    // Se é uma rota simples
    page.url = `${parts[0]}`; // Define endereço da página
  } else {
    // Se a rota contém variáveis (search) após '?'
    page.url = `${parts[0]}?${parts[1]}`; // Define endereço da página
  }

  // Gera caminhos para HTML, CSS e JS
  page.html = `pages/${parts[0]}/${parts[0]}.html`;
  page.css = `pages/${parts[0]}/${parts[0]}.css`;
  page.js = `pages/${parts[0]}/${parts[0]}.js`;

  // Carrega CSS da página
  $("#pageCSS").load(page.css, () => {

    // Carrega HTML da página
    $("#pageHTML").load(page.html, () => {

      // Carrega e executa JavaScript
      $.getScript(page.js, () => {

        // Atualiza URL da aplicação
        window.history.replaceState("", "", page.url);
      });
    });
  });
}

// Roteamento de links
// Observe o uso de intenso do 'return' para sair do app, caso o requisito seja cumprido
function routerLink() {
  // Obtém atributos do link
  var href = $(this).attr("href"); // Obtém valor de 'href' do link clicado
  var target = $(this).attr("target"); // Obtém valor de 'target' do link clicado


  // Se 'href' não existe OU (||) é vazio, não faz nada
  if (!href || href == "") return false;

  // Se o primeiro caractere é '#', é uma âncora
  // Então, devolve controle para o HTML
  if (href.substr(0, 1) == "#") return true;

  // Se 'target="_blank" OU href="http://..." OU href="https://...", é um link externo...
  // Então, devolve controle para o HTML
  if (
    target == "_blank" ||
    href.substr(0, 7) == "http://" ||
    href.substr(0, 8) == "https://"
  )
    return true;

  // Se é um link interno, uma rota, processa ela...
  loadPage(href);

  // Sai sem fazer mais nada
  return false;
}

// Processa título da página. Tag <title>...</title>
function setTitle(pageTitle = "") {
  var title; // Inicializa variável
  // Se não definiu um título, usa o nome do app
  if (pageTitle == "") title = siteName;
  // Senão, usa este formato
  else title = `${siteName} .:. ${pageTitle}`;
  $("title").text(title); // Escreve na tag <title>
}

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString, separator = ' às ') {
  var p1 = dateString.split(" "); // Separa data e hora
  var p2 = p1[0].split("-"); // Separa partes da data
  return `${p2[2]}/${p2[1]}/${p2[0]}${separator}${p1[1]}`; // Remonta partes da data e hora
}

// Gera a data atual em formato system date "YYYY-MM-DD HH:II:SS"
function getSystemDate() {
  var yourDate = new Date(); // Obtém a data atual do navegador
  var offset = yourDate.getTimezoneOffset(); // Obtém o fusohorário
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000); // Ajusta o fusohorário
  returnDate = yourDate.toISOString().split("T"); // Separa data da hora
  returnTime = returnDate[1].split("."); // Separa partes da data
  return `${returnDate[0]} ${returnTime[0]}`; // Formata data como system date
}

// Fecha modal
function closeModal() {
  modalName = $(this).parent().attr("id"); // Obtém o ID do pai do modal clicado
  $(`#${modalName}`).hide("fast"); // Oculta o pai do modal clicado
  if(modalName == 'modalLogin') loadPage('home'); // Vai para a home se fez login
  return false;
}

// Sanitiza campos de formulário
function sanitizeString(stringValue, stripTags = true) {
  if (stripTags) stringValue = stringValue.replace(/<[^>]*>?/gm, ""); // Remove todas as tags HTML
  return stringValue.replace(/\n/g, "<br />").trim(); // Quebras de linha viram <br>
}

// Faz login de usuário
function login() {
  firebase.auth().signOut(); // Força logout
  var provider = new firebase.auth.GoogleAuthProvider(); // Seleciona o provedor de autenticação
  // Autenticação usando 'popup', a mais básica que existe
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {

      // Prepara dados para o cookie
      user = {
        'name': result.user.displayName,
        'email': result.user.email,
        'photo': result.user.photoURL,
        'uid': result.user.uid
      }
      userData = JSON.stringify(user);

      // Armazena login no cookie
      setCookie('userData', userData);

      // Checa perfil
      checkProfile();

      // Se logou, exibe um modal cumprimentando o usuário
      var modalText = `<strong>Olá ${result.user.displayName}!</strong><br><br>Você já pode usar nosso conteúdo restrito...`;
      $("#modalLogin .modal-title").html("Bem-vinda(o)!");
      $("#modalLogin .modal-text").html(modalText);
      $("#modalLogin").show("fast");

      // Fecha o modal em 15 segundos (15000 ms)
      setTimeout(() => {
        $("#modalLogin").hide("fast");
      }, 15000);

    })
    .catch((error) => {
      console.error(`Ocorreram erros ao fazer login: ${error}`);
    });
}

// Logout de usuario
function logout() {
  // Logout padrão do Firebase
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Após logout, retorna para a 'home'
      loadPage("home");
    });
}

// Cria/edita cookie
function setCookie(cookieName, cookieValue, cookieExpires = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (cookieExpires * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Ler cookie
function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Testa se usuário tem perfil completo
function checkProfile() {

  userData = JSON.parse(getCookie('userData'));

  db.collection("users").doc(userData.uid).get().then((doc) => {
    if (doc.exists) {
      // Cadastro encontrado
      // console.log("Document data:", doc.data());
      return true;
    } else {
      // Cadastro não encontrado
      // console.log("No such document!");
      loadPage('newuser');
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}

