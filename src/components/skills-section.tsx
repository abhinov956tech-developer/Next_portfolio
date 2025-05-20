
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "React", level: 90 },
  { name: "Three.js", level: 85 },
  { name: "GSAP Animation", level: 80 },
  { name: "TypeScript", level: 85 },
  { name: "UI/UX Design", level: 75 },
  { name: "Responsive Design", level: 95 },
];

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const skillsListRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !skillsListRef.current) return;
    
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
      skillsListRef.current.children,
      { x: -50, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.6, 
        stagger: 0.1, 
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
      id="skills"
      className="py-16 md:py-24 bg-secondary/50 dark:bg-secondary/10"
    >
      <div className="container px-4 md:px-8">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've developed expertise in a wide range of technologies, with a focus on creating
            interactive, animated web experiences.
          </p>
        </div>
        
        <div 
          ref={skillsListRef}
          className="max-w-3xl mx-auto space-y-6"
        >
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">{skill.level}%</span>
              </div>
              <SkillProgress value={skill.level} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillProgress({ value, inView }: { value: number, inView: boolean }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setProgress(value), 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [inView, value]);
  
  return (
    <Progress 
      value={progress} 
      className="h-2" 
      // Fix: Use className with cn utility to modify the indicator styling
      className={cn("h-2", "relative overflow-hidden [&>div]:bg-gradient-to-r [&>div]:from-purple [&>div]:to-purple-light")}
    />
  );
}
