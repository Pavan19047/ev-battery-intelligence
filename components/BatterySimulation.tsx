// src/components/BatterySimulation.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// This is the main 3D model of the battery
const BatteryModel = ({ soh, alertLevel }) => {
  const meshRef = useRef<THREE.Group>(null);
  const energyLevelRef = useRef<THREE.Mesh>(null);

  // Animate the battery pulsating slightly
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });

  // Determine battery color based on State of Health (SoH)
  const batteryColor = useMemo(() => {
    const hue = (soh / 100) * 120; // 0 = red, 120 = green
    return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
  }, [soh]);
  
  // Calculate the height of the inner energy level based on SoH
  const energyHeight = 1.8 * (soh / 100);

  return (
    <group ref={meshRef}>
      {/* Main battery cylinder */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial 
            color="#333333" 
            metalness={0.8} 
            roughness={0.2} 
        />
      </mesh>
      
      {/* Positive terminal cap */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9} 
            roughness={0.1} 
        />
      </mesh>

      {/* Inner glowing energy level */}
      <mesh ref={energyLevelRef} position={[0, -1 + energyHeight / 2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, energyHeight, 32]} />
        <meshStandardMaterial
          color={batteryColor}
          emissive={batteryColor} // Makes it glow
          emissiveIntensity={2}
          toneMapped={false} // Ensures the glow is vibrant
        />
      </mesh>
    </group>
  );
};

// Particle system to visualize the battery's health alert level
const HealthParticles = ({ alertLevel }) => {
    const particleCount = 200;
    const particlesRef = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const alertColor = new THREE.Color();

        if (alertLevel === 'critical') alertColor.set('red');
        else if (alertLevel === 'warning') alertColor.set('yellow');
        else alertColor.set('lime');

        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.5 + Math.random() * 1;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            
            alertColor.toArray(col, i * 3);
        }
        return [pos, col];
    }, [alertLevel]);

    useFrame((state) => {
        if (particlesRef.current) {
            const time = state.clock.getElapsedTime();
            particlesRef.current.rotation.y = time * 0.2;
            particlesRef.current.rotation.x = time * 0.1;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} vertexColors={true} transparent={true} opacity={0.8} />
        </points>
    );
};


// The main component that wraps the entire 3D scene
interface BatterySimulationProps {
  analysisResult: {
    soh_percentage: number;
    rul_cycles: number;
    alert_level: 'nominal' | 'warning' | 'critical';
  };
}

const BatterySimulation: React.FC<BatterySimulationProps> = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const { soh_percentage, rul_cycles, alert_level } = analysisResult;

  return (
    // THE FIX, PART 2: Changed from `h-96` to `h-full`. This makes the component
    // flexible, allowing it to fill the height defined by its parent in Dashboard.tsx.
    <div className="w-full h-full rounded-lg relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lighting is crucial for 3D scenes */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <BatteryModel soh={soh_percentage} alertLevel={alert_level} />
        <HealthParticles alertLevel={alert_level} />
        
        {/* This allows the user to control the camera */}
        <OrbitControls enableZoom={true} enablePan={false} />

        {/* Annotations displayed in the 3D space */}
        <Html position={[-2, 1, 0]}>
            <div className="text-white text-center p-2 rounded bg-black bg-opacity-50 pointer-events-none">
                <div className="text-2xl font-bold">{soh_percentage.toFixed(1)}%</div>
                <div className="text-xs uppercase">State of Health</div>
            </div>
        </Html>
        <Html position={[2, 1, 0]}>
            <div className="text-white text-center p-2 rounded bg-black bg-opacity-50 pointer-events-none">
                <div className="text-2xl font-bold">{rul_cycles}</div>
                <div className="text-xs uppercase">RUL (Cycles)</div>
            </div>
        </Html>
      </Canvas>
       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-400 text-xs pointer-events-none">
        Click and drag to rotate the battery
      </div>
    </div>
  );
};

export default BatterySimulation;
