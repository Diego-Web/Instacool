import * as firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyAYFXOCdVyPTQ_0V_phBIWv_A2uycSLjU0",
    appId: "1:852766673332:web:4a65937616a6ac23",
    authDomain: "instacool-40dag.firebaseapp.com",
    databaseURL: "https://instacool-40dag.firebaseio.com",
    messagingSenderId: "852766673332",
    projectId: "instacool-40dag",
    storageBucket: "instacool-40dag.appspot.com",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // const firestore = firebase.firestore()
  // const settings = {timestampsInSnapshots: true}
  // firestore.settings(settings)
  export const auth = firebase.auth()
  export const db = firebase.firestore()
  export const storage = firebase.storage()
