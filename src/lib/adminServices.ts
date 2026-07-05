import { collection, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Skill, PortfolioData, FunFacts } from './services';

// Helper to remove undefined fields which Firebase doesn't support
const cleanObject = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

// --- Projects CRUD ---
export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const projectsCol = collection(db, 'projects');
  const cleanedProject = cleanObject(project);
  const docRef = await addDoc(projectsCol, cleanedProject);
  // Also update the 'id' field in the document to match the doc.id for consistency
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const docRef = doc(db, 'projects', id);
  const cleanedProject = cleanObject(project);
  await updateDoc(docRef, cleanedProject);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
}

// --- Skills CRUD ---
export async function addSkill(skill: Omit<Skill, 'id'>): Promise<string> {
  const skillsCol = collection(db, 'skills');
  const cleanedSkill = cleanObject(skill);
  const docRef = await addDoc(skillsCol, cleanedSkill);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  const docRef = doc(db, 'skills', id);
  const cleanedSkill = cleanObject(skill);
  await updateDoc(docRef, cleanedSkill);
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, 'skills', id);
  await deleteDoc(docRef);
}

// --- Portfolio Data CRUD ---
export async function updatePortfolioData(data: Partial<PortfolioData>): Promise<void> {
  const docRef = doc(db, 'portfolio', 'user_data');
  const cleanedData = cleanObject(data);
  await setDoc(docRef, cleanedData, { merge: true });
}

// --- Fun Facts CRUD ---
export async function updateFunFacts(facts: string[]): Promise<void> {
  const docRef = doc(db, 'fun_facts', 'main');
  await setDoc(docRef, { facts }, { merge: true });
}

// --- Cloudinary Upload ---
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = 'dxty2amiw';
  const uploadPreset = 'portfolio_uploads';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('upload_preset', uploadPreset);
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}
