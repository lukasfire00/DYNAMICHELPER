// Inicializa variáveis
var pageTitle = '';
var art = {};
var artList = '<h2>Serviços Recentes</h2>';

$(document).ready(runPage);

// Aplicativo principal
function runPage() {

    const state = sanitizeString(location.search.replace('?', ''));

    $('#search-state').val(state);

    // Detecta cliques nos services
    $(document).on('click', '.article', openArticle);

    // Altera o título da página
    setTitle(pageTitle);

    db.collection('users')
        .where('state', '==', state)
        .onSnapshot((querySnapshot) => {

            if (querySnapshot.size == 0) {

                artList += 'Nenhum serviço encontrado neste estado.';
                $('#artList').html(artList);
            }
            querySnapshot.forEach((doc) => {
                user = doc.data();
                db.collection('services')
                    .where('uid', '==', doc.id)
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((docService) => {
                            art = docService.data();
                            art.id = docService.id;
                            var rndImg = Math.floor(Math.random() * 10);
                            rndImg = "20" + rndImg;

                            // Monta lista de artigos
                            artList += `
            <div class="article" data-route="view?${art.id}">
                <div class="article-img" style="background-image: url('https://picsum.photos/${rndImg}')"></div>
                <div class="article-content">
                    <h3>${art.title}</h3>
                    ${art.intro}
                </div>
            </div>`;

                        });
                        // Atualiza a view com a lista de artigos
                        $('#artList').html(artList);
                    });
            });
        });

}

// Abre o artigo completo ao clicar
function openArticle() {
    loadPage($(this).attr('data-route'));
}
