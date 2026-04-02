'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  title: string;
  category: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

const projects: Project[] = [
  {
    title: 'Al-Noor Academy',
    category: 'Education',
    description:
      'A complete school management portal with admissions, fee tracking, and parent communication — built with brand-aligned blues and warm neutrals to convey trust and academic excellence.',
    url: 'https://manage.cubico.tech',
    thumbnail: '/portfolio/alnoor.png',
    tags: ['Next.js', 'Branding', 'Dashboard'],
  },
  {
    title: 'MedCare Clinic',
    category: 'Healthcare',
    description:
      'Patient-facing booking and EHR system designed with calming greens and clean whites — every color choice rooted in healthcare psychology to reduce patient anxiety.',
    url: 'https://teach.cubico.tech',
    thumbnail: '/portfolio/medcare.png',
    tags: ['React', 'Health UX', 'Accessibility'],
  },
  {
    title: 'Urban Threads',
    category: 'E-Commerce',
    description:
      'A fashion e-commerce store with bold typographic hierarchy and conversion-optimised product pages — color palette derived from brand identity guidelines for maximum recall.',
    url: 'https://creative.cubico.tech',
    thumbnail: '/portfolio/urbanthreads.png',
    tags: ['E-Commerce', 'Shopify', 'CRO'],
  },
  {
    title: 'GreenVolt Energy',
    category: 'Corporate',
    description:
      'Corporate website for a renewable energy firm featuring data-driven animations, sustainability-inspired color science, and an authoritative yet approachable tone.',
    url: 'https://learn.cubico.tech',
    thumbnail: '/portfolio/greenvolt.png',
    tags: ['Corporate', 'Animation', 'SEO'],
  },
  {
    title: 'Foodies Hub',
    category: 'Restaurant',
    description:
      'Restaurant ordering platform designed with appetite-stimulating warm tones, intuitive menu navigation, and a seamless checkout — psychology meets plate presentation.',
    url: 'https://market.cubico.tech',
    thumbnail: '/portfolio/foodieshub.png',
    tags: ['Food Tech', 'PWA', 'UX Design'],
  },
];

export default function PortfolioShowcase() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the iframe content
  useEffect(() => {
    if (!activeProject) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    const startAutoScroll = () => {
      // Wait for iframe to load, then start scrolling
      const iframe = iframeRef.current;
      if (!iframe) return;

      scrollIntervalRef.current = setInterval(() => {
        try {
          iframe.contentWindow?.scrollBy({ top: 1, behavior: 'auto' });
        } catch {
          // Cross-origin — use postMessage fallback or just let it be
        }
      }, 30);
    };

    const timer = setTimeout(startAutoScroll, 2000);
    return () => {
      clearTimeout(timer);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [activeProject]);

  const openProject = (project: Project) => {
    setActiveProject(project);
    // Smooth scroll to the showcase container
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const closeProject = () => {
    setActiveProject(null);
  };

  const navigateProject = (direction: 'prev' | 'next') => {
    if (!activeProject) return;
    const idx = projects.indexOf(activeProject);
    const newIdx =
      direction === 'next'
        ? (idx + 1) % projects.length
        : (idx - 1 + projects.length) % projects.length;
    setActiveProject(projects[newIdx]);
  };

  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Projects that speak for themselves
          </h2>
          <p className="text-surface-400 font-body max-w-2xl mx-auto">
            Every project we deliver is a blend of strategic branding, colour
            psychology, and performance engineering. Click any project to see it
            live — right here.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project, i) => (
            <motion.button
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => openProject(project)}
              className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 ${
                activeProject?.title === project.title
                  ? 'bg-brand-900/40 border-brand-700 shadow-xl shadow-brand-900/20'
                  : 'bg-surface-900 border-surface-800 hover:border-surface-700 hover:shadow-lg hover:shadow-brand-900/10'
              }`}
            >
              {/* Thumbnail placeholder */}
              <div className="w-full h-36 rounded-xl bg-surface-800 border border-surface-700 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-brand-400/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-surface-500 text-xs font-body uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 transition-colors flex items-center justify-center">
                  <ExternalLink
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              <p className="text-xs text-brand-400 font-body font-medium uppercase tracking-wider mb-1">
                {project.category}
              </p>
              <h3 className="font-display font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-surface-400 font-body leading-relaxed line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-body font-medium rounded-full bg-surface-800 text-surface-400 border border-surface-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Inline Iframe Showcase */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-surface-700 bg-surface-900 overflow-hidden">
                {/* Browser chrome bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface-800 border-b border-surface-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={closeProject}
                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                        aria-label="Close preview"
                      />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-900 rounded-lg text-xs text-surface-400 font-body min-w-0">
                      <span className="truncate">{activeProject.url}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateProject('prev')}
                      className="p-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-300 transition-colors"
                      aria-label="Previous project"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => navigateProject('next')}
                      className="p-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-300 transition-colors"
                      aria-label="Next project"
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={closeProject}
                      className="p-1.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-300 transition-colors"
                      aria-label="Close"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Project info bar */}
                <div className="px-4 py-3 bg-surface-850 border-b border-surface-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-white text-sm">
                      {activeProject.title}
                    </h3>
                    <p className="text-xs text-surface-400 font-body mt-0.5">
                      {activeProject.description}
                    </p>
                  </div>
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-lg transition-colors font-body"
                  >
                    <ExternalLink size={12} />
                    Open Full Site
                  </a>
                </div>

                {/* Iframe with auto-scroll */}
                <div className="relative w-full h-[500px] sm:h-[600px]">
                  <iframe
                    ref={iframeRef}
                    src={activeProject.url}
                    title={`Preview of ${activeProject.title}`}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  {/* Scroll indicator overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-900/80 to-transparent pointer-events-none flex items-end justify-center pb-3">
                    <span className="text-[10px] text-surface-400 font-body uppercase tracking-widest animate-pulse">
                      Auto-scrolling preview
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
