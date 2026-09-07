import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Node3D {
  id: string;
  label: string;
  position: THREE.Vector3;
  activation: number;
}

interface Connection3D {
  from: string;
  to: string;
  weight: number;
}

interface NeuralNetwork3DProps {
  vocabulary: string[];
  weights: number[][];
  highlightedConnection?: { from: string; to: string } | null;
  autoRotate?: boolean;
}

export const NeuralNetwork3D: React.FC<NeuralNetwork3DProps> = ({
  vocabulary,
  weights,
  highlightedConnection,
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | undefined>(undefined);
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined);
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10131c);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create nodes in 3D circle
    const nodes: Node3D[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const radius = 3;

    vocabulary.forEach((word, index) => {
      const angle = (index / vocabulary.length) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = 0;

      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.3,
        shininess: 100,
      });

      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      mesh.position.set(x, y, z);
      mesh.userData = { id: word, label: word };
      scene.add(mesh);

      // Add text label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 128;
      context.fillStyle = '#ffffff';
      context.font = 'Bold 48px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(word, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(1.5, 0.75, 1);
      sprite.position.set(x, y + 0.6, z);
      scene.add(sprite);

      nodes.push({
        id: word,
        label: word,
        position: new THREE.Vector3(x, y, z),
        activation: 1,
      });
    });

    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true });

    weights.forEach((row, i) => {
      row.forEach((weight, j) => {
        if (i !== j && weight > 0.01) {
          const fromNode = nodes[i];
          const toNode = nodes[j];

          const points = [fromNode.position, toNode.position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          const material = lineMaterial.clone();
          material.opacity = Math.min(weight, 1) * 0.7;
          material.linewidth = weight * 5;

          const line = new THREE.Line(geometry, material);
          line.userData = { from: fromNode.id, to: toNode.id, weight };
          scene.add(line);
        }
      });
    });

    setIsInitialized(true);

    // Animation loop
    let rotation = 0;
    const animate = () => {
      if (autoRotate) {
        rotation += 0.002;
        scene.rotation.z = rotation;
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [vocabulary, weights, autoRotate]);

  // Update highlighted connection
  useEffect(() => {
    if (!sceneRef.current || !highlightedConnection) return;

    const scene = sceneRef.current;
    
    scene.children.forEach((child) => {
      if (child.userData.from && child.userData.to) {
        const line = child as THREE.Line;
        const material = line.material as THREE.LineBasicMaterial;
        
        const isHighlighted =
          child.userData.from === highlightedConnection.from &&
          child.userData.to === highlightedConnection.to;

        if (isHighlighted) {
          material.color.setHex(0xfbbf24); // Yellow
          material.opacity = 1;
        } else {
          material.color.setHex(0x38bdf8); // Cyan
          material.opacity = Math.min(child.userData.weight, 1) * 0.7;
        }
      }
    });
  }, [highlightedConnection]);

  return (
    <div className="neural-network-3d">
      <div ref={containerRef} className="canvas-container" />
      {isInitialized && (
        <div className="controls-3d">
          <div className="control-hint">
            <span className="hint-icon">🔄</span>
            <span>Auto-rotating 3D view</span>
          </div>
        </div>
      )}
    </div>
  );
};
