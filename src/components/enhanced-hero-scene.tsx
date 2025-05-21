import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float, MeshDistortMaterial, GradientTexture, useTexture, MeshWobbleMaterial, Trail, Instances, Instance } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

interface EnhancedHeroSceneProps {
  mousePosition: { x: number; y: number };
}

// Custom shader for background gradient mesh
const fragmentShader = `
  varying vec2 vUv;
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorC;
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
  
  void main() {
    vec3 noise = vec3(snoise(vec3(vUv * 2.0, time * 0.1)));
    
    // Create gradient with 3 colors
    vec3 color1 = mix(colorA, colorB, smoothstep(0.0, 0.5, vUv.y + noise.x * 0.1));
    vec3 color2 = mix(colorB, colorC, smoothstep(0.5, 1.0, vUv.y + noise.x * 0.1));
    vec3 finalColor = mix(color1, color2, smoothstep(0.4, 0.6, vUv.y));
    
    // Add subtle noise pattern
    finalColor += noise * 0.05;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Background Mesh Component
function BackgroundMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    colorA: { value: new THREE.Color("#1a1a2e") },
    colorB: { value: new THREE.Color("#30106b") },
    colorC: { value: new THREE.Color("#0f0f1b") }
  }), []);

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[30, 30, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// Particle field component
function ParticleField() {
  const instancesRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ],
      scale: Math.random() * 0.1 + 0.05,
      speed: Math.random() * 0.02 + 0.01
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((particle, i) => {
      const instanceMesh = instancesRef.current;
      if (instanceMesh) {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(...particle.position);
        
        // Add subtle movement
        position.y += Math.sin(t * particle.speed + i) * 0.05;
        position.x += Math.cos(t * particle.speed + i) * 0.05;
        
        matrix.setPosition(position);
        matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale));
        instanceMesh.setMatrixAt(i, matrix);
      }
    });
    
    if (instancesRef.current) {
      instancesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Instances ref={instancesRef} limit={100}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      {particles.map((particle, i) => (
        <Instance key={i} position={particle.position as [number, number, number]} scale={particle.scale} />
      ))}
    </Instances>
  );
}

// Animated glow sphere
function GlowSphere({ position, color, scale = 1, speed = 1 }: { position: [number, number, number], color: string, scale?: number, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed;
      meshRef.current.position.y += Math.sin(t) * 0.002;
      meshRef.current.position.x += Math.cos(t) * 0.002;
    }
  });
  
  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={scale * 1.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export function EnhancedHeroScene({ mousePosition }: EnhancedHeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Parallax effect based on mouse movement
  useEffect(() => {
    if (!groupRef.current) return;
    
    const targetX = mousePosition.x * 0.5;
    const targetY = mousePosition.y * 0.5;
    
    // Apply smooth transition to parallax
    gsap.to(groupRef.current.position, {
      x: targetX,
      y: targetY,
      duration: 0.8,
      ease: "power2.out"
    });
  }, [mousePosition]);

  // Overall animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Gentle floating rotation
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
  });

  return (
    <>
      {/* Background gradient */}
      <BackgroundMesh />
      
      {/* Ambient particles */}
      <ParticleField />
      
      {/* Main 3D elements */}
      <group ref={groupRef} position={[0, 0, -2]}>
        {/* Main feature spheres */}
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
          <GlowSphere position={[-3, 2, 0]} color="#8B5CF6" scale={1.2} speed={0.8} />
        </Float>
        
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
          <GlowSphere position={[3, -1, -2]} color="#4F46E5" scale={0.9} speed={1.2} />
        </Float>
        
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
          <GlowSphere position={[0, -2.5, -1]} color="#A78BFA" scale={0.7} speed={1} />
        </Float>
        
        {/* Small floating accent spheres */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Float 
            key={i}
            speed={1 + Math.random()}
            rotationIntensity={0.2}
            floatIntensity={0.5}
          >
            <Sphere 
              args={[0.08 + Math.random() * 0.1, 16, 16]} 
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10 - 2
              ]}
            >
              <meshStandardMaterial 
                color={Math.random() > 0.6 ? "#8B5CF6" : Math.random() > 0.5 ? "#4F46E5" : "#D6BCFA"} 
                roughness={0.5} 
                metalness={0.5} 
                emissive={Math.random() > 0.7 ? "#A78BFA" : "#000000"}
                emissiveIntensity={0.5}
              />
            </Sphere>
          </Float>
        ))}
      </group>
      
      {/* Additional lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8B5CF6" />
      <pointLight position={[8, -5, 0]} intensity={0.5} color="#4F46E5" />
    </>
  );
}