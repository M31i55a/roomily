import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers, X} from "lucide-react";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import {useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";
import {createProject, getProjects} from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomly | AI-powered Architectural Visualization" },
    { name: "description", content: "Transform 2D floor plans into photorealistic 3D renders with Roomly." },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const isCreatingProjectRef = useRef(false);
    const [showDemo, setShowDemo] = useState(false);

    const handleUploadComplete = async (base64Image: string) => {
        try {

            if(isCreatingProjectRef.current) return false;
            isCreatingProjectRef.current = true;
            const newId = Date.now().toString();
            const name = `Residence ${newId}`;

            const newItem = {
                id: newId, name, sourceImage: base64Image,
                renderedImage: undefined,
                timestamp: Date.now()
            }

            const saved = await createProject({ item: newItem, visibility: 'private' });

            if(!saved) {
                console.error("Failed to create project");
                return false;
            }

            setProjects((prev) => [saved, ...prev]);

            navigate(`/visualizer/${newId}`, {
                state: {
                    initialImage: saved.sourceImage,
                    initialRendered: saved.renderedImage || null,
                    name
                }
            });

            return true;
        } finally {
            isCreatingProjectRef.current = false;
        }
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const items = await getProjects();

            setProjects(items)
        }

        fetchProjects();
    }, []);

  return (
      <>
      <div className="home">
          <Navbar />

          <section className="hero">
              <div className="announce" data-animate>
                  <div className="dot">
                      <div className="pulse"></div>
                  </div>

                  <p>Introducing Roomly 2.0</p>
              </div>

              <h1 data-animate data-delay="100">Build beautiful spaces at the speed of thought with Roomly</h1>

              <p className="subtitle" data-animate data-delay="200">
                  Roomly is an AI-first design environment that helps you visualize, render, and ship architectural projects faster than ever.
              </p>

              <div className="actions" data-animate data-delay="300">
                  <a href="#upload" className="cta">
                      Start Building <ArrowRight className="icon" />
                  </a>

                  <Button variant="outline" size="lg" className="demo" onClick={() => setShowDemo(true)}>
                      Watch Demo
                  </Button>
              </div>

              <div id="upload" className="upload-shell" data-animate data-delay="400">
                <div className="grid-overlay" />

                  <div className="upload-card">
                      <div className="upload-head">
                          <div className="upload-icon">
                              <Layers className="icon" />
                          </div>

                          <h3>Upload your floor plan</h3>
                          <p>Supports JPG, PNG, formats up to 10MB</p>
                      </div>

                      <Upload onComplete={handleUploadComplete} />
                  </div>
              </div>
          </section>

          <section className="projects">
              <div className="section-inner">
                  <div className="section-head" data-animate>
                      <div className="copy">
                          <h2>Projects</h2>
                          <p>Your latest work and shared community projects, all in one place.</p>
                      </div>
                  </div>

                  <div className="projects-grid">
                      {projects.map(({id, name, renderedImage, sourceImage, timestamp}) => (
                          <div key={id} className="project-card group" data-animate onClick={() => navigate(`/visualizer/${id}`)}>
                              <div className="preview">
                                  <img  src={renderedImage || sourceImage} alt="Project"
                                  />

                                  <div className="badge">
                                      <span>Community</span>
                                  </div>
                              </div>

                              <div className="card-body">
                                  <div>
                                      <h3>{name}</h3>

                                      <div className="meta">
                                          <Clock size={12} />
                                          <span>{new Date(timestamp).toLocaleDateString()}</span>
                                          <span>By JS Mastery</span>
                                      </div>
                                  </div>
                                  <div className="arrow">
                                      <ArrowUpRight size={18} />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      </div>

      {showDemo && (
          <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              onClick={() => setShowDemo(false)}
          >
              <div
                  className="relative w-full max-w-3xl mx-4 rounded-xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button
                      onClick={() => setShowDemo(false)}
                      className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition"
                      aria-label="Close demo"
                  >
                      <X size={20} />
                  </button>
                  <video
                      src="/roomly.mp4"
                      controls
                      autoPlay
                      className="w-full block"
                  />
              </div>
          </div>
      )}
  </>
  )
}
