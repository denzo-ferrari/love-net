import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  MessageCircleHeart, 
  Heart, 
  Activity, 
  Calendar, 
  Clock, 
  MapPin, 
  Send,
  X,
  Plus,
  Loader2,
  Navigation,
  Rocket,
  Map as MapIcon,
  Flame,
  User as UserIcon,
  History,
  Sparkles,
  Globe,
  LogOut,
  LogIn,
  Info,
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  ShieldAlert
} from 'lucide-react';

// --- TypeScript Declarations for Environment Variables ---
declare const __initial_auth_token: string | undefined;
declare const __firebase_config: string;
declare const __app_id: string | undefined;

// --- Constants ---
const EARTH_TEXTURE_URL = "https://unpkg.com/three-globe/example/img/earth-night.jpg";
const EARTH_BUMP_URL = "https://unpkg.com/three-globe/example/img/earth-topology.png";

const MAP_TILE_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const MAP_LABEL_URL = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";
const MAP_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// --- Firebase Setup ---
// ---------------------------------------------------------
// PASTE YOUR FIREBASE CONFIGURATION HERE
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyA96KlJDvk0mW4cE9RwvZVssL5EfZpxPjc",
  authDomain: "love-net-e96a3.firebaseapp.com",
  projectId: "love-net-e96a3",
  storageBucket: "love-net-e96a3.firebasestorage.app",
  messagingSenderId: "918940227524",
  appId: "1:918940227524:web:253c166f89d28b156fb691",
  measurementId: "G-TM19SFK7FT"
};

// ---------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Stable collection name
const COLLECTION_NAME = 'global-comments';

// --- Types ---
interface CommentData {
  id: string;
  text: string;
  lat: number;
  lng: number;
  createdAt: Timestamp | null;
  uid: string;
  isAnonymous: boolean;
  authorName?: string; 
}

interface StatCounts {
  day: number;
  week: number;
  month: number;
  year: number;
}

// ==========================================
// HELPER COMPONENTS (Defined First)
// ==========================================

function StatCard({ label, count, icon }: { label: string, count: number, icon: React.ReactNode }) {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-rose-900/30 rounded-lg px-4 py-2 flex flex-col items-center min-w-[80px] shadow-lg">
      <span className="text-rose-400 font-mono text-xl font-bold">{count}</span>
      <div className="flex items-center gap-1 text-[10px] text-rose-300/70 uppercase tracking-wide">
        {icon}
        {label}
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, sub, icon }: { title: string, value: string | number, sub: string, icon: React.ReactNode }) {
  return (
    <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase tracking-wider text-rose-400">{title}</span>
            <span className="text-rose-500 opacity-70">{icon}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-[10px] text-rose-500 font-mono">{sub}</div>
    </div>
  );
}

