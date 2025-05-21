
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (!sectionRef.current || !imageRef.current || !contentRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });
    
    tl.fromTo(
      imageRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    ).fromTo(
      contentRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.6"
    );
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-16 md:py-24 bg-secondary/50 dark:bg-secondary/10"
    >
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div
          ref={imageRef}
          className="relative rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple to-purple-light opacity-20 mix-blend-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            alt="Developer Profile"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div ref={contentRef}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-gradient font-heading"
          >
            About Me
          </motion.h2>
          
          <motion.p className="text-lg mb-6 text-muted-foreground">
            I'm a passionate frontend developer with expertise in creating interactive and 
            visually stunning web experiences. With a strong foundation in modern technologies 
            like React, Three.js, and GSAP, I bring creative visions to life through code.
          </motion.p>
          
          <motion.p className="text-lg mb-6 text-muted-foreground">
            My approach combines technical excellence with creative problem-solving, 
            resulting in websites and applications that are not only functional but 
            also emotionally engaging and memorable.
          </motion.p>
          
          <motion.div className="flex flex-wrap gap-3 mt-8">
            <span className="px-4 py-2 bg-purple/10 text-purple rounded-full">React</span>
            <span className="px-4 py-2 bg-purple/10 text-purple rounded-full">Three.js</span>
            <span className="px-4 py-2 bg-purple/10 text-purple rounded-full">TypeScript</span>
            <span className="px-4 py-2 bg-purple/10 text-purple rounded-full">GSAP</span>
            <span className="px-4 py-2 bg-purple/10 text-purple rounded-full">Tailwind CSS</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}