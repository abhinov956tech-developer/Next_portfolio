
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

export function HeroThreeScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Simple rotation animation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Main sphere */}
      <Sphere args={[0.7, 16, 16]} position={[-1, 0.5, 0]}>
        <meshStandardMaterial 
          color="#8B5CF6" 
          roughness={0.4} 
          metalness={0.6}
        />
      </Sphere>
      
      {/* Simple box */}
      <Box 
        args={[1, 1, 1]} 
        position={[1, -0.5, 0]}
      >
        <meshStandardMaterial 
          color="#D6BCFA"
          roughness={0.3} 
          metalness={0.7} 
        />
      </Box>
      
      {/* Small floating spheres - reduced number and simplified */}
      {[1, 2, 3].map((_, i) => (
        <Sphere 
          key={i}
          args={[0.1, 8, 8]} 
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
        >
          <meshStandardMaterial 
            color={i === 0 ? "#8B5CF6" : "#D6BCFA"}
            roughness={0.5} 
            metalness={0.5} 
          />
        </Sphere>
      ))}
    </group>
  );
}
