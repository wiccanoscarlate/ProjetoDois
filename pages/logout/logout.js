// Define o título da página
var pageTitle = "Sobre...";

$(document).ready(runPage);

function runPage() {
  // Altera o título da página
  setTitle(pageTitle);

  $(document).on("click", "#logout", logout);

  firebase.auth().onAuthStateChanged((userData) => {
    if (!userData) {
      loadPage("home");
    }
  });
}
