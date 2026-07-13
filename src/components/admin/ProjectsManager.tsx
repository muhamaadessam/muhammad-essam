'use client';

import { useState, useEffect } from 'react';
import { getProjects, Project } from '@/lib/services';
import { addProject, updateProject, deleteProject, uploadImageToCloudinary } from '@/lib/adminServices';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteField } from 'firebase/firestore';
import { Trash2, Edit2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);

  async function fetchProjects() {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    // Auto-update the remaining 3 projects
    const updateRemaining = async () => {
      try {
        console.log("Auto-updating remaining 3 projects...");

        // Sportsmanship
        await updateDoc(doc(db, 'projects', 'b4Y7VBXh3LRxMiofMv3K'), {
          techStack: ['Flutter', 'Dart', 'Cubit / Bloc', 'Firebase', 'RESTful APIs'],
          keyFeaturesAndBenefits: [
            'Sports Prediction System: Predict outcomes of major Saudi football league matches like Al-Ittihad and Al-Hilal.',
            'Points & Leaderboard: Earn points for accurate predictions and compete with fellow fans.',
            'Interactive UI: Clean and engaging interface tailored for football enthusiasts.',
            'Real-Time Updates: Get live updates on match outcomes and leaderboard standings.'
          ]
        });

        // Mudawi
        await updateDoc(doc(db, 'projects', 'm9stNpPpcvLJImPLLCPZ'), {
          techStack: ['Flutter', 'Dart', 'Cubit / Bloc', 'Local Storage', 'Firebase'],
          keyFeaturesAndBenefits: [
            'Medical Reminders: Easily schedule doctor appointments and medication times.',
            'Health Logging: Log blood pressure readings and other vital signs for future reference.',
            'Privacy-Focused: Complete privacy with secure data storage.',
            'Clean Interface: Simple and user-friendly design acting as your personal health assistant.'
          ]
        });

        // CEO Buffet
        await updateDoc(doc(db, 'projects', 'Guz12ZoE3RCISCnSzkJ3'), {
          techStack: ['Flutter', 'Dart', 'Cubit / Bloc', 'Firebase', 'RESTful APIs'],
          keyFeaturesAndBenefits: [
            'Premium Catering Management: Streamline catering services and buffet arrangements for events.',
            'Order Tracking: Manage and track food orders efficiently from preparation to delivery.',
            'Elegant Interface: A premium UI suitable for high-end event management and client interactions.',
            'Real-Time Synchronization: Keep all staff and management aligned with live order updates.'
          ]
        });

        console.log("Auto-update finished successfully!");
        alert("Remaining 3 projects updated successfully!");
        fetchProjects();
      } catch (e) {
        console.error("Auto-update failed:", e);
      }
    };
    
    updateRemaining();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const url = await uploadImageToCloudinary(e.target.files[0]);
        setEditingProject((prev) => ({ ...prev, projectImage: url }));
      } catch {
        alert('Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingScreenshots(true);
      try {
        const files = Array.from(e.target.files);
        const urls = await Promise.all(files.map(f => uploadImageToCloudinary(f)));
        setEditingProject((prev) => ({ 
          ...prev, 
          screenshots: [...(prev?.screenshots || []), ...urls] 
        }));
      } catch {
        alert('Failed to upload screenshots');
      } finally {
        setUploadingScreenshots(false);
      }
    }
  };

  const removeScreenshot = (indexToRemove: number) => {
    setEditingProject((prev) => ({
      ...prev,
      screenshots: prev?.screenshots?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.docId) {
        await updateProject(editingProject.docId, editingProject);
      } else {
        await addProject(editingProject as Omit<Project, 'id'>);
      }
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(`Error saving project: ${err instanceof Error ? err.message : err}`);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(docId);
        fetchProjects();
      } catch (err) {
        console.error(err);
        alert('Error deleting project');
      }
    }
  };

  const handleMigrate = async () => {
    if (!confirm('Run migration?')) return;
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'projects'));
      for (const d of snapshot.docs) {
        const data = d.data();
        if (data.projectLanguages) {
          await updateDoc(doc(db, 'projects', d.id), {
            keyFeaturesAndBenefits: data.projectLanguages,
            techStack: [],
            projectLanguages: deleteField()
          });
        }
      }
      alert('Migration complete!');
      fetchProjects();
    } catch (e) {
      console.error(e);
      alert('Migration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-dark-bg p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Projects</h2>
          <p className="text-gray-400 mt-1 text-sm">Manage your portfolio projects and case studies.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleMigrate} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm">
            Run Migration
          </button>
          <button
            onClick={() => setEditingProject({ projectName: '', projectDescription: '', projectImage: '', techStack: [], keyFeaturesAndBenefits: [], links: [], category: '', status: '', isFeatured: false, screenshots: [] })}
            className="bg-primary hover:bg-primary-dark text-dark-bg px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(102,252,241,0.3)] hover:shadow-[0_0_25px_rgba(102,252,241,0.5)] flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col group hover:border-primary/30 transition-all duration-300">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-black/40">
              {project.projectImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.projectImage} alt={project.projectName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingProject(project)} className="p-2 bg-black/60 hover:bg-primary text-white rounded-lg backdrop-blur-md transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(project.docId!)} className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary uppercase tracking-wider">{project.category}</span>
                {project.isFeatured && <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 uppercase tracking-wider">Featured</span>}
              </div>
              <h3 className="font-bold text-xl text-white mb-1">{project.projectName}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{project.projectDescription}</p>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="glass p-8 rounded-3xl w-full max-w-4xl my-8 border border-white/10 shadow-2xl relative">
            <button onClick={() => setEditingProject(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-8 text-white">{editingProject.docId ? '✏️ Edit Project' : '✨ Add New Project'}</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name</label>
                    <input required type="text" className="w-full bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-3 text-white transition-all outline-none" placeholder="e.g. My Cash App" value={editingProject.projectName || ''} onChange={e => setEditingProject({...editingProject, projectName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                    <input required type="text" className="w-full bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-3 text-white transition-all outline-none" placeholder="e.g. Mobile App" value={editingProject.category || ''} onChange={e => setEditingProject({...editingProject, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Tech Stack</label>
                    <div className="space-y-2">
                      {(editingProject.techStack || []).map((tech, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-2 text-white transition-all outline-none" 
                            placeholder="e.g. Flutter" 
                            value={tech} 
                            onChange={e => {
                              const newTechStack = [...(editingProject.techStack || [])];
                              newTechStack[idx] = e.target.value;
                              setEditingProject({ ...editingProject, techStack: newTechStack });
                            }} 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newTechStack = [...(editingProject.techStack || [])];
                              newTechStack.splice(idx, 1);
                              setEditingProject({ ...editingProject, techStack: newTechStack });
                            }}
                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingProject({ ...editingProject, techStack: [...(editingProject.techStack || []), ''] });
                        }}
                        className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tech
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Key Features & Benefits</label>
                    <div className="space-y-2">
                      {(editingProject.keyFeaturesAndBenefits || []).map((feature, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-2 text-white transition-all outline-none" 
                            placeholder="e.g. Fast performance" 
                            value={feature} 
                            onChange={e => {
                              const newFeatures = [...(editingProject.keyFeaturesAndBenefits || [])];
                              newFeatures[idx] = e.target.value;
                              setEditingProject({ ...editingProject, keyFeaturesAndBenefits: newFeatures });
                            }} 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newFeatures = [...(editingProject.keyFeaturesAndBenefits || [])];
                              newFeatures.splice(idx, 1);
                              setEditingProject({ ...editingProject, keyFeaturesAndBenefits: newFeatures });
                            }}
                            className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingProject({ ...editingProject, keyFeaturesAndBenefits: [...(editingProject.keyFeaturesAndBenefits || []), ''] });
                        }}
                        className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" id="isFeatured" className="w-5 h-5 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/50" checked={editingProject.isFeatured || false} onChange={e => setEditingProject({...editingProject, isFeatured: e.target.checked})} />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300 cursor-pointer">Featured Project</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                    <textarea required className="w-full bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-3 text-white transition-all outline-none h-32 resize-none" placeholder="Describe the project..." value={editingProject.projectDescription || ''} onChange={e => setEditingProject({...editingProject, projectDescription: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Main Image</label>
                    <div className="flex gap-4 items-center bg-black/20 p-3 rounded-xl border border-white/5">
                      {editingProject.projectImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={editingProject.projectImage} alt="Preview" className="h-16 w-24 object-cover rounded-lg shadow-md" />
                      ) : (
                        <div className="h-16 w-24 bg-black/40 rounded-lg flex items-center justify-center text-gray-500 border border-dashed border-white/20"><ImageIcon className="w-6 h-6"/></div>
                      )}
                      <div className="flex-1">
                        <input type="file" onChange={handleImageUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer" accept="image/*" />
                        {uploadingImage && <div className="text-xs text-primary mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Section */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-gray-300 mb-3">Project Screenshots</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {editingProject.screenshots?.map((shot, idx) => (
                    <div key={idx} className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-black/40 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button type="button" onClick={() => removeScreenshot(idx)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="aspect-[9/16] rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 bg-black/20 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors cursor-pointer relative overflow-hidden">
                    <input type="file" multiple onChange={handleScreenshotsUpload} className="hidden" accept="image/*" />
                    {uploadingScreenshots ? (
                      <div className="flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin"/> <span className="text-xs font-medium">Uploading...</span></div>
                    ) : (
                      <div className="flex flex-col items-center gap-2"><Plus className="w-6 h-6"/> <span className="text-xs font-medium">Add Images</span></div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setEditingProject(null)} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={uploadingImage || uploadingScreenshots} className="bg-primary hover:bg-primary-dark text-dark-bg px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(102,252,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                  {editingProject.docId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
