const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDoEPeeyaS49oznMj0EAeN-WRzXuPWS36I',
  appId: '1:12205873374:web:00f8bad7c16f55119d0a4f',
  projectId: 'portfolio-e05b2',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const docSnap = await getDoc(doc(db, 'portfolio', 'user_data'));
  if (docSnap.exists()) {
    console.log(docSnap.data().image);
  } else {
    console.log("No data");
  }
}
run();