function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [activeUsers, setActiveUsers] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f0005] border border-rose-900 w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-rose-900/50 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-900/30 rounded-lg border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 text-rose-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-rose-100 tracking-wide uppercase">Admin Command Center</h2>
                <p className="text-xs text-rose-400 font-mono">LOVENET SYSTEM DIAGNOSTICS</p>
            </div>
          </div>
          <button onClick={onClose} className="text-rose-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AdminStatCard title="Active Users" value={activeUsers} sub="+12% from yesterday" icon={<Users className="w-4 h-4" />} />
                <AdminStatCard title="Avg. Time on Site" value="4m 32s" sub="-30s from yesterday" icon={<Clock className="w-4 h-4" />} />
                <AdminStatCard title="Total Visits (24h)" value="14,203" sub="+5.4% trend" icon={<Activity className="w-4 h-4" />} />
                <AdminStatCard title="Bounce Rate" value="24.8%" sub="Stable" icon={<BarChart3 className="w-4 h-4" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64">
                <div className="lg:col-span-2 bg-rose-950/10 border border-rose-900/30 rounded-xl p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-rose-200 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-rose-500" /> 
                        Traffic Trends (7 Days)
                    </h3>
                    <div className="flex-1 flex items-end gap-2 px-2 pb-2">
                        {[45, 52, 49, 62, 58, 74, 85].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div 
                                    className="w-full bg-gradient-to-t from-rose-900 to-rose-500 rounded-t-sm relative transition-all duration-500 group-hover:opacity-80" 
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 100}
                                    </div>
                                </div>
                                <div className="text-[10px] text-rose-500/50 text-center mt-2">D-{7-i}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-rose-200 mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-rose-500" />
                        Acquisition Source
                    </h3>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div 
                            className="w-32 h-32 rounded-full relative"
                            style={{
                                background: `conic-gradient(
                                    #be123c 0% 45%, 
                                    #fb7185 45% 75%, 
                                    #fda4af 75% 100%
                                )`
                            }}
                        >
                            <div className="absolute inset-4 bg-[#0f0005] rounded-full flex items-center justify-center flex-col">
                                <span className="text-xs text-rose-500/70">Total</span>
                                <span className="text-lg font-bold text-rose-100">100%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 text-[10px] text-rose-300 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-700 rounded-full"></div> Direct (45%)</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-400 rounded-full"></div> Search (30%)</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-200 rounded-full"></div> Ref (25%)</div>
                    </div>
                </div>
            </div>

            <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-4">
                <h3 className="text-sm font-bold text-rose-200 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-500" />
                    Time Spent Distribution
                </h3>
                <div className="h-4 bg-rose-900/20 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-800 w-[20%]"></div>
                    <div className="h-full bg-rose-600 w-[40%]"></div>
                    <div className="h-full bg-rose-400 w-[25%]"></div>
                    <div className="h-full bg-rose-300 w-[15%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-rose-400 mt-2 px-1">
                    <span>&lt; 30s (Bounce)</span>
                    <span>30s - 2m</span>
                    <span>2m - 5m</span>
                    <span>&gt; 5m (Deep Love)</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

function CommentModal({ onClose, userLocation, appId, user }: { onClose: () => void, userLocation: any, appId: string, user: User | null }) {
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnon, setIsAnon] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isAnon && !authorName.trim()) {
        alert("Please enter your name or stay anonymous.");
        return;
    }

    setIsSubmitting(true);
    try {
      const finalLat = userLocation ? userLocation.lat : (Math.random() * 160 - 80);
      const finalLng = userLocation ? userLocation.lng : (Math.random() * 360 - 180);

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME), {
        text: text,
        lat: finalLat + (Math.random() * 0.01 - 0.005),
        lng: finalLng + (Math.random() * 0.01 - 0.005),
        createdAt: serverTimestamp(),
        uid: user?.uid || 'anon',
        isAnonymous: isAnon,
        authorName: isAnon ? null : authorName 
      });
      onClose();
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border border-rose-900 w-full max-w-md rounded-2xl shadow-2xl shadow-rose-900/20 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-rose-100 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <MessageCircleHeart className="text-rose-500 w-6 h-6" />
              Confess Your Love
            </h2>
            <button onClick={onClose} className="text-rose-900 hover:text-rose-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-rose-400 mb-2 uppercase tracking-wider">Your Story</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#1a0505] border border-rose-900/50 rounded-lg p-3 text-rose-100 focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none resize-none h-32 placeholder-rose-900/50"
                placeholder="Where did you fall in love? Tell us..."
                maxLength={280}
              />
              <div className="text-right text-xs text-rose-800 mt-1">{text.length}/280</div>
            </div>

            {/* Identity Section */}
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="anon" 
                    checked={isAnon} 
                    onChange={(e) => setIsAnon(e.target.checked)}
                    className="w-4 h-4 rounded border-rose-900 bg-[#1a0505] text-rose-600 focus:ring-offset-black"
                  />
                  <label htmlFor="anon" className="text-sm text-rose-300">Stay Anonymous</label>
               </div>

               {!isAnon && (
                   <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                       <label className="block text-xs font-medium text-rose-400 mb-1 uppercase tracking-wider">Your Name</label>
                       <div className="flex items-center gap-2 bg-[#1a0505] border border-rose-900/50 rounded-lg p-2">
                           <UserIcon className="w-4 h-4 text-rose-600" />
                           <input 
                             type="text" 
                             value={authorName}
                             onChange={(e) => setAuthorName(e.target.value)}
                             className="bg-transparent text-rose-100 w-full outline-none placeholder-rose-900/50 text-sm"
                             placeholder="Enter your name"
                           />
                       </div>
                   </div>
               )}
            </div>

            {!userLocation && (
              <div className="bg-rose-900/20 border border-rose-900/50 p-3 rounded text-xs text-rose-400 flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                No GPS. We'll place your heart in a random location.
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 disabled:text-rose-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/50"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Heart className="w-5 h-5 fill-current" />}
              {isSubmitting ? 'Sending Love...' : 'Share with the World'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GlobeView3D({ comments, onZoomIn }: { comments: CommentData[], onZoomIn: (lat: number, lng: number) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isReadyForTransition, setIsReadyForTransition] = useState(false);
  
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const globeRef = useRef<any>(null);
  const earthMeshRef = useRef<any>(null); 
  const markersRef = useRef<any[]>([]);
  const raycasterRef = useRef<any>(null);
  const clockRef = useRef<any>(null); 

  useEffect(() => {
    const timer = setTimeout(() => setIsReadyForTransition(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadThree = async () => {
      if (window.THREE && window.THREE.OrbitControls) {
        setLoaded(true);
        return;
      }
      if (!document.getElementById('three-script')) {
        const script = document.createElement('script');
        script.id = 'three-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          if (!document.getElementById('orbit-script')) {
            const cScript = document.createElement('script');
            cScript.id = 'orbit-script';
            cScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
            cScript.onload = () => setLoaded(true);
            document.body.appendChild(cScript);
          } else {
             setLoaded(true);
          }
        };
        document.body.appendChild(script);
      } else {
         const checkInterval = setInterval(() => {
            if (window.THREE && window.THREE.OrbitControls) {
                clearInterval(checkInterval);
                setLoaded(true);
            }
         }, 100);
      }
    };
    loadThree();
  }, []);

  useEffect(() => {
    if (!loaded || !mountRef.current || sceneRef.current) return;
    const THREE = window.THREE;
    if (!THREE.OrbitControls) return;

    const WIDTH = mountRef.current.clientWidth;
    const HEIGHT = mountRef.current.clientHeight;

    clockRef.current = new THREE.Clock();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0005); 
    scene.fog = new THREE.FogExp2(0x0f0005, 0.002);

    const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping; 
    renderer.toneMappingExposure = 1.5; 
    mountRef.current.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5.5; 
    controls.maxDistance = 30;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    raycasterRef.current = new THREE.Raycaster();

    const globeGroup = new THREE.Group();
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
      map: textureLoader.load(EARTH_TEXTURE_URL),
      bumpMap: textureLoader.load(EARTH_BUMP_URL),
      bumpScale: 0.05,
      specular: new THREE.Color(0x330000), 
      shininess: 15,
    });
    const earth = new THREE.Mesh(geometry, material);
    earthMeshRef.current = earth; 
    globeGroup.add(earth);

    // Atmosphere
    const atmosGeo = new THREE.SphereGeometry(5.2, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xff0066, 
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // Lights
    scene.add(new THREE.AmbientLight(0xffcccc, 0.2)); 
    const sunLight = new THREE.DirectionalLight(0xffdddd, 1.5);
    sunLight.position.set(20, 10, 10);
    scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0xff00ff, 0.8);
    rimLight.position.set(-20, 0, -20);
    scene.add(rimLight);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(3000 * 3);
    for(let i=0; i<9000; i++) posArray[i] = (Math.random() - 0.5) * 200;
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0xffddee, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(starGeo, starMat));

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const animate = () => {
      requestAnimationFrame(animate);
      if (sceneRef.current && clockRef.current) {
          const elapsed = clockRef.current.getElapsedTime();
          controls.update();

          // Dynamic Sensitivity
          const dist = camera.position.distanceTo(controls.target);
          controls.rotateSpeed = dist * 0.02; 
          controls.zoomSpeed = dist * 0.04;   

          // Pulse Animation
          const pulseScale = Math.sin(elapsed * 5) * 0.2 + 1.2; 
          const pulseIntensity = Math.sin(elapsed * 5) * 0.5 + 1.5; 

          markersRef.current.forEach((mesh, idx) => {
              if (idx % 2 === 0) {
                 if (mesh.material) {
                     mesh.material.opacity = (Math.sin(elapsed * 5) * 0.3 + 0.6);
                     mesh.material.emissiveIntensity = pulseIntensity;
                 }
              } else {
                 mesh.scale.set(pulseScale, pulseScale, pulseScale);
                 if (mesh.material) {
                    mesh.material.emissiveIntensity = pulseIntensity * 1.5;
                 }
              }
          });

          renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [loaded]);

  // Zoom Check
  useEffect(() => {
    if (!loaded || !controlsRef.current || !isReadyForTransition) return;
    
    const checkZoomLoop = setInterval(() => {
        const controls = controlsRef.current;
        const camera = cameraRef.current;
        const raycaster = raycasterRef.current;
        const earthMesh = earthMeshRef.current;

        if (!controls || !camera || !raycaster || !earthMesh) return;

        const dist = camera.position.distanceTo(controls.target);
        if (dist < 6.5) {
            raycaster.setFromCamera({ x: 0, y: 0 }, camera);
            const intersects = raycaster.intersectObject(earthMesh);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const radius = 5; 
                const phi = Math.acos(point.y / radius);
                const lat = 90 - (phi * 180 / Math.PI);
                const theta = Math.atan2(point.z, -point.x);
                let lng = (theta * 180 / Math.PI) - 180;
                if (lng < -180) lng += 360;
                if (lng > 180) lng -= 360;

                onZoomIn(lat, lng); 
            }
        }
    }, 200);

    return () => clearInterval(checkZoomLoop);
  }, [loaded, isReadyForTransition]);

  // Markers
  useEffect(() => {
    if (!sceneRef.current || !globeRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const globe = globeRef.current;

    markersRef.current.forEach(m => globe.remove(m));
    markersRef.current = [];

    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo( x + .25, y + .25 );
    heartShape.bezierCurveTo( x + .25, y + .25, x + .20, y, x, y );
    heartShape.bezierCurveTo( x - .30, y, x - .30, y + .35,x - .30, y + .35 );
    heartShape.bezierCurveTo( x - .30, y + .55, x - .10, y + .77, x + .25, y + .95 );
    heartShape.bezierCurveTo( x + .60, y + .77, x + .80, y + .55, x + .80, y + .35 );
    heartShape.bezierCurveTo( x + .80, y + .35, x + .80, y, x + .50, y );
    heartShape.bezierCurveTo( x + .35, y, x + .25, y + .25, x + .25, y + .25 );

    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
    const heartGeometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
    heartGeometry.center(); 
    heartGeometry.scale(0.3, 0.3, 0.3);
    heartGeometry.rotateX(Math.PI); 
    
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    };

    comments.forEach(c => {
      const radius = 5;
      const height = 0.5 + Math.random() * 0.8;
      
      const geometry = new THREE.CylinderGeometry(0.02, 0.06, height, 8); 
      geometry.translate(0, height / 2, 0);
      geometry.rotateX(Math.PI / 2);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xff1493,     
        emissive: 0xff0080,  
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });
      const beam = new THREE.Mesh(geometry, material);
      const pos = latLngToVector3(c.lat, c.lng, radius);
      beam.position.copy(pos);
      beam.lookAt(0,0,0);
      
      const heartMat = new THREE.MeshPhongMaterial({ 
          color: 0xffffff, 
          emissive: 0xff0080,
          emissiveIntensity: 2,
          shininess: 100
      });
      const heartMesh = new THREE.Mesh(heartGeometry, heartMat);
      heartMesh.position.copy(pos);
      heartMesh.lookAt(0,0,0); 
      
      globe.add(beam);
      globe.add(heartMesh);
      markersRef.current.push(beam, heartMesh);
    });
  }, [comments, loaded]);

  return <div ref={mountRef} className="absolute inset-0 z-0 bg-[#0f0005] cursor-move" />;
}

