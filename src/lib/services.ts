import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface LinkModel {
  title?: string;
  link: string;
}

export interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  projectImage: string;
  projectLanguages: string[];
  links: LinkModel[];
  category: string;
  status: string;
  isFeatured: boolean;
  screenshots?: string[];
}

export interface Skill {
  id: string;
  title: string;
  skills: string[];
}

export interface FunFacts {
  facts: string[];
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    return projectSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }

    const allProjects = await getProjects();
    const project = allProjects.find(p => String(p.id) === String(id));
    return project || null;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const skillsCol = collection(db, 'skills');
    const skillSnapshot = await getDocs(skillsCol);
    return skillSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Skill[];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getFunFacts(): Promise<FunFacts | null> {
  try {
    const docSnap = await getDoc(doc(db, 'fun_facts', 'main'));
    if (docSnap.exists()) {
      return { facts: docSnap.data().facts };
    }
    return null;
  } catch (error) {
    console.error('Error fetching fun facts:', error);
    return null;
  }
}

export interface PortfolioData {
  objective?: string;
  company?: string;
  phone?: string;
  email?: string;
  name?: string;
  linkedin?: string;
  github?: string;
  jop_title?: string;
  image?: string;
}

export async function getPortfolioData(): Promise<PortfolioData | null> {
  try {
    const docSnap = await getDoc(doc(db, 'portfolio', 'user_data'));
    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

// Client-side Telegram integration
async function getTelegramConfig() {
  const configDoc = await getDoc(doc(db, 'config', 'telegram'));
  if (configDoc.exists()) {
    return configDoc.data();
  }
  return null;
}

export async function trackVisitor(): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    let visitorId = localStorage.getItem('visitor_id');
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = Date.now().toString();
      localStorage.setItem('visitor_id', visitorId);
      isNewVisitor = true;
    }

    const docRef = doc(db, 'stats', 'visitors');
    const snapshot = await getDoc(docRef);
    
    let totalVisits = 1;
    let totalVisitors = 1;

    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      const currentCount = users[visitorId] || 0;
      
      isNewVisitor = currentCount === 0;
      totalVisitors = isNewVisitor ? Object.keys(users).length + 1 : Object.keys(users).length;
      totalVisits = (data.total_visites || 0) + 1;

      await setDoc(docRef, {
        total_visitors: isNewVisitor ? increment(1) : Object.keys(users).length,
        total_visites: increment(1),
        users: {
          ...users,
          [visitorId]: currentCount + 1,
        }
      }, { merge: true });
    } else {
      await setDoc(docRef, {
        total_visitors: 1,
        total_visites: 1,
        users: {
          [visitorId]: 1,
        }
      });
    }

    // Send Telegram Notification
    const config = await getTelegramConfig();
    if (config?.bot_token && config?.chat_id) {
      let message;
      if (isNewVisitor) {
        message = `🎉 *New Unique Visitor!*\n\n*Visitor ID:* \`${visitorId}\`\nA new user has visited your portfolio!\nTotal Unique Visitors: \`${totalVisitors}\``;
      } else {
        message = `👀 *Portfolio Visit!*\n\n*Visitor ID:* \`${visitorId}\`\nA return visitor just opened your portfolio.\nTotal Visits: \`${totalVisits}\``;
      }

      const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chat_id,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

export async function incrementCvDownloadCount(): Promise<void> {
  try {
    const statsDoc = doc(db, 'stats', 'cv_downloads');
    await updateDoc(statsDoc, {
      count: increment(1)
    }).catch(() => {});

    let visitorId = 'Unknown';
    if (typeof window !== 'undefined') {
      visitorId = localStorage.getItem('visitor_id') || 'Unknown';
    }

    const config = await getTelegramConfig();
    if (config?.bot_token && config?.chat_id) {
      const message = `📄 *CV Downloaded!*\n\n*Visitor ID:* \`${visitorId}\`\nSomeone just downloaded your CV!`;
      const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chat_id,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    }
  } catch (error) {
    console.error('Error incrementing CV download count:', error);
  }
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const config = await getTelegramConfig();
    if (!config?.bot_token || !config?.chat_id) return false;

    const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chat_id,
        text: message,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return false;
  }
}
