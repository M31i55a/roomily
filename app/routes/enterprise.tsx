import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import { ArrowRight, Building2, ShieldCheck, Zap, Users, LifeBuoy } from "lucide-react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprise | Roomly" },
    { name: "description", content: "Roomly for teams — scalable AI architectural visualization for enterprise." },
  ];
}

const FEATURES = [
  {
    icon: Building2,
    title: "Team Workspaces",
    description: "Shared project libraries with role-based access for your entire design team.",
  },
  {
    icon: Zap,
    title: "Priority AI Processing",
    description: "Dedicated rendering queue with faster turnaround times for high-volume teams.",
  },
  {
    icon: ShieldCheck,
    title: "Advanced Security",
    description: "SSO, audit logs, and data residency controls to meet your compliance requirements.",
  },
  {
    icon: Users,
    title: "Unlimited Seats",
    description: "Add as many collaborators as you need without per-seat restrictions.",
  },
  {
    icon: LifeBuoy,
    title: "Dedicated Support",
    description: "A dedicated account manager and SLA-backed support with 24/7 availability.",
  },
];

export default function Enterprise() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to a real form backend (e.g. Resend, Formspree)
    setSubmitted(true);
  };

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero" style={{ paddingBottom: "2rem" }}>
        <div className="announce" data-animate>
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Roomly for Enterprise</p>
        </div>

        <h1 data-animate data-delay="100">AI visualization, built for teams</h1>

        <p className="subtitle" data-animate data-delay="200">
          Give your entire architecture or interior design team access to Roomly's AI rendering engine — with the security, scale, and support that enterprises require.
        </p>

        <div className="actions" data-animate data-delay="300">
          <a href="#contact" className="cta">
            Talk to Sales <ArrowRight className="icon" />
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="projects projects--dark">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Everything your team needs</h2>
              <p>All the power of Roomly, with enterprise-grade controls and support.</p>
            </div>
          </div>

          <div className="projects-grid">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="project-card" data-animate style={{ cursor: "default" }}>
                <div className="card-body" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "var(--color-surface-highlight)",
                    }}
                  >
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 style={{ marginBottom: "0.25rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.6 }}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="projects" style={{ paddingTop: 0 }}>
        <div className="section-inner" style={{ maxWidth: 600 }}>
          <div className="section-head">
            <div className="copy">
              <h2>Get in touch</h2>
              <p>Tell us about your team and we'll reach out to set up a demo.</p>
            </div>
          </div>

          {submitted ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                background: "var(--color-surface)",
                border: "2px solid #1a1a1a",
                boxShadow: "var(--shadow-neobrutalism)",
                borderRadius: 12,
              }}
            >
              <ShieldCheck size={48} className="text-primary" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ marginBottom: "0.5rem" }}>Message received!</h3>
              <p style={{ color: "#6b7280" }}>We'll get back to you within one business day.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: "var(--color-surface)",
                border: "2px solid #1a1a1a",
                boxShadow: "var(--shadow-neobrutalism)",
                borderRadius: 12,
                padding: "2rem",
              }}
            >
              {(
                [
                  { id: "name", label: "Your name", type: "text", placeholder: "Jane Smith" },
                  { id: "email", label: "Work email", type: "email", placeholder: "jane@company.com" },
                  { id: "company", label: "Company", type: "text", placeholder: "Acme Design Studio" },
                ] as const
              ).map(({ id, label, type, placeholder }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label htmlFor={id} style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[id as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                    style={{
                      padding: "0.625rem 0.875rem",
                      border: "1.5px solid #d1d5db",
                      borderRadius: 8,
                      fontSize: "0.9375rem",
                      background: "var(--color-background)",
                      outline: "none",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label htmlFor="message" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  How can we help?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your team size and use case..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{
                    padding: "0.625rem 0.875rem",
                    border: "1.5px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: "0.9375rem",
                    background: "var(--color-background)",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <button
                type="submit"
                className="cta"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                Send message <ArrowRight className="icon" style={{ display: "inline", marginLeft: 6 }} />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
