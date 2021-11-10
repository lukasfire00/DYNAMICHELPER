// Define o título da página
var pageTitle = `Perfil de Usuário`;

$(document).ready(runPage);

function runPage() {

    // Altera o título da página
    setTitle(pageTitle);

    // Valida usuário logado
    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {

            

            $('#userName').html(userData.displayName);

            var uProfile = `
<div class="card card-table">
<h3 class="card-title">Perfil do Google</h3>

    <div class="card-img"><img src="${userData.photoURL}" alt="${userData.displayName}"></div>
    <div class="card-content">
        <h3>${userData.displayName}</h3>
        <h4>${userData.email}</h4>
        <p>
            <a class="btn primary block" href="https://myaccount.google.com/profile" target="_blank">
                <i class="fas fa-address-card fa-fw"></i> Ver / Editar perfil
            </a>
        </p>
        <p>
            <a class="btn warning block" href="logout">
                <i class="fas fa-sign-out-alt fa-fw"></i> Logout / Sair
            </a>
        </p>
    </div>
</div>`;

            $('#userProfile').html(uProfile);

            db.collection("users").doc(userData.uid).get().then((doc) => {
                if (doc.exists) {
                  // Cadastro encontrado
                  console.log("Document data:", doc.data());
                
                  $('#userAppProfile').html(`
                  
                  <a href="editprofile">Editar perfil</a>
                  
                  `)
                  
                } else {
                  // Cadastro não encontrado
                  // console.log("No such document!");
                  loadPage('newuser');
                }
              }).catch((error) => {
                console.log("Error getting document:", error);
              });

        } else {
            loadPage('home');
        }
    });



}