$(document).ready(runPage);

// Formulário de comentário
var commentForm = `
<form id="cForm" name="comment-form">
    <textarea id="commentText" placeholder="Comente aqui..."></textarea>
    <p>
        <button type="submit" class="btn primary" id="commentSend" title="Enviar comentário">Enviar</button>
        <small class="grey">Suporta somente texto.</small>
    </p>
</form>
`;

// Dados do usuário comentarista
var commentUser = {};

// Id do artigo sendo comentado
var commentArticle;

// Mensagem para quem não está logado
var commentMsg = `<blockquote>Logue-se para comentar!</blockquote>`;

function runPage() {

    // Obtém o ID do artigo da URL
    const id = location.search.replace('?', '');

    // Obtém o artigo do banco de dados
    db.collection('services')                       // Consulta coleção 'services'
        .doc(id)                                    // ID do artigo a ser obtido
        .onSnapshot((doc) => {                      // Pull do artigo
            if (doc.exists) {                       // Se artigo existe
                var art = doc.data();               // Importa dados em 'art'
                art.brDate = getBrDate(art.date);   // Converte a data do artigo em pt-br
                setTitle(art.title);                // Altera o título da página



                // Torna o id do artigo global
                commentArticle = doc.id;

                // Montando a 'view' do artigo.
                var artView = `
<h2>${art.title}</h2>                
<small class="block text-right margin-bottom"><em>Em ${art.brDate}.</em></small>
<div class="art-body">${art.description}</div>
                `;

                firebase.auth().onAuthStateChanged((userData) => {
                    if (userData) {


                        db.collection('users')                       // Consulta coleção 'services'
                            .doc(art.uid)                                    // ID do artigo a ser obtido
                            .onSnapshot((doc) => {
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
                                <li><strong>Cidade: </strong>${user.city}</li>
                                <li><strong>Estado: </strong>${user.state}</li>
                                </ul>
                                  
                                <p>
                                <a class="btn primary block" href="https://api.whatsapp.com/send?phone=${user.whatsapp}&text=${art.title}" target="_blank">
                                <i class="fab fa-whatsapp"></i> Contato via Whatsapp</a>
                            </p>
    
                               
                            </div>
                        </div>`;


                                $('#userAppProfile').html(uAppProfile);
                            });


                    } else {
                        $('#userAppProfile').html("<p><br>Logue-se para ver detalhes do serviço </br></p>");


                    }
                }
                );


                $('#artView').html(artView);        // Atualiza a 'view' o artigo



            } else {                                // Se não tem artigo
                loadPage('home');                   // Volta para página de artigos
            }
        });
}

