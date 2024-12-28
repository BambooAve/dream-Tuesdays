import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FeaturePoint {
  title: string;
  description: string;
}

const FEATURE_POINTS: FeaturePoint[] = [
  {
    title: "Clarity on Your Goals",
    description: "Through our guided tools, you'll uncover what truly matters to you and create actionable goals to turn your dreams into your reality."
  },
  {
    title: "A Personalized Plan",
    description: "After a conversation with our AI coach, Jaxon, you'll receive a fully customized plan designed to help you build your dream daily life."
  },
  {
    title: "Track Progress, Stay Motivated",
    description: "See your growth in real-time. Our dashboard makes it easy to stay on top of your goals and celebrate your wins, big or small."
  },
  {
    title: "Balance Across Life's Categories",
    description: "Whether it's health, relationships, career, or fun, Dream Tuesdays helps you prioritize all areas of your life for lasting happiness."
  },
  {
    title: "Flexibility to Evolve",
    description: "Life changes—and so do your dreams. Update, adjust, and add new goals anytime as you continue to grow."
  },
  {
    title: "A Better Life Starts Now",
    description: "Don't wait for the perfect moment. Start today, and make every Tuesday (and every day) a little closer to your dream."
  }
];

export const SignUpContent = () => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const scenes: THREE.Scene[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    const renderers: THREE.WebGLRenderer[] = [];
    const animations: (() => void)[] = [];

    containerRefs.current.forEach((container, index) => {
      if (!container) return;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      
      renderer.setSize(50, 50);
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(ambientLight, directionalLight);

      // Create unique geometry based on index
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;
      let mesh: THREE.Mesh;

      switch (index) {
        case 0: // Clarity - Icosahedron
          geometry = new THREE.IcosahedronGeometry(1);
          material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true });
          break;
        case 1: // Plan - Cube
          geometry = new THREE.BoxGeometry();
          material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
          break;
        case 2: // Progress - Torus
          geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
          material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
          break;
        case 3: // Balance - Octahedron
          geometry = new THREE.OctahedronGeometry();
          material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
          break;
        case 4: // Flexibility - Sphere
          geometry = new THREE.SphereGeometry(1, 32, 32);
          material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
          break;
        default: // Better Life - Dodecahedron
          geometry = new THREE.DodecahedronGeometry();
          material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
      }

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 2.5;

      // Animation
      const animate = () => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      scenes.push(scene);
      cameras.push(camera);
      renderers.push(renderer);
      animations.push(animate);
    });

    // Animation loop
    const animateAll = () => {
      animations.forEach(animate => animate());
      requestAnimationFrame(animateAll);
    };
    animateAll();

    // Cleanup
    return () => {
      renderers.forEach(renderer => {
        const parent = renderer.domElement.parentElement;
        if (parent) {
          parent.removeChild(renderer.domElement);
        }
        renderer.dispose();
      });
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {FEATURE_POINTS.map((point, index) => (
        <div key={point.title} className="flex items-start gap-4">
          <div 
            ref={el => containerRefs.current[index] = el}
            className="w-[50px] h-[50px] flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold text-lg mb-1">{point.title}</h3>
            <p className="text-sm text-muted-foreground">{point.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};