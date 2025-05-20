
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";

export function HeroThreeScene() {
  const boxRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!boxRef.current) return;
    
    // Simple rotation animation
    boxRef.current.rotation.y += 0.01;
    boxRef.current.rotation.x += 0.005;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Simple box */}
      <Box 
        ref={boxRef}
        args={[1, 1, 1]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#8B5CF6"
          roughness={0.3} 
          metalness={0.7} 
        />
      </Box>
    </>
  );
}
