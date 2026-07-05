import { collection, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Project, Skill, PortfolioData, FunFacts } from './services';

// --- Projects CRUD ---
export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const projectsCol = collection(db, 'projects');
  const docRef = await addDoc(projectsCol, project);
  // Also update the 'id' field in the document to match the doc.id for consistency
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, project);
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
}

// --- Skills CRUD ---
export async function addSkill(skill: Omit<Skill, 'id'>): Promise<string> {
  const skillsCol = collection(db, 'skills');
  const docRef = await addDoc(skillsCol, skill);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  const docRef = doc(db, 'skills', id);
  await updateDoc(docRef, skill);
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, 'skills', id);
  await deleteDoc(docRef);
}

// --- Portfolio Data CRUD ---
export async function updatePortfolioData(data: Partial<PortfolioData>): Promise<void> {
  const docRef = doc(db, 'portfolio', 'user_data');
  await setDoc(docRef, data, { merge: true });
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
