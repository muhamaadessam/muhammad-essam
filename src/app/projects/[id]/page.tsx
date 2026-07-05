'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProjectById, Project } from '@/lib/services';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code2, LayoutDashboard, Sparkles, Database } from 'lucide-react';
import Header from '@/components/Header';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getProjectById(params.id as string).then((data) => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden flex flex-col justify-center items-center">
        {/* Abstract animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-light/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Developer Bracket Animation */}
          <motion.div 
            className="flex items-center gap-2 mb-8 text-primary font-mono text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span 
              animate={{ x: [-10, 0, -10] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              &lt;
            </motion.span>
            <motion.div 
              className="flex gap-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2, repeat: Infinity, repeatType: "reverse", duration: 1.5 }
                }
              }}
            >
              <motion.span variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1 } }} className="w-3 h-12 bg-primary rounded-sm shadow-[0_0_15px_rgba(102,252,241,0.5)]"></motion.span>
              <motion.span variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1 } }} className="w-3 h-12 bg-accent-light rounded-sm shadow-[0_0_15px_rgba(102,252,241,0.3)]"></motion.span>
              <motion.span variants={{ hidden: { opacity: 0.2 }, visible: { opacity: 1 } }} className="w-3 h-12 bg-white rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.5)]"></motion.span>
            </motion.div>
            <motion.span 
              animate={{ x: [10, 0, 10] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              /&gt;
            </motion.span>
          </motion.div>

          {/* Typing Effect Text */}
          <motion.div 
            className="font-mono text-gray-400 text-sm md:text-base tracking-widest uppercase flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Code2 className="w-4 h-4 text-primary" />
            <span>Compiling Project Data...</span>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/5 rounded-full mt-6 overflow-hidden relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent-light"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            ></motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden flex flex-col justify-center items-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Background glowing text */}
            <h1 className="text-6xl md:text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-accent-light drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              DATA NOT FOUND
            </h1>
            
            <div className="absolute -top-12 -left-12 text-red-500/20 rotate-[-15deg] blur-[2px]">
              <Database className="w-32 h-32" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 mt-8 max-w-lg w-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <p className="text-xl text-gray-300 mb-6 font-light">
              The project document you are querying does not exist in the database.
            </p>
            
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-8 font-mono text-sm text-left flex flex-col gap-2">
              <span className="text-red-400">&gt; Query failed for ID:</span>
              <span className="text-primary break-all pl-4">{params?.id}</span>
            </div>

            <button 
              onClick={() => router.push('/#projects')} 
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-500/10 border border-red-500/30 rounded-xl overflow-hidden hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50"
            >
              <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-500 to-primary transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Projects</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const hasScreenshots = project.screenshots && project.screenshots.length > 0;

  return (
    <main className="min-h-screen bg-dark-bg text-white pb-32">
      <Header />
      
      {/* Premium Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-[70vh] z-0 overflow-hidden">
        {project.projectImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={project.projectImage} 
            alt="background blur" 
            className="w-full h-full object-cover blur-[120px] opacity-40 scale-125 translate-y-[-10%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/80 to-dark-bg"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-36">
        
        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32">
          
          {/* Text content - Order 2 on mobile, Order 1 on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 glass text-primary border border-primary/30 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(102,252,241,0.2)]">
                <Sparkles className="w-4 h-4" />
                {project.category}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
              {project.projectName}
            </h1>
            
            <div className="glass p-6 rounded-2xl border-white/5 shadow-xl mb-10">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                {project.projectDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              {project.links && project.links.map((lnk, i) => (
                <a 
                  key={i}
                  href={lnk.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg ${i === 0 ? 'bg-primary text-dark-bg hover:bg-primary-dark hover:shadow-primary/30' : 'glass text-white border border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                >
                  {lnk.title?.toLowerCase().includes('github') || lnk.title?.toLowerCase().includes('source') ? (
                    <Code2 className="w-5 h-5" />
                  ) : (
                    <ExternalLink className="w-5 h-5" />
                  )}
                  {lnk.title || 'Visit Project'}
                </a>
              ))}
            </div>

            {project.projectLanguages && project.projectLanguages.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-semibold">Tech Stack</h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.projectLanguages.map((tech, idx) => (
                    <motion.span 
                      key={tech} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="text-sm px-5 py-2 rounded-full glass border border-white/10 text-gray-200 font-medium hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Image content - Order 1 on mobile, Order 2 on large screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 order-1 lg:order-2 relative perspective-1000"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-accent-light to-accent rounded-[2rem] blur-3xl opacity-20 animate-pulse"></div>
            <div className="glass rounded-[2rem] relative overflow-hidden border border-white/20 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              {project.projectImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={project.projectImage} 
                  alt={project.projectName} 
                  className="w-full h-auto object-cover rounded-xl shadow-inner"
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Screenshots Section */}
        {hasScreenshots && (
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="pt-16 mb-12 flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl glass mb-6 border border-primary/20 text-primary">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Project Gallery</h2>
            <p className="text-gray-400 max-w-2xl text-lg font-light">A closer look at the interfaces and features built for this project.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.screenshots!.map((shot, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group relative rounded-[2rem] overflow-hidden glass aspect-video cursor-pointer border border-white/5 hover:border-primary/40 transition-colors shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={shot} 
                  alt={`${project.projectName} screenshot ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary font-bold text-sm tracking-widest uppercase mb-1 block">Preview</span>
                    <span className="text-white font-medium text-lg">Screenshot {index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}
      </div>
    </main>
  );
}
