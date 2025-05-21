import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  demoColor: string;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectPreview({ color }: { color: string }) {
  return (
    <Canvas className="h-56">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial 
            color={color} 
            attach="material" 
            distort={0.5} 
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
    </Canvas>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card 
        ref={cardRef}
        className="overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-background/80 to-muted/50">
          <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <ProjectPreview color={project.demoColor} />
          </div>
          <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-3 right-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-background/80 backdrop-blur-md border border-muted transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-secondary/60 text-secondary-foreground backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-border/40">
          <motion.button 
            className="text-sm font-medium text-primary flex items-center transition-colors hover:text-primary/80"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            View Details
            <span className="ml-1 text-primary">→</span>
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}