function SurfaceMapView({ comments, center }: { comments: CommentData[], center: {lat: number, lng: number} }) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.L && window.L.map) {
      setLoaded(true);
      return;
    }
    if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    } else {
        const checkInterval = setInterval(() => {
            if (window.L && window.L.map) {
                clearInterval(checkInterval);
                setLoaded(true);
            }
        }, 100);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L || !L.map) return;
    
    try {
        const map = L.map(containerRef.current, {
          zoomControl: false, 
          attributionControl: false,
          maxBounds: [[-90, -180], [90, 180]],
          maxBoundsViscosity: 1.0,
          minZoom: 2
        }).setView([center.lat, center.lng], 5);

        L.tileLayer(MAP_TILE_URL, { 
            attribution: MAP_ATTRIBUTION,
            noWrap: true,
            maxZoom: 19
        }).addTo(map);

        L.tileLayer(MAP_LABEL_URL, {
            noWrap: true,
            maxZoom: 19,
            pane: 'overlayPane'
        }).addTo(map);

        mapRef.current = map;
    } catch (e) {
        console.error("Leaflet initialization failed", e);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, [loaded]);

  // Update Markers (Heart Icons)
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    const heartSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 5px #ec4899);">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;

    const heartIcon = L.divIcon({
        className: 'custom-heart-icon',
        html: `<div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${heartSvg}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    comments.forEach(c => {
      let dateString = "Just now";
      if (c.createdAt) {
          dateString = c.createdAt.toDate().toLocaleDateString(undefined, { 
              year: 'numeric', month: 'short', day: 'numeric' 
          });
      }

      L.marker([c.lat, c.lng], { icon: heartIcon })
       .addTo(map)
       .bindTooltip(
         `<div class="text-center font-serif text-sm min-w-[150px]">
            <span class="block italic text-rose-900">"${c.text}"</span>
            <div class="flex items-center justify-center gap-1 mt-2 text-[10px] text-rose-500 font-bold border-t border-rose-200 pt-1">
               <span>— ${c.isAnonymous ? 'Anonymous' : (c.authorName || 'Unknown')}</span>
               <span class="text-rose-300">•</span>
               <span class="text-rose-400 font-normal">${dateString}</span>
            </div>
          </div>`, 
         {
          direction: 'top',
          className: 'love-tooltip',
          offset: [0, -14]
      });
      
      L.circleMarker([c.lat, c.lng], {
        color: 'transparent',
        fillColor: '#ec4899',
        fillOpacity: 0.2,
        radius: 20
      }).addTo(map);
    });
  }, [comments, loaded]);

  return (
    <div className="absolute inset-0 z-0 bg-[#0f0005] animate-in fade-in duration-1000">
       <style>{`
         .love-tooltip {
           background: rgba(255, 241, 242, 0.95);
           border: 1px solid #fda4af;
           color: #be185d;
           font-family: serif;
           padding: 8px 12px;
           box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
           border-radius: 8px;
         }
         .love-tooltip:before {
           border-top-color: #fda4af;
         }
       `}</style>
       <div ref={containerRef} className="w-full h-full grayscale-[20%] contrast-[1.1]" />
    </div>
  );
}

// --- Main Application ---
export default function LoveNetApp() {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // View State: 'ORBIT' (3D) or 'SURFACE' (2D)
  const [viewMode, setViewMode] = useState<'ORBIT' | 'SURFACE'>('ORBIT');
  const [focusCoords, setFocusCoords] = useState<{lat: number, lng: number}>({ lat: 20, lng: 0 });
  
  const [showHistory, setShowHistory] = useState(false);

  // 1. Authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching
  useEffect(() => {
    if (!user) return;
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME); 
    const q = query(collectionRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: CommentData[] = [];
      snapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as CommentData));
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setComments(items);
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  // 3. Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => console.log("Loc denied")
      );
    }
  }, []);

  // 4. Stats Calculation
  const stats: StatCounts = useMemo(() => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneYear = 365 * oneDay;
    let counts = { day: 0, week: 0, month: 0, year: 0 };
    comments.forEach(c => {
      if (!c.createdAt) return;
      const date = c.createdAt.toDate();
      const diff = now.getTime() - date.getTime();
      if (diff < oneDay) counts.day++;
      if (diff < oneWeek) counts.week++;
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) counts.month++;
      if (diff < oneYear) counts.year++;
    });
    return counts;
  }, [comments]);

  // 5. Visible Comments Filtering
  const visibleComments = useMemo(() => {
    if (showHistory && user && !user.isAnonymous) {
        return comments.filter(c => c.uid === user.uid);
    } else {
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        return comments.filter(c => {
            if (!c.createdAt) return false;
            return (now.getTime() - c.createdAt.toDate().getTime()) < oneDay;
        });
    }
  }, [comments, showHistory, user]);

  // --- Handlers ---
  const handleSwitchToSurface = (lat: number, lng: number) => {
    if (isNaN(lat) || isNaN(lng)) return;
    setFocusCoords({ lat, lng });
    setViewMode('SURFACE');
  };

  const handleSwitchToOrbit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewMode('ORBIT');
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowHistory(true); 
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert("Login unavailable in Preview: This domain is not authorized in Firebase. It will work once you publish the site.");
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth); 
    } catch (error: any) {
      console.log("Logout cleanup error:", error);
    }
    setShowHistory(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0005] text-rose-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0f0005] text-rose-50 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* --- VIEWPORT --- */}
      {viewMode === 'ORBIT' ? (
        <GlobeView3D comments={visibleComments} onZoomIn={handleSwitchToSurface} />
      ) : (
        <SurfaceMapView comments={visibleComments} center={focusCoords} />
      )}

      {/* --- SURFACE CONTROLS --- */}
      {viewMode === 'SURFACE' && (
       <div 
         className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-auto"
         onMouseDown={(e) => e.stopPropagation()} 
         onTouchStart={(e) => e.stopPropagation()}
         onClick={(e) => e.stopPropagation()}
       >
         <button 
           onClick={handleSwitchToOrbit}
           className="bg-black/80 hover:bg-rose-950/80 text-rose-400 border border-rose-500/50 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer active:scale-95 select-none hover:shadow-rose-900/40"
         >
           <Rocket className="w-4 h-4" />
           RETURN TO ORBIT
         </button>
       </div>
      )}

      {/* --- HUD --- */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-black/60 backdrop-blur-md border border-rose-900/50 rounded-lg px-4 py-3 shadow-xl shadow-rose-900/10 pointer-events-auto flex items-start gap-3">
             <div className="p-1.5 bg-rose-600 rounded-full animate-pulse shadow-lg shadow-rose-600/50 mt-1">
                <Heart className="text-white w-5 h-5 fill-current" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600 lowercase" style={{ fontFamily: 'Georgia, serif' }}>love.net</h1>
               
               <div className="text-[10px] text-rose-400/80 font-mono tracking-widest uppercase flex items-center gap-1 mb-2">
                 {showHistory ? <Sparkles className="w-3 h-3 text-yellow-400" /> : (viewMode === 'ORBIT' ? <Globe className="w-3 h-3" /> : <MapIcon className="w-3 h-3" />)}
                 {showHistory ? 'MY CONSTELLATION' : 'LIVE HEARTBEAT'}
               </div>

               {/* --- USER / SESSION INFO --- */}
               <div className="flex flex-wrap items-center gap-2 mt-1 border-t border-rose-900/30 pt-2">
                  {user?.isAnonymous ? (
                    <>
                      <div className="group relative flex items-center gap-1 text-[10px] text-rose-500 bg-rose-950/30 px-2 py-1 rounded cursor-help">
                         <Info className="w-3 h-3" />
                         <span>Guest Session</span>
                      </div>
                      <button 
                        onClick={handleGoogleLogin}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded text-[10px] font-bold shadow flex items-center gap-1 transition-all"
                      >
                        <LogIn className="w-3 h-3" />
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 bg-rose-950/30 px-2 py-1 rounded border border-rose-900/30">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-4 h-4 rounded-full border border-rose-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-rose-800 flex items-center justify-center text-[8px]">
                            {user?.displayName?.[0] || <UserIcon className="w-2 h-2" />}
                          </div>
                        )}
                        <span className="text-[10px] text-rose-200 font-medium max-w-[100px] truncate">{user?.displayName || 'User'}</span>
                      </div>
                      
                      <button 
                        onClick={() => setIsAdminOpen(true)}
                        className="text-[10px] flex items-center gap-1 text-rose-400 hover:text-white px-2 py-1 rounded hover:bg-rose-900/50 transition-colors"
                      >
                        <BarChart3 className="w-3 h-3" />
                        Admin
                      </button>

                      <button onClick={handleLogout} className="text-[10px] text-rose-400 hover:text-rose-200 underline ml-2">
                        Sign Out
                      </button>
                    </>
                  )}
               </div>

             </div>
          </div>

          <div className="flex gap-2 pointer-events-auto overflow-x-auto max-w-full pb-2 md:pb-0">
            <StatCard label="24h Love" count={stats.day} icon={<Clock className="w-3 h-3" />} />
            <StatCard label="Week" count={stats.week} icon={<Activity className="w-3 h-3" />} />
            <StatCard label="Month" count={stats.month} icon={<Calendar className="w-3 h-3" />} />
            <StatCard label="Total" count={stats.year} icon={<Flame className="w-3 h-3" />} />
          </div>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-3 pointer-events-auto">
        
        <button
          onClick={() => {
            if (user?.isAnonymous) {
              if (confirm("You must sign in to view your history. Sign in with Google?")) {
                handleGoogleLogin();
              }
            } else {
              setShowHistory(!showHistory);
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 text-xs uppercase tracking-wider backdrop-blur-md border ${showHistory ? 'bg-rose-900/80 border-rose-500 text-white' : 'bg-black/40 border-rose-900/50 text-rose-400 hover:bg-black/60'}`}
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Return to Live Feed' : 'My History'}
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-full shadow-2xl shadow-rose-600/40 transition-all transform hover:scale-105 active:scale-95"
        >
          <Heart className="w-5 h-5 fill-current" />
          <span className="hidden md:block">I Fell In Love</span>
        </button>
      </div>

      {/* --- MODALS --- */}
      {isModalOpen && (
        <CommentModal 
          onClose={() => setIsModalOpen(false)} 
          userLocation={userLocation}
          appId={appId}
          user={user} 
        />
      )}

      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

// --- Global Types for Three.js & Leaflet ---
declare global {
  interface Window {
    THREE: any;
    L: any;
  }
}