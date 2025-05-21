import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useInView } from "react-intersection-observer";
import { ProjectCard } from "./project-card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "3D Interactive Product Viewer",
    description: "An immersive 3D product configurator built with Three.js and React, allowing users to customize and view products in real-time.",
    tags: ["React", "Three.js", "GSAP"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    demoColor: "#8B5CF6",
  },
  {
    id: 2,
    title: "E-commerce Dashboard",
    description: "A responsive dashboard with real-time analytics, inventory management, and order processing features.",
    tags: ["React", "TypeScript", "Tailwind"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    demoColor: "#6E59A5",
  },
  {
    id: 3,
    title: "Personal Finance App",
    description: "A mobile-first application for tracking expenses, setting budgets, and visualizing spending habits with interactive charts.",
    tags: ["React", "GSAP", "Charts"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    demoColor: "#D6BCFA",
  },
];

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !projectsRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });
    
    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.5"
    ).fromTo(
      projectsRef.current.children,
      { y: 80, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out" 
      },
      "-=0.3"
    ).fromTo(
      buttonRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );
    
    return () => {
      tl.kill();
    };
  }, []);
  
  const handleProjectHover = (index: number | null) => {
    setHoveredIndex(index);
  };
  
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 md:py-32 relative bg-gradient-to-b from-background to-background/60"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            My Work
          </div>
          
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold mb-6 text-center font-heading tracking-tight"
          >
            Featured <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Projects</span>
          </h2>
          
          <p 
            ref={subtitleRef}
            className="text-center text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Explore some of my recent work showcasing creative solutions across web development,
            interactive design, and 3D experiences.
          </p>
        </div>
        
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => handleProjectHover(index)}
              onMouseLeave={() => handleProjectHover(null)}
            >
              <ProjectCard 
                project={project}
              />
            </div>
          ))}
        </div>
        
        <div ref={buttonRef} className="mt-20 text-center">
          <Button 
            size="lg" 
            className="rounded-full px-8 py-6 text-base font-medium hover:scale-105 transition-transform duration-300 group"
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}