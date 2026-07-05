import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoEPeeyaS49oznMj0EAeN-WRzXuPWS36I",
  appId: "1:12205873374:web:00f8bad7c16f55119d0a4f",
  projectId: "portfolio-e05b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const q = query(collection(db, "projects"), limit(1));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    console.log(doc.data());
  });
  process.exit(0);
}
test();
