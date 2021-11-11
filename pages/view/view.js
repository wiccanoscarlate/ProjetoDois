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
    db.collection('articles')                       // Consulta coleção 'articles'
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
<div class="art-body">${art.text}</div>
                `;

                $('#artView').html(artView);        // Atualiza a 'view' o artigo

                /***** Comentários *****/
                // Monitora autenticação de usuário (observer)
                firebase.auth().onAuthStateChanged((userData) => {

                    // Usuário logado
                    if (userData) {

                        // Exporta dados do usuário
                        commentUser = userData;

                        // Exibe formulário
                        $('#commentForm').html(commentForm);

                        // Monitora envio do formulário
                        // (ERRO) $(document).on('submit', '#cForm', sendComment);
                        // (1ª solução) $('#commentSend').click(sendComment);
                        $('#cForm').submit(sendComment);

                    } else {

                        // Mensagem pedindo para logar
                        $('#commentForm').html(commentMsg);
                    }
                });

                // Exibe comentários deste artigo
                showComments(doc.id);

            } else {                                // Se não tem artigo
                loadPage('home');                   // Volta para página de artigos
            }
        });
}

// Processa envio do formulário
function sendComment() {

    // Obtém comentário digitado e sanitiza
    var commentText = sanitizeString($('#commentText').val());

    // Se o comentário é muito curto, não envia
    if (commentText.length < 5) return false;

    // Monta documento para o banco de dados
    var commentData = {
        article: commentArticle,                // Id do artigo que esta sendo comentado
        displayName: commentUser.displayName,   // Nome do comentarista
        email: commentUser.email,               // E-mail do comentarista
        photoURL: commentUser.photoURL,         // Foto do comentarista
        uid: commentUser.uid,                   // Id do comentarista
        date: getSystemDate(),                  // Data do comentário em 'system date'
        comment: commentText,                   // Comentário enviado
        status: 'ativo'                         // Se usar pré-moderação escreva 'inativo'
    };

    // Salva no database
    db.collection('comments').add(commentData)
        .then(() => {

            // Se deu certo, exibe 'modal'
            $('#modalComment').show('fast');

            //  Limpa campo de comentário
            $('#commentText').val('');

            // Fecha o modal em 15 segundos (15000 ms)
            setTimeout(() => {
                $("#modalComment").hide('fast');
            }, 15000);
        })
        .catch((error) => {

            // Se deu errado, exibe mensagem de erro no console
            console.error(`Ocorreu erro ao salvar no DB: ${error}`);
        });

    // Conclui sem fazer mais nada
    return false;
}

// Exibe comentários deste artigo
function showComments(articleId) {

    db.collection('comments')
        .where('article', '==', articleId)
        .where('status', '==', 'ativo')
        .orderBy('date', 'desc')
        .onSnapshot((querySnapshot) => {

            // Inicializa lista de artigos
            var commentList = '';

            // Obtém um artigo por loop
            querySnapshot.forEach((doc) => {

                // Armazena dados do artigo em 'cData'
                cData = doc.data();

                // Primeiro nome do usuário
                cData.firstName = cData.displayName.split(' ')[0];

                // Formata a date
                cData.brDate = getBrDate(cData.date);

                // Monta lista de artigos
                commentList += `
<div class="comment-item">
    <div class="comment-autor-date">
        <!-- img class="comment-image" src="${cData.photoURL}" alt="${cData.displayName}" -->
        <span>Por ${cData.firstName} em ${cData.brDate}.</span>
    </div>
    <div class="comment-text">${cData.comment}</div>
</div>
                `;
            });

            // Atualiza a view com a lista de artigos
            $('#commentList').html(commentList);
            commentList = '';
        });

}