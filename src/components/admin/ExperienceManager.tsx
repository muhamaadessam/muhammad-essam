'use client';

import { useState, useEffect, useRef } from 'react';
import { getExperiences, Experience } from '@/lib/services';
import { addExperience, updateExperience, deleteExperience } from '@/lib/adminServices';
import { uploadImageToCloudinary } from '@/lib/adminServices';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const data = await getExperiences();
    setExperiences(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    try {
      if (editingExperience.docId) {
        await updateExperience(editingExperience.docId, editingExperience);
      } else {
        await addExperience(editingExperience as Omit<Experience, 'id'>);
      }
      setEditingExperience(null);
      fetchExperiences();
    } catch (err: any) {
      console.error(err);
      alert(`Error saving experience: ${err.message || err}`);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(docId);
        fetchExperiences();
      } catch (err) {
        console.error(err);
        alert('Error deleting experience');
      }
    }
  };

  if (loading) return <div>Loading experiences...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experience</h2>
        <button
          onClick={() => setEditingExperience({ title: '', company: '', location: '', startDate: '', endDate: null, employmentType: '', description: [], skills: [], companyUrl: '' })}
          className="bg-primary text-dark-bg px-4 py-2 rounded font-bold"
        >
          Add Experience
        </button>
      </div>

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="glass p-4 rounded-xl border border-white/10 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div>
                <h3 className="font-bold text-lg">
                  {exp.title}
                </h3>
                <p className="text-sm text-gray-300">{exp.company} • {exp.employmentType}</p>
                <p className="text-xs text-gray-400">
                  {exp.startDate} - {exp.endDate || 'Present'} • {exp.location}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingExperience(exp)} className="text-primary hover:underline">Edit</button>
              <button onClick={() => handleDelete(exp.docId!)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingExperience && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="glass p-6 rounded-2xl w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold mb-4">{editingExperience.docId ? 'Edit Experience' : 'Add Experience'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Job Title</label>
                  <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingExperience.title || ''} onChange={e => setEditingExperience({...editingExperience, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Company</label>
                  <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingExperience.company || ''} onChange={e => setEditingExperience({...editingExperience, company: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Location</label>
                  <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingExperience.location || ''} onChange={e => setEditingExperience({...editingExperience, location: e.target.value})} placeholder="e.g. Cairo, Egypt" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Employment Type</label>
                  <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingExperience.employmentType || ''} onChange={e => setEditingExperience({...editingExperience, employmentType: e.target.value})} placeholder="e.g. Full-time, Internship" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date</label>
                  <input required type="month" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingExperience.startDate || ''} onChange={e => setEditingExperience({...editingExperience, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Date</label>
                  <input 
                    type="month" 
                    className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white disabled:opacity-50" 
                    value={editingExperience.endDate || ''} 
                    onChange={e => setEditingExperience({...editingExperience, endDate: e.target.value})} 
                    disabled={editingExperience.endDate === null}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="currentlyWorking"
                      checked={editingExperience.endDate === null}
                      onChange={e => setEditingExperience({...editingExperience, endDate: e.target.checked ? null : ''})}
                    />
                    <label htmlFor="currentlyWorking" className="text-sm">Currently Working Here</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Company Website / Link</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" 
                  value={editingExperience.companyUrl || ''} 
                  onChange={e => setEditingExperience({...editingExperience, companyUrl: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Description (Bullet Points, one per line)</label>
                <textarea 
                  required 
                  className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white h-32" 
                  value={editingExperience.description?.join('\n') || ''} 
                  onChange={e => setEditingExperience({...editingExperience, description: e.target.value.split('\n').filter(Boolean)})} 
                  placeholder="Developed feature X...&#10;Collaborated with team Y..." 
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Skills (comma separated)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" 
                  value={editingExperience.skills?.join(', ') || ''} 
                  onChange={e => setEditingExperience({...editingExperience, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                  placeholder="Flutter, Dart, Firebase..." 
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditingExperience(null)} className="px-4 py-2 rounded text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-primary text-dark-bg px-4 py-2 rounded font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
