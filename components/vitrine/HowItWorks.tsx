import { StepPreview } from "@/components/vitrine/previews/StepPreview";

const STEPS = [
  {
    number: "01",
    title: "Set your ride",
    body: "Choose sport and target distance. Indoor: time, level, and goal. Outdoor: 30–100 km loops tuned to your selection.",
    variant: "configure" as const,
  },
  {
    number: "02",
    title: "Pick your start",
    body: "Drop a pin on the map or use your location. We pull popular Strava segments nearby and route on real roads.",
    variant: "location" as const,
  },
  {
    number: "03",
    title: "Ride with confidence",
    body: "Download GPX for Garmin or Wahoo, save to My Routes, or jump straight into Zwift with your matched indoor pick.",
    variant: "export" as const,
  },
];

export function HowItWorks() {
  return (
    <section className="v2-section v2-section-muted" id="how-it-works">
      <div className="v2-section-inner">
        <div className="section-head section-head--wide">
          <p className="karta-label">How it works</p>
          <h2>Three steps. Zero guesswork.</h2>
        </div>
        <div className="mk-steps">
          {STEPS.map((step) => (
            <article key={step.number} className="mk-step-card">
              <span className="mk-step-number font-data">{step.number}</span>
              <StepPreview variant={step.variant} />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
