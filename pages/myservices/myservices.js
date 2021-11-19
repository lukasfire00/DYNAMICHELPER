// Inicializa variáveis
var pageTitle = 'Meus Serviços';

$(document).ready(runPage);

// Aplicativo principal
function runPage() {

    // Detecta cliques nos services
    $(document).on('click', '.article', openArticle);

    // Altera o título da página
    setTitle(pageTitle);

    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {

console.log(userData.uid);

            // Obtendo todos os artigos do banco de dados
            db.collection("services")
                .where('status', '==', 'ativo')
                .where('uid', '==', userData.uid)
                .orderBy('date', 'desc')
                .onSnapshot((querySnapshot) => {

                    // Inicializa lista de artigos
                    var artList = '<h2>Meus Serviços</h2>';

                    // Obtém um artigo por loop
                    querySnapshot.forEach((doc) => {

                        // Armazena dados do artigo em 'art'
                        art = doc.data();

                        var rndImg = Math.floor(Math.random() * 10);
                        rndImg = "20" + rndImg;

                        // Monta lista de artigos
                        artList += `
<div class="article">
    <div class="article-img" style="background-image: url('https://picsum.photos/${rndImg}')"></div>
    <div class="article-content">
        <h3>${art.title}</h3>
        ${art.intro}
        <p>
            <a class="btn primary" href='editservice?${doc.id}'><i class="fas fa-edit"></i> Editar</a>
            <a class="btn warning" href='delservice?${doc.id}'><i class="fas fa-trash-alt"></i> Apagar</a>
        </p>
    </div>
    
</div>`;
                    });

                    // Atualiza a view com a lista de artigos
                    $('#artList').html(artList);
                });
        }
    });
}

// Abre o artigo completo ao clicar
function openArticle() {
    loadPage($(this).attr('data-route'));
}