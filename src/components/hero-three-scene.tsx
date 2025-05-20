
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
    
    // Simple mouse tracking
    const { mouse } = state;
    groupRef.current.position.x = mouse.x * 0.3;
    groupRef.current.position.y = mouse.y * 0.3;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="purple" intensity={1} />
      
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
      
      {/* Small floating spheres - using a limited number */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Sphere 
          key={i}
          args={[0.1 + Math.random() * 0.1, 8, 8]} 
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
          ]}
        >
          <meshStandardMaterial 
            color={Math.random() > 0.5 ? "#8B5CF6" : "#D6BCFA"} 
            roughness={0.5} 
            metalness={0.5} 
          />
        </Sphere>
      ))}
    </group>
  );
}
