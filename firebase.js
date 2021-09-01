import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCjW4v94SGizO2qJcZ9z5OCuodAFYRZSS4",
    authDomain: "facebook-2-8ba2f.firebaseapp.com",
    projectId: "facebook-2-8ba2f",
    storageBucket: "facebook-2-8ba2f.appspot.com",
    messagingSenderId: "764423349848",
    appId: "1:764423349848:web:c8ade5fa0603b571b24c2d"
  };

  const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

  const db = app.firestore();
  const storage=firebase.storage();

  export{db,storage};