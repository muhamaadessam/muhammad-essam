'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import MessageManager from '@/components/admin/MessageManager';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'experience' | 'messages'>('projects');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Verifying Access...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Skills
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'experience' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Manage Experience
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'messages' ? 'bg-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
          >
            Messages
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'experience' && <ExperienceManager />}
        {activeTab === 'messages' && <MessageManager />}
      </div>
    </div>
  );
}
