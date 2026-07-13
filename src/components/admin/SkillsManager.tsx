'use client';

import { useState, useEffect } from 'react';
import { getSkills, Skill } from '@/lib/services';
import { addSkill, updateSkill, deleteSkill } from '@/lib/adminServices';

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  async function fetchSkills() {
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  }

  useEffect(() => {
    getSkills().then((data) => {
      setSkills(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      if (editingSkill.docId) {
        await updateSkill(editingSkill.docId, editingSkill);
      } else {
        await addSkill(editingSkill as Omit<Skill, 'id'>);
      }
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert(`Error saving skill: ${err instanceof Error ? err.message : err}`);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm('Are you sure you want to delete this skill group?')) {
      try {
        await deleteSkill(docId);
        fetchSkills();
      } catch (err) {
        console.error(err);
        alert('Error deleting skill');
      }
    }
  };

  if (loading) return <div>Loading skills...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <button
          onClick={() => setEditingSkill({ title: '', skills: [] })}
          className="bg-primary text-dark-bg px-4 py-2 rounded font-bold"
        >
          Add Skill Category
        </button>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="glass p-4 rounded-xl border border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{skill.title}</h3>
              <p className="text-sm text-gray-400">{skill.skills?.join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingSkill(skill)} className="text-primary hover:underline">Edit</button>
              <button onClick={() => handleDelete(skill.docId!)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{editingSkill.docId ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Category Title</label>
                <input required type="text" className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white" value={editingSkill.title || ''} onChange={e => setEditingSkill({...editingSkill, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm mb-1">Skills (comma separated)</label>
                <textarea required className="w-full bg-dark-bg border border-white/10 rounded px-3 py-2 text-white h-24" value={editingSkill.skills?.join(', ') || ''} onChange={e => setEditingSkill({...editingSkill, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="Flutter, Dart, Firebase..." />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setEditingSkill(null)} className="px-4 py-2 rounded text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-primary text-dark-bg px-4 py-2 rounded font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
