
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useInView } from "react-intersection-observer";
import { ProjectCard } from "./project-card";
import { Button } from "./ui/button";

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
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
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
      projectsRef.current.children,
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out" 
      },
      "-=0.4"
    );
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 md:py-24"
    >
      <div className="container px-4 md:px-8">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold mb-4 text-center font-heading"
        >
          Featured <span className="text-gradient">Projects</span>
        </h2>
        
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
          Explore some of my recent work showcasing creative solutions across web development,
          interactive design, and 3D experiences.
        </p>
        
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" className="rounded-full">View All Projects</Button>
        </div>
      </div>
    </section>
  );
}
