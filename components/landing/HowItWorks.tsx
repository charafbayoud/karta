import { SectionLabel } from "./SectionLabel";

const steps = [
  { number: "01", title: "Select your available time" },
  { number: "02", title: "Choose your riding level" },
  { number: "03", title: "Pick your goal for today" },
  { number: "04", title: "Get an instant route recommendation" },
];

export function HowItWorks() {
  return (
    <section className="landing-section landing-section-alt">
      <div className="container-wide">
        <div className="landing-section-header">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="landing-section-title">Four steps. One route.</h2>
        </div>
        <ol className="landing-steps">
          {steps.map((step) => (
            <li key={step.number} className="landing-step-card">
              <span className="font-data landing-step-number">{step.number}</span>
              <p className="landing-step-title">{step.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
