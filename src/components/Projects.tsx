'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { getProjects, Project } from '@/lib/services';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <section 
      id="projects" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/projects_bg.png")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse"></div>
            </div>
            <p className="text-primary/70 text-sm font-mono uppercase tracking-widest animate-pulse">Loading</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-2xl overflow-hidden group flex flex-col h-full hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300"
              >
                {project.projectImage && (
                  <div className="w-full h-48 overflow-hidden relative bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.projectImage} 
                      alt={project.projectName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.projectName}</h3>
                    {project.category && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-6 flex-grow text-sm">{project.projectDescription}</p>
                  
                  {project.projectLanguages && project.projectLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.projectLanguages.map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="text-sm flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {project.links && project.links.length > 0 && project.links.map((lnk, i) => (
                      <a 
                        key={i}
                        href={lnk.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors ml-auto"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{lnk.title || 'Live Demo'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">No projects found.</div>
        )}
      </div>
    </section>
  );
}
