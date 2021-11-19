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
    </div>
</div>`;

            $('#userProfile').html(uProfile);

            db.collection("users").doc(userData.uid).get().then((doc) => {
                if (doc.exists) {
                    // Cadastro encontrado
                    var user = doc.data();

                    var uAppProfile = `&nbsp;
                    <div class="card card-table">
                        <h3 class="card-title">Perfil de ${user.name}</h3>
                        <div class="card-content">
                            <h3>${user.name}</h3>
                            <h4>Contatos:</h4>
                            <ul>
                            <li><strong>Telefone: </strong>${user.phone}</li>
                            <li><strong>Whatsapp: </strong>${user.whatsapp}</li>
                            <li><strong>E-mail: </strong><a href="mailto://${user.email}" target="_blank">${user.email}</a></li>
                            </ul>
                            <h4>Localização:</h4>
                            <ul>
                            <li><strong>CEP: </strong>${user.zip}</li>
                            <li><strong>Cidade: </strong>${user.city}</li>
                            <li><strong>Estado: </strong>${user.state}</li>
                            </ul>
                            <h4>Mini currículo</h4>&nbsp;
                            <div style="font-size: small">${user.profile}</div>

                            <p>
                            <a class="btn primary block" href="myservices">
                                <i class="fas fa-address-card fa-fw"></i> Meus Serviços</a>
                        </p>
                        
                        <p>
                                <a class="btn primary block" href="editprofile">
                                    <i class="fas fa-address-card fa-fw"></i> Editar perfil</a>
                            </p>
                            <p>
                        <a class="btn primary block" href="newservice">
                        <i class="fas fa-hands-helping"></i></i><span> Peça ajuda</span></a>

                        </P>
                        </div>
                    </div>`;


                    $('#userAppProfile').html(uAppProfile);

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