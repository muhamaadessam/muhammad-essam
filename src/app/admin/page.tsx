'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin/dashboard');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="glass p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Admin Access</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-dark-bg font-bold py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
