
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { HeroThreeScene } from "./hero-three-scene";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !textRef.current) return;

    const tl = gsap.timeline();
    
    tl.fromTo(
      headingRef.current.children,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    )
      .fromTo(
        textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
          <HeroThreeScene />
        </Canvas>
      </div>

      <div className="container relative z-10 px-4 md:px-6 text-center">
        <h1 
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 font-heading overflow-hidden"
        >
          <span className="block">
            <motion.span 
              className="inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Creative
            </motion.span>
          </span>
          <span className="block text-gradient">
            <motion.span 
              className="inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              Developer
            </motion.span>
          </span>
          <span className="block">
            <motion.span 
              className="inline-block"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Portfolio
            </motion.span>
          </span>
        </h1>
        
        <motion.p 
          ref={textRef}
          className="max-w-[700px] text-lg md:text-xl mx-auto mb-8 text-muted-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          I create engaging digital experiences with modern web technologies.
          Specializing in React, Three.js and creative web development.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="rounded-full">
            View My Work
          </Button>
          <Button size="lg" variant="outline" className="rounded-full">
            Contact Me
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowDown />
            <span className="sr-only">Scroll Down</span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
