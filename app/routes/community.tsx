import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getProjects } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community | Roomly" },
    { name: "description", content: "Explore architectural renders shared by the Roomly community." },
  ];
}

export default function Community() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const items = await getProjects();
      setProjects(items);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="home">
      <Navbar />

      <section className="hero" style={{ paddingBottom: "2rem" }}>
        <div className="announce" data-animate>
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Community Gallery</p>
        </div>

        <h1 data-animate data-delay="100">See what others are building with Roomly</h1>

        <p className="subtitle" data-animate data-delay="200">
          Explore photorealistic renders shared by designers and architects around the world. Get inspired, then build your own.
        </p>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head" data-animate>
            <div className="copy">
              <h2>Public Renders</h2>
              <p>Latest architectural visualizations from the community.</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users size={16} />
              <span>{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24 text-gray-400">
              Loading community projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <Users size={48} className="text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-500">No public projects yet</h3>
              <p className="text-gray-400 max-w-sm">
                Be the first to share your architectural render with the community.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Start Building
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
                <div
                  key={id}
                  className="project-card group"
                  data-animate
                  onClick={() => navigate(`/visualizer/${id}`)}
                >
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt={name} />
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
                      </div>
                    </div>
                    <div className="arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
