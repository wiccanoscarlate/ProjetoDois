// Conexão com Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfWBlHOfE7N3J6K_swDzi2Zz6nSWfjd_4",
    authDomain: "projetoum-fe477.firebaseapp.com",
    projectId: "projetoum-fe477",
    storageBucket: "projetoum-fe477.appspot.com",
    messagingSenderId: "746077889552",
    appId: "1:746077889552:web:f6c520f9f6e1983b849695"
};

// Initializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();