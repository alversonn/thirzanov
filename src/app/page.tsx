'use client';
import React, { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { Bounds, Center } from "@react-three/drei";

/* =====================================================
   Config
   ===================================================== */
const RECIPIENT = "Thirza Novalia, S.S.";
const SENDER = "Alif";

const THEMES = {
  lily: {
    bg: "from-rose-50 via-fuchsia-50 to-indigo-50",
    card: "bg-white/70 backdrop-blur",
    textAccent: "text-rose-700",
    button: "bg-black text-white hover:opacity-90",
  },
  shinobi: {
    bg: "from-amber-50 via-orange-50 to-stone-50",
    card: "bg-white/70 backdrop-blur",
    textAccent: "text-amber-800",
    button: "bg-stone-900 text-white hover:opacity-90",
  },
};

const HERO_COPY = {
  lily: `Congratulations on your final defense, ${RECIPIENT}🤩🥳. Like a lily that rises with quiet grace, your work has bloomed in full. Keep your feet humble and your vision steady as you step forward.`,
  shinobi: `Congratulations on your final defense, ${RECIPIENT}🤩🥳. In the way of a shinobi, true strength is quiet and resolve steady. You moved with discipline, stayed the course, and met the moment. Walk forward with calm confidence your nindō is clear.`,
};

/* =====================================================
   Helpers
   ===================================================== */
const Section = ({ id, children }) => <section id={id} className="py-16">{children}</section>;

const NavLink = ({ active, children, ...props }) => (
  <a {...props} className={`text-sm tracking-wide px-3 py-2 rounded-full transition ${active ? "bg-black text-white" : "hover:bg-black/5"}`}>{children}</a>
);

/* =====================================================
   3D Models (GLB local)
   Put files in: public/models/lilies.glb & public/models/uzumaki.glb
   ===================================================== */
function LilyModel(props) {
  const { scene } = useGLTF("/models/lilies.glb");
  return <primitive object={scene} {...props} />;
}
function NarutoModel(props) {
  const { scene } = useGLTF("/models/uzumaki.glb");
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("/models/lilies.glb");
useGLTF.preload("/models/uzumaki.glb");

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-full bg-white/90 shadow text-sm">Loading {progress.toFixed(0)}%</div>
    </Html>
  );
}

const ModelViewer = ({ mode }) => (
  <div className="w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow ring-1 ring-black/10 bg-transparent">
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [1.6, 1.2, 2.2], fov: 45 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 2]} intensity={0.9} />
      <spotLight position={[-4, 6, 2]} angle={0.35} penumbra={0.6} intensity={0.7} />
      <Suspense fallback={<Loader />}>        
        {/* Auto-center & auto-fit any model so it isn't cropped or off-screen */}
        <Bounds fit clip observe margin={1.2}>
          <Center top>
            {mode === "lily" ? (
              <LilyModel />
            ) : (
              <NarutoModel />
            )}
          </Center>
        </Bounds>
      </Suspense>
      {/* Gentle camera controls */}
      <OrbitControls makeDefault enablePan={false} minDistance={1.2} maxDistance={4} />
    </Canvas>
  </div>
);

/* =====================================================
   Main – Landing (Home & Letter only)
   ===================================================== */
export default function GiftWebThirzaLanding3D() {
  const [mode, setMode] = useState("lily"); // lily | shinobi
  const [tab, setTab] = useState("home"); // home | letter
  const [mounted, setMounted] = useState(false);
  const theme = THEMES[mode];

  // Avoid SSR hydration mismatch for 3D Canvas
  useEffect(() => setMounted(true), []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} text-slate-800`}>
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2">
            <NavLink href="#home" onClick={() => setTab("home")} active={tab === "home"}>HOME</NavLink>
            <NavLink href="#letter" onClick={() => setTab("letter")} active={tab === "letter"}>LETTER</NavLink>
          </nav>
          <div className={`text-sm font-semibold tracking-wider ${theme.textAccent}`}>THIRZA • {RECIPIENT}</div>
          <button
            aria-label="Toggle theme"
            onClick={() => setMode(mode === "lily" ? "shinobi" : "lily")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow hover:bg-white"
          >
            {mode === "lily" ? (<><Sun className="w-4 h-4" /><span className="text-xs">Shinobi</span></>) : (<><Moon className="w-4 h-4" /><span className="text-xs">Lily</span></>)}
          </button>
        </div>
      </header>

      {/* HERO (HOME) */}
      <Section id="home">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left – copy */}
          <div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-5xl md:text-6xl font-extrabold leading-tight ${theme.textAccent}`}>
              Thirza Novalia 
              <br />
              Ramdayani Suyoto
            </motion.h1>
            <p className="mt-6 max-w-md text-slate-700 leading-7">{HERO_COPY[mode]}</p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#letter" onClick={() => setTab("letter")} className={`px-5 py-2 rounded-full ${theme.button}`}>Read the Letter</a>
            </div>
          </div>
          {/* Right – 3D viewer replaces person-with-bouquet */}
          <div className="flex justify-center lg:justify-end">
            <ModelViewer mode={mode} />
          </div>
        </div>
      </Section>

      {/* LETTER */}
      <Section id="letter">
        <div className="max-w-3xl mx-auto px-6">
          <div className={`rounded-3xl ${theme.card} shadow p-6 md:p-8`}>
            <div className="text-2xl font-bold mb-2">A Letter from {SENDER}</div>
            <p className="leading-8 text-slate-700">
              Thirza, I admire how you stayed patient through revisions and honest with the process. The way you carried yourself calm, steady, and kind, says as much as the pages you wrote. Today is not only a result, it is a reflection of character.
            </p>
            <p className="leading-8 text-slate-700 mt-4">
              We have known each other for only about two months, it has meant far more than the calendar can show. The ease of our conversations, how quickly we found trust, and the small moments of encouragement, these made friendship come naturally and fast. I am grateful for that.
            </p>
            <p className="leading-8 text-slate-700 mt-4">
              I hope this friendship lasts a long time, even as life grows and changes. If one day I have a partner, or you do, I still want us to remain friends respectful, clear, and steady. Good friendships do not compete with love; they make room for it. I will do my part to keep that space thoughtful and kind.
            </p>
            <p className="leading-8 text-slate-700 mt-4">
              You can rely on me, whether you need practical help, quiet company, or honest perspective. I may not always have the perfect words, but you will always have my attention and my effort. When days are heavy, I will listen; when you win, I will be the first to celebrate.
            </p>
            <p className="leading-8 text-slate-700 mt-4">
              For now, take in this moment. Your work stands, and so do you. May this new chapter bring calm confidence and generous opportunities. I am proud of you and thankful for the friendship we’re building.
            </p>
            <p className="mt-4">— {SENDER}</p>
          </div>
        </div>
      </Section>

      <footer className="py-10 text-center text-sm opacity-70">Crafted with ✨ by {SENDER} • For Thirza Novalia </footer>
    </div>
  );
}
