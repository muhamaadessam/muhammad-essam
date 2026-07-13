import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoEPeeyaS49oznMj0EAeN-WRzXuPWS36I",
  appId: "1:12205873374:web:00f8bad7c16f55119d0a4f",
  projectId: "portfolio-e05b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const q = query(collection(db, "projects"));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    const data = doc.data();
    if (['Sportsmanship', 'Mudawi', 'CEO Buffet'].includes(data.projectName)) {
      console.log("---");
      console.log("Name:", data.projectName);
      console.log("TechStack:", data.techStack);
    }
  });
  process.exit(0);
}
test();
