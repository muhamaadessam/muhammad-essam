'use client';

import { useState, useEffect } from 'react';
import { getProjects, Project } from '@/lib/services';
import { addProject, updateProject, deleteProject, uploadImageToCloudinary } from '@/lib/adminServices';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const url = await uploadImageToCloudinary(e.target.files[0]);
        setEditingProject((prev) => ({ ...prev, projectImage: url }));
      } catch (err) {
        alert('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
      } else {
        await addProject(editingProject as Omit<Project, 'id'>);
      }
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        console.error(err);
        alert('Error deleting project');
      }
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => setEditingProject({ projectName: '', projectDescription: '', projectImage: '', projectLanguages: [], links: [], category: '', status: '', isFeatured: false })}
          className="bg-primary text-dark-bg px-4 py-2 rounded font-bold"
        >
          Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass p-4 rounded-xl border border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{project.projectName}</h3>
              <p className="text-sm text-gray-400">{project.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProject(project)} className="text-primary hover:underline">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingProject.id ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Project Name</label>
                <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingProject.projectName || ''} onChange={e => setEditingProject({...editingProject, projectName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingProject.category || ''} onChange={e => setEditingProject({...editingProject, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea required className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white h-24" value={editingProject.projectDescription || ''} onChange={e => setEditingProject({...editingProject, projectDescription: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Main Image</label>
                <div className="flex gap-4 items-center">
                  {editingProject.projectImage && <img src={editingProject.projectImage} alt="Preview" className="h-16 w-16 object-cover rounded" />}
                  <input type="file" onChange={handleImageUpload} className="text-sm" accept="image/*" />
                  {uploading && <span className="text-sm text-primary">Uploading...</span>}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 rounded text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={uploading} className="bg-primary text-dark-bg px-4 py-2 rounded font-bold disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
