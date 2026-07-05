'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  
  useEffect(() => {
    // Track visitor on mount
    fetch('/api/track', { method: 'POST' }).catch(err => console.error(err));
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
