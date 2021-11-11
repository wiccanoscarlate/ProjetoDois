// Define o título da página
var pageTitle = `Perfil de Usuário`;

$(document).ready(runPage);

function runPage() {

    // Altera o título da página
    setTitle(pageTitle);

    // Valida usuário logado
    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {

            $('#userName').html(user.displayName);

            var uProfile = `
<div class="card card-table">
    <div class="card-img"><img src="${user.photoURL}" alt="${user.displayName}"></div>
    <div class="card-content">
        <h3>${user.displayName}</h3>
        <h4>${user.email}</h4>
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

        } else {
            loadPage('home');
        }
    });



}