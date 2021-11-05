// Conexão com Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBp9dLRidnCIDTdKXVxcZpl79w3r9ONPqw",
  authDomain: "projeto01-fc5fb.firebaseapp.com",
  projectId: "projeto01-fc5fb",
  storageBucket: "projeto01-fc5fb.appspot.com",
  messagingSenderId: "460620268422",
  appId: "1:460620268422:web:a92248255aaecd967ea207"
};

// Initializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();