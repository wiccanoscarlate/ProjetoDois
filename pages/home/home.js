// Inicializa variáveis
var pageTitle = '';

$(document).ready(runPage);

// Aplicativo principal
function runPage() {

    // Detecta cliques nos articles
    $(document).on('click', '.article', openArticle);

    // Altera o título da página
    setTitle(pageTitle);

    // Obtendo todos os artigos do banco de dados
    db.collection("articles")
        .where('status', '==', 'ativo')
        .orderBy('date', 'desc')
        .onSnapshot((querySnapshot) => {

            // Inicializa lista de artigos
            var artList = '<h2>Artigos Recentes</h2>';

            // Obtém um artigo por loop
            querySnapshot.forEach((doc) => {

                // Armazena dados do artigo em 'art'
                art = doc.data();

                // Monta lista de artigos
                artList += `
<div class="article" data-route="view?${doc.id}">
    <div class="article-img" style="background-image: url('${art.img}')"></div>
    <div class="article-content">
        <h3>${art.title}</h3>
        ${art.intro}
    </div>
</div>`;
            });

            // Atualiza a view com a lista de artigos
            $('#artList').html(artList);
        });
}

// Abre o artigo completo ao clicar
function openArticle() {
    loadPage($(this).attr('data-route'));
}