import { EmailForm } from "./EmailForm";
import { SectionLabel } from "./SectionLabel";

export function FinalCTA() {
  return (
    <section className="landing-section landing-section-alt">
      <div className="container-narrow">
        <div className="landing-final-card">
          <SectionLabel>Join the waitlist</SectionLabel>
          <h2 className="landing-section-title landing-final-title">
            Be among the first riders to try KARTA.
          </h2>
          <EmailForm variant="final" />
        </div>
      </div>
    </section>
  );
}
