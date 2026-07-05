import { collection, doc, getDoc, getDocs, updateDoc, increment } from 'firebase/firestore';
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
    // Try fetching by exact Firestore Document ID first
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }

    // If not found, it's highly likely the document has an internal 'id' field
    // that overwrote the doc.id in getProjects(). Let's find it from the list.
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

export async function incrementVisitorCount(): Promise<void> {
  try {
    const statsDoc = doc(db, 'stats', 'visitors');
    await updateDoc(statsDoc, {
      count: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
  }
}

export async function incrementCvDownloadCount(): Promise<void> {
  try {
    await fetch('/api/cv', { method: 'POST' });
  } catch (error) {
    console.error('Error incrementing CV download count:', error);
  }
}

export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return false;
  }
}
