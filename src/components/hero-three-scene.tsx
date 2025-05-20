
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Box, Torus, Float } from "@react-three/drei";
import * as THREE from "three";

export function HeroThreeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gently rotate the entire group
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    
    // Add parallax effect based on mouse position
    const { mouse } = state;
    groupRef.current.position.x = mouse.x * 0.3;
    groupRef.current.position.y = mouse.y * 0.3;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="purple" intensity={1} />
      
      {/* Floating purple sphere */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.7, 32, 32]} position={[-2, 1, -1]}>
          <meshStandardMaterial 
            color="#8B5CF6" 
            roughness={0.2} 
            metalness={0.8}
          />
        </Sphere>
      </Float>
      
      {/* Floating torus */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <Torus args={[1.2, 0.4, 16, 32]} position={[2.5, 0, -2]}>
          <meshStandardMaterial 
            color="#D6BCFA" 
            roughness={0.4} 
            metalness={0.6} 
          />
        </Torus>
      </Float>
      
      {/* Interactive cube */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <Box 
          args={[1, 1, 1]} 
          position={[0, -1, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={hovered ? "#D6BCFA" : "#8B5CF6"} 
            wireframe={hovered}
            roughness={0.3} 
            metalness={0.7} 
          />
        </Box>
      </Float>
      
      {/* Small floating spheres */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float 
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <Sphere 
            args={[0.1 + Math.random() * 0.1, 16, 16]} 
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10
            ]}
          >
            <meshStandardMaterial 
              color={Math.random() > 0.5 ? "#8B5CF6" : "#D6BCFA"} 
              roughness={0.5} 
              metalness={0.5} 
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}